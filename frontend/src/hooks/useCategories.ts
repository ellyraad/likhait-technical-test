import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
  fetchCategories,
  updateCategory as apiUpdateCategory,
} from "../services/api";
import { Category, CategoryFormData } from "../types";

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  error: string;
  refreshCategories: () => Promise<void>;
  createCategory: (data: CategoryFormData) => Promise<Category>;
  updateCategory: (id: number, data: CategoryFormData) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCategories = useCallback(async () => {
    try {
      setError("");
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch categories",
      );
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      await refreshCategories();
      setLoading(false);
    };

    loadCategories();
  }, [refreshCategories]);

  const createCategory = useCallback(
    async (data: CategoryFormData) => {
      const category = await apiCreateCategory(data);
      await refreshCategories();
      return category;
    },
    [refreshCategories],
  );

  const updateCategory = useCallback(
    async (id: number, data: CategoryFormData) => {
      const category = await apiUpdateCategory(id, data);
      await refreshCategories();
      return category;
    },
    [refreshCategories],
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      await apiDeleteCategory(id);
      await refreshCategories();
    },
    [refreshCategories],
  );

  const value = {
    categories,
    loading,
    error,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return createElement(CategoriesContext.Provider, { value }, children);
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error("useCategories must be used within CategoryProvider");
  }

  return context;
}
