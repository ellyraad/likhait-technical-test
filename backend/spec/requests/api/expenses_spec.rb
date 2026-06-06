require 'rails_helper'

RSpec.describe "Api::Expenses", type: :request do
  let!(:food_category) { Category.create!(name: "Food") }
  let!(:transport_category) { Category.create!(name: "Transport") }

  describe "GET /api/expenses" do
    let!(:newer_expense) { Expense.create!(description: "Lunch", amount: 100.00, category: food_category, date: Date.current) }
    let!(:older_expense) { Expense.create!(description: "Taxi", amount: 50.00, category: transport_category, date: Date.current.beginning_of_month - 1.day) }

    it "returns all expenses with category information" do
      get "/api/expenses"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it "returns expenses in descending order by expense date" do
      get "/api/expenses"

      json = JSON.parse(response.body)
      expect(json.first["id"]).to eq(newer_expense.id)
      expect(json.last["id"]).to eq(older_expense.id)
    end

    it "filters expenses by expense date's month and year" do
      get "/api/expenses", params: { year: Date.current.year, month: Date.current.month }

      json = JSON.parse(response.body)
      expect(json.length).to eq(1)
      expect(json.first["id"]).to eq(newer_expense.id)
    end
  end

  describe "POST /api/expenses" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          expense: {
            description: "Team Lunch",
            amount: 150.50,
            category_id: food_category.id,
            date: Date.today
          }
        }
      end

      it "creates a new expense" do
        expect {
          post "/api/expenses", params: valid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["description"]).to eq("Team Lunch")
        expect(json["amount"]).to eq(150.5)
      end
    end

    context "with invalid parameters" do
      it "rejects future dates" do
        invalid_params = {
          expense: {
            description: "Future expense",
            amount: 100.00,
            category_id: food_category.id,
            date: Date.current + 1.day
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.not_to change(Expense, :count)

        expect(response).to have_http_status(:unprocessable_content)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Date can't be in the future")
      end

      it "with negative amounts" do
        invalid_params = {
          expense: {
            description: "Invalid expense",
            amount: -100.00,
            category_id: food_category.id,
            date: Date.today
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "with empty descriptions" do
        invalid_params = {
          expense: {
            description: "",
            amount: 100.00,
            category_id: food_category.id,
            date: Date.today
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end
  end

  describe "PUT /api/expenses/:id" do
    let!(:expense) do
      Expense.create!(
        description: "Lunch",
        amount: 100.00,
        category: food_category,
        date: Date.current
      )
    end

    it "rejects future dates" do
      put "/api/expenses/#{expense.id}", params: {
        expense: {
          description: "Future lunch",
          amount: 100.00,
          category_id: food_category.id,
          date: Date.current + 1.day
        }
      }, as: :json

      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Date can't be in the future")
      expect(expense.reload.date).to eq(Date.current)
    end
  end
end
