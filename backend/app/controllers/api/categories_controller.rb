class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(
      Arel.sql("CASE WHEN name = 'Other' THEN 1 ELSE 0 END"),
      :name
    )
    render json: categories.map { |category| format_category(category) }
  end

  private

  def format_category(category)
    {
      id: category.id,
      name: category.name,
      custom: category.custom,
      created_at: category.created_at,
      updated_at: category.updated_at
    }
  end
end
