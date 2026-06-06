class AddCustomToCategories < ActiveRecord::Migration[7.2]
  def change
    add_column :categories, :custom, :boolean, null: false, default: false
  end
end
