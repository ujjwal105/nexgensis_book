import { BookForm } from "@/components/books/book-form";
import { Modal } from "@/components/ui/modal";
import type { Book, BookDraft } from "@/types/book";

type BookFormModalProps = {
  book: Book | null;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookDraft) => Promise<void> | void;
};

export function BookFormModal({
  book,
  isLoading = false,
  isOpen,
  onClose,
  onSubmit,
}: BookFormModalProps) {
  const title = book ? "Edit Book" : "Add New Book";
  const description = book
    ? "Update the record and save it back into your local catalog state."
    : "Add a custom book entry to the catalog.";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <BookForm
        defaultValues={book ?? undefined}
        isLoading={isLoading}
        onSubmit={async (data) => {
          await onSubmit(data);
          onClose();
        }}
      />
    </Modal>
  );
}
