require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
      expect(json.first).to include("custom")
    end

    it "returns categories in alphabetical order with Other last" do
      Category.create!(name: "Other")

      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport", "Other" ])
    end
  end

  describe "POST /api/categories" do
    it "creates a custom category" do
      expect {
        post "/api/categories", params: { category: { name: "Home Repairs" } }, as: :json
      }.to change(Category, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Home Repairs")
      expect(json["custom"]).to be(true)
    end

    it "returns validation errors" do
      Category.create!(name: "Food")

      expect {
        post "/api/categories", params: { category: { name: "food" } }, as: :json
      }.not_to change(Category, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Name has already been taken")
    end
  end

  describe "PATCH /api/categories/:id" do
    it "updates a custom category" do
      category = Category.create!(name: "Home", custom: true)

      patch "/api/categories/#{category.id}", params: { category: { name: "Home Repairs" } }, as: :json

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Home Repairs")
      expect(category.reload.name).to eq("Home Repairs")
    end

    it "returns validation errors" do
      Category.create!(name: "Food")
      category = Category.create!(name: "Home", custom: true)

      patch "/api/categories/#{category.id}", params: { category: { name: "food" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Name has already been taken")
    end

    it "forbids updating protected categories" do
      category = Category.create!(name: "Food")

      patch "/api/categories/#{category.id}", params: { category: { name: "Groceries" } }, as: :json

      expect(response).to have_http_status(:forbidden)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Only custom categories can be modified")
      expect(category.reload.name).to eq("Food")
    end

    it "returns not found for missing categories" do
      patch "/api/categories/999999", params: { category: { name: "Groceries" } }, as: :json

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Category not found")
    end
  end

  describe "DELETE /api/categories/:id" do
    it "deletes a custom category and reassigns its expenses to Other" do
      other = Category.create!(name: "Other")
      category = Category.create!(name: "Home", custom: true)
      expense = Expense.create!(description: "Paint", amount: 120.00, category: category, date: Date.current)

      delete "/api/categories/#{category.id}"

      expect(response).to have_http_status(:no_content)
      expect(Category.exists?(category.id)).to be(false)
      expect(expense.reload.category).to eq(other)
    end

    it "forbids deleting protected categories" do
      category = Category.create!(name: "Food")

      delete "/api/categories/#{category.id}"

      expect(response).to have_http_status(:forbidden)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Only custom categories can be modified")
      expect(Category.exists?(category.id)).to be(true)
    end

    it "returns not found for missing categories" do
      delete "/api/categories/999999"

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Category not found")
    end
  end
end
