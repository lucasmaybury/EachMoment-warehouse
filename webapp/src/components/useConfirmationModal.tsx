import React, { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

type showConfirmationModal = (
  title: string,
  text: string,
  confirmFunctionNew: () => void,
  children?: React.ReactNode,
  cancelFunctionNew?: () => void
) => void;

type ConfirmationModalContextType = {
  showConfirmationModal: showConfirmationModal;
  hideConfirmationModal: () => void;
};
const defaultValue: ConfirmationModalContextType = {
  showConfirmationModal: () => {},
  hideConfirmationModal: () => {},
};
export const ConfirmationModalContext =
  React.createContext<ConfirmationModalContextType>(defaultValue);

const ConfirmationModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmFunction, setConfirmFunction] = useState<() => void>(() => {});
  const [cancelFunction, setCancelFunction] = useState<() => void>(() => {});
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [customContent, setCustomContent] = useState<React.ReactNode>(null);

  const showConfirmationModal: showConfirmationModal = (
    title,
    text,
    confirmFunctionNew,
    children,
    cancelFunctionNew
  ) => {
    setTitle(title);
    setText(text);
    setCustomContent(children);
    setConfirmFunction(() => confirmFunctionNew);
    setCancelFunction(() => cancelFunctionNew ?? (() => {}));
    setShowModal(true);
  };

  const hideConfirmationModal = () => {
    cancelFunction && cancelFunction();
    setConfirmFunction(() => {});
    setShowModal(false);
  };

  return (
    <>
      <ConfirmationModalContext.Provider
        value={{ showConfirmationModal, hideConfirmationModal }}
      >
        {children}
        <ConfirmationModal
          title={title}
          text={text}
          visible={showModal}
          onConfirm={confirmFunction}
          onClose={hideConfirmationModal}
        >
          {customContent}
        </ConfirmationModal>
      </ConfirmationModalContext.Provider>
    </>
  );
};

export default ConfirmationModalProvider;
