require 'rails_helper'

RSpec.describe Category, type: :model do
  it "defaults to a protected category" do
    category = Category.new(name: "Food")

    expect(category.custom).to be(false)
  end

end
