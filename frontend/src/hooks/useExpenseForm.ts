/**
 * Custom hook for managing expense form state and validation
 */

import { useState } from "react";
import { ExpenseFormData } from "../types";
import { formatDate } from "../utils/expenseUtils";

interface UseExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

type ExpenseFormErrors = Partial<Record<keyof ExpenseFormData, string>>;

export function useExpenseForm({ initialData, onSubmit }: UseExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId ?? null,
    date: initialData?.date || formatDate(new Date()),
  });

  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <Field extends keyof ExpenseFormData>(
    field: Field,
    value: ExpenseFormData[Field],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ExpenseFormErrors = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.categoryId === null) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        amount: "",
        description: "",
        categoryId: null,
        date: formatDate(new Date()),
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit expense",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: initialData?.amount || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId ?? null,
      date: initialData?.date || formatDate(new Date()),
    });
    setErrors({});
    setSubmitError("");
  };

  return {
    formData,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
