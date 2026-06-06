import { type CSSProperties } from "react";
import { COLORS } from "../constants/colors";
import { Category } from "../types";
import { Button } from "../vibes/Button";
import { Modal } from "../vibes/Modal";

interface DeleteCategoryModalProps {
  category: Category | null;
  deleteError: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (category: Category) => void;
}

const deleteModalStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const deleteTextStyle: CSSProperties = {
  margin: 0,
  fontSize: "16px",
  lineHeight: 1.5,
  color: COLORS.secondary.s10,
};

const deleteErrorStyle: CSSProperties = {
  color: COLORS.danger,
  fontSize: "14px",
};

const deleteActionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.5rem",
};

export function DeleteCategoryModal({
  category,
  deleteError,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  if (!category) {
    return null;
  }

  return (
    <Modal
      isOpen={Boolean(category)}
      onClose={onClose}
      title="Delete Category"
      maxWidth="420px"
    >
      <div style={deleteModalStyle}>
        <p style={deleteTextStyle}>
          Delete "{category.name}"? Existing expenses in this category will be
          moved to Other.
        </p>
        {deleteError && <div style={deleteErrorStyle}>{deleteError}</div>}
        <div style={deleteActionsStyle}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm(category)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
