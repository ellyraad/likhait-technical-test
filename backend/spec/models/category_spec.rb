require 'rails_helper'

RSpec.describe Category, type: :model do
  it "defaults to a protected category" do
    category = Category.new(name: "Food")

    expect(category.custom).to be(false)
  end

  it "strips leading and trailing whitespace from names" do
    category = Category.create!(name: "  Home Repairs  ")

    expect(category.name).to eq("Home Repairs")
  end

  it "requires a name" do
    category = Category.new(name: "   ")

    expect(category).not_to be_valid
    expect(category.errors[:name]).to include("can't be blank")
  end

  it "limits names to 100 characters" do
    category = Category.new(name: "A" * 101)

    expect(category).not_to be_valid
    expect(category.errors[:name]).to include("is too long (maximum is 100 characters)")
  end

  it "requires case-insensitive unique names" do
    Category.create!(name: "Food")
    category = Category.new(name: "food")

    expect(category).not_to be_valid
    expect(category.errors[:name]).to include("has already been taken")
  end

  it "allows a category to change only its own casing" do
    category = Category.create!(name: "home repairs", custom: true)

    expect(category.update(name: "Home Repairs")).to be(true)
    expect(category.name).to eq("Home Repairs")
  end
end
