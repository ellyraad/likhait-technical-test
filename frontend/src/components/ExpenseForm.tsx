/**
 * Form component for adding/editing expenses
 */

import React from "react";
import { COLORS } from "../constants/colors";
import { Category, ExpenseFormData } from "../types";
import { Button } from "../vibes/Button";
import { SelectBox } from "../vibes/SelectBox";
import { TextField } from "../vibes/TextField";
import { useExpenseForm } from "../hooks/useExpenseForm";

interface ExpenseFormProps {
  categories: Category[];
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const submitErrorStyle: React.CSSProperties = {
  color: COLORS.danger,
  fontSize: "0.875rem",
};

export function ExpenseForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, submitError, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <SelectBox<number>
        label="Category"
        options={categoryOptions}
        value={formData.categoryId}
        onValueChange={(value) => handleChange("categoryId", value)}
        error={errors.categoryId}
        fullWidth
        required
      />

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      {submitError && <div style={submitErrorStyle}>{submitError}</div>}

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
