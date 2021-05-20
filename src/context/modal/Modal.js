import React from "react";
import ReactDOM from "react-dom";
import ModalContext from "context/modal/ModalContext";

const Modal = () => {
  let { modalContent, modal } = React.useContext(ModalContext);
  if (modal) {
    return ReactDOM.createPortal(
      <div>
        {modalContent}
      </div>,
      document.querySelector("#modal-root")
    );
  } else return null;
};

export default Modal;