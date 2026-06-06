class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(
      Arel.sql("CASE WHEN name = 'Other' THEN 1 ELSE 0 END"),
      :name
    )
    render json: categories.map { |category| format_category(category) }
  end

  def create
    category = Category.new(category_params.merge(custom: true))

    if category.save
      render json: format_category(category), status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    category = find_category
    return render_not_found unless category
    return render_protected_category_error unless category.custom?

    if category.update(category_params)
      render json: format_category(category)
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    category = find_category
    return render_not_found unless category
    return render_protected_category_error unless category.custom?

    category.destroy_and_reassign_expenses_to!(other_category)
    head :no_content
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end

  def find_category
    Category.find_by(id: params[:id])
  end

  def other_category
    Category.find_by!(name: "Other", custom: false)
  end

  def render_not_found
    render json: { errors: [ "Category not found" ] }, status: :not_found
  end

  def render_protected_category_error
    render json: { errors: [ "Only custom categories can be modified" ] }, status: :forbidden
  end

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
