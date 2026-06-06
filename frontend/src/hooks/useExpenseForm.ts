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

const getTodayDate = () => formatDate(new Date());

const getInitialFormData = (
  initialData?: Partial<ExpenseFormData>,
  fallbackDate = getTodayDate(),
): ExpenseFormData => ({
  amount: initialData?.amount || "",
  description: initialData?.description || "",
  categoryId: initialData?.categoryId ?? null,
  date: initialData?.date || fallbackDate,
});

export function useExpenseForm({ initialData, onSubmit }: UseExpenseFormProps) {
  const maxDate = getTodayDate();
  const [formData, setFormData] = useState<ExpenseFormData>(() =>
    getInitialFormData(initialData, maxDate),
  );

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
    const today = getTodayDate();

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
    } else if (formData.date > today) {
      newErrors.date = "Date cannot be in the future";
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
      setFormData(getInitialFormData(undefined, getTodayDate()));
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
    setFormData(getInitialFormData(initialData, getTodayDate()));
    setErrors({});
    setSubmitError("");
  };

  return {
    formData,
    errors,
    submitError,
    isSubmitting,
    maxDate,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
