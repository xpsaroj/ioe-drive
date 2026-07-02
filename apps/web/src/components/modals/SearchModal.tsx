import Modal from "@/components/ui/Modal";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal = ({
    isOpen,
    onClose,
}: SearchModalProps) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            preventCloseOnOutsideClick={false}
            title="Search..."
        >
            <input
                type="text"
                placeholder="Type to search..."
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-foreground"
            />
        </Modal>
    )
}