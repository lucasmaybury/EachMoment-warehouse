import { useEffect, useRef } from "react";

export type ConfirmationModalProps = {
  title?: string;
  text?: string;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
};

const ConfirmationModal = ({
  title,
  text,
  visible,
  onClose,
  onConfirm,
  children,
}: ConfirmationModalProps) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    visible ? modalRef.current.showModal() : modalRef.current.close();
  }, [visible]);

  const confirm = () => {
    onConfirm();
    onClose();
  };
  const cancel = () => {
    onClose();
  };

  const handleESC = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={modalRef}
      id="confirmation_modal"
      className="modal"
      onCancel={handleESC}
    >
      <form method="dialog" className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {text && <p className="py-4">{text}</p>}
        {children}
        <div className="modal-action">
          <button onClick={confirm} className="btn btn-info text-base-100">
            Confirm
          </button>
          <button onClick={cancel} className="btn bg-gray-400 text-base-100">
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};
export default ConfirmationModal;
