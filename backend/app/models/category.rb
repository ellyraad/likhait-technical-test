class Category < ApplicationRecord
  has_many :expenses, dependent: :restrict_with_error

  before_validation :strip_name

  validates :name, presence: true, length: { maximum: 100 }, uniqueness: { case_sensitive: false }

  def destroy_and_reassign_expenses_to!(replacement_category)
    transaction do
      expenses.update_all(category_id: replacement_category.id)
      destroy!
    end
  end

  private

  def strip_name
    self.name = name&.strip
  end
end
