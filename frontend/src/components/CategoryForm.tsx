import React from "react";
import { CategoryFormData } from "../types";
import { Button } from "../vibes/Button";
import { TextField } from "../vibes/TextField";

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onDelete?: () => void;
  onClose?: () => void;
  submitLabel?: string;
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const rightButtonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
};

const getButtonGroupStyle = (hasDelete: boolean): React.CSSProperties => ({
  display: "flex",
  gap: "0.5rem",
  marginTop: "1.2rem",
  justifyContent: hasDelete ? "space-between" : "flex-end",
});

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  onClose,
  submitLabel = "Add",
}) => {
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const buttonGroupStyle = getButtonGroupStyle(Boolean(onDelete));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit({ name: trimmedName });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <TextField
          label="Name"
          type="text"
          placeholder="Enter category name (e.g. Food, Transportation, etc.)"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) {
              setError("");
            }
          }}
          error={error}
          fullWidth
          required
        />

        <div style={buttonGroupStyle}>
          {onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}
          <div style={rightButtonGroupStyle}>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
