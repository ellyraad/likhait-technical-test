/**
 * API service for communicating with the backend
 */

import { Category, CategoryFormData, Expense, ExpenseFormData } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

function buildExpensePayload(data: ExpenseFormData) {
  if (data.categoryId === null) {
    throw new Error("Category is required");
  }

  return {
    description: data.description,
    amount: data.amount,
    category_id: data.categoryId,
    date: data.date,
  };
}

async function buildApiError(
  response: Response,
  fallbackMessage: string,
): Promise<Error> {
  try {
    const body = (await response.json()) as { errors?: string[] };
    if (body.errors?.length) {
      return new Error(body.errors.join(", "));
    }
  } catch {
    return new Error(fallbackMessage);
  }

  return new Error(fallbackMessage);
}

/**
 * Fetch all expenses
 */
export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

/**
 * Fetch expenses for a specific year and month
 */
export async function getExpenses(
  year: number,
  month: number,
): Promise<Expense[]> {
  const response = await fetch(
    `${API_BASE_URL}/expenses?year=${year}&month=${month}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

/**
 * Create a new category
 */
export async function createCategory(
  data: CategoryFormData,
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: data }),
  });

  if (!response.ok) {
    throw await buildApiError(response, "Failed to create category");
  }

  return response.json();
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: number,
  data: CategoryFormData,
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: data }),
  });

  if (!response.ok) {
    throw await buildApiError(response, "Failed to update category");
  }

  return response.json();
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await buildApiError(response, "Failed to delete category");
  }
}

/**
 * Create a new expense
 */
export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expense: buildExpensePayload(data) }),
  });

  if (!response.ok) {
    throw await buildApiError(response, "Failed to create expense");
  }

  return response.json();
}

/**
 * Update an existing expense
 */
export async function updateExpense(
  id: number,
  data: ExpenseFormData,
): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expense: buildExpensePayload(data) }),
  });

  if (!response.ok) {
    throw await buildApiError(response, "Failed to update expense");
  }

  return response.json();
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}
