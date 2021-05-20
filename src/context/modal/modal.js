import React from "react";
import ReactDOM from "react-dom";
import ModalContext from "context/modal/ModalContext";
import { Dimmer } from "components/UI/Dimmer";

const Modal = () => {
  let { modalContent, modal } = React.useContext(ModalContext);
  if (modal) {
    return ReactDOM.createPortal(
      <Dimmer>
        {modalContent}
      </Dimmer>,
      document.querySelector("#modal-root")
    );
  } else return null;
};

export default Modal;