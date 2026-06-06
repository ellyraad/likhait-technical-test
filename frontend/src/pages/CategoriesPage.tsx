import { useReducer, type CSSProperties } from "react";
import CategoryForm from "../components/CategoryForm";
import { CategoryList } from "../components/CategoryList";
import { DeleteCategoryModal } from "../components/DeleteCategoryModal";
import { COLORS } from "../constants/colors";
import { useCategories } from "../hooks/useCategories";
import { Category, CategoryFormData } from "../types";
import { Button } from "../vibes/Button";
import { Modal } from "../vibes/Modal";

const pageStyle: CSSProperties = {
  padding: "48px 64px",
  minHeight: "100vh",
  background: COLORS.secondary.s01,
};

const titleStyleContainer: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
};

const titleStyle: CSSProperties = {
  fontSize: "40px",
  fontWeight: 700,
  color: COLORS.secondary.s10,
  margin: 0,
  flexShrink: 0,
};

interface CategoriesPageState {
  isModalOpen: boolean;
  editingCategory: Category | null;
  deletingCategory: Category | null;
  isDeleting: boolean;
  deleteError: string;
}

type CategoriesPageAction =
  | { type: "open-add" }
  | { type: "close-form" }
  | { type: "open-edit"; category: Category }
  | { type: "open-delete"; category: Category }
  | { type: "close-delete" }
  | { type: "start-delete" }
  | { type: "delete-success" }
  | { type: "delete-failure"; error: string };

const initialCategoriesPageState: CategoriesPageState = {
  isModalOpen: false,
  editingCategory: null,
  deletingCategory: null,
  isDeleting: false,
  deleteError: "",
};

function categoriesPageReducer(
  state: CategoriesPageState,
  action: CategoriesPageAction,
): CategoriesPageState {
  switch (action.type) {
    case "open-add":
      return { ...state, isModalOpen: true, editingCategory: null };
    case "close-form":
      return { ...state, isModalOpen: false, editingCategory: null };
    case "open-edit":
      return {
        ...state,
        editingCategory: action.category,
        isModalOpen: true,
      };
    case "open-delete":
      return {
        ...state,
        deletingCategory: action.category,
        deleteError: "",
        isModalOpen: false,
        editingCategory: null,
      };
    case "close-delete":
      return { ...state, deletingCategory: null, deleteError: "" };
    case "start-delete":
      return { ...state, isDeleting: true, deleteError: "" };
    case "delete-success":
      return { ...state, isDeleting: false, deletingCategory: null };
    case "delete-failure":
      return { ...state, isDeleting: false, deleteError: action.error };
  }
}

const CategoriesPage = () => {
  const {
    categories,
    loading,
    error: loadError,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [state, dispatch] = useReducer(
    categoriesPageReducer,
    initialCategoriesPageState,
  );

  const closeFormModal = () => {
    dispatch({ type: "close-form" });
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    await createCategory(data);
    closeFormModal();
  };

  const handleUpdateCategory = async (
    category: Category,
    data: CategoryFormData,
  ) => {
    await updateCategory(category.id, data);
    closeFormModal();
  };

  const closeDeleteModal = () => {
    if (state.isDeleting) {
      return;
    }

    dispatch({ type: "close-delete" });
  };

  const handleDeleteCategory = async (category: Category) => {
    dispatch({ type: "start-delete" });

    try {
      await deleteCategory(category.id);
      dispatch({ type: "delete-success" });
    } catch (error) {
      dispatch({
        type: "delete-failure",
        error:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  };

  const editingCategory = state.editingCategory;

  return (
    <div style={pageStyle}>
      <header style={titleStyleContainer}>
        <h1 style={titleStyle}>Categories</h1>

        <Button
          variant="primary"
          size="large"
          onClick={() => dispatch({ type: "open-add" })}
        >
          Add New Category
        </Button>
      </header>

      <CategoryList
        categories={categories}
        loading={loading}
        loadError={loadError}
        onEditCategory={(category) => dispatch({ type: "open-edit", category })}
      />

      <Modal
        isOpen={state.isModalOpen}
        onClose={closeFormModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          initialData={editingCategory ? { name: editingCategory.name } : undefined}
          onSubmit={
            editingCategory
              ? (data) => handleUpdateCategory(editingCategory, data)
              : handleAddCategory
          }
          onDelete={
            editingCategory
              ? () => dispatch({ type: "open-delete", category: editingCategory })
              : undefined
          }
          onClose={closeFormModal}
          submitLabel={editingCategory ? "Save" : "Add"}
        />
      </Modal>

      <DeleteCategoryModal
        category={state.deletingCategory}
        deleteError={state.deleteError}
        isDeleting={state.isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoriesPage;
