require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { Category.create!(name: "Food") }

  it "allows today's date" do
    expense = Expense.new(
      description: "Lunch",
      amount: 100.00,
      category: category,
      date: Date.current
    )

    expect(expense).to be_valid
  end

  it "allows past dates" do
    expense = Expense.new(
      description: "Lunch",
      amount: 100.00,
      category: category,
      date: Date.current - 1.day
    )

    expect(expense).to be_valid
  end

  it "rejects future dates" do
    expense = Expense.new(
      description: "Lunch",
      amount: 100.00,
      category: category,
      date: Date.current + 1.day
    )

    expect(expense).not_to be_valid
    expect(expense.errors[:date]).to include("can't be in the future")
  end
end
