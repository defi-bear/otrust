import React from "react";
import Modal from "./modal";

export const ModalContext = createContext()
export const useModal = () => useContext(ModalContext)

export const UpdateModalContext = createContext()
export const useUpdateModal = () => useContext(UpdateSwapContext)


let ModalProvider = ({ children }) => {
  let [modal, updateModal] = React.useState(false);
  let [modalContent, updateModalContent] = React.useState("I'm the Modal Content");

  let handleModal = (content = false) => {
    setModal(!modal);
    if (content) {
      setModalContent(content);
    }
  };

  const contextValue = {
    modal,
    modalContent,
  }

  const updateValue = {
    updateModal,
    updateModalContent
  }

  return (
    <UpdateModalContext.Provider value={updateValue}>
        <ModalContext.Provider value={contextValue} >
            {children}
        </ModalContext.Provider>
    </UpdateModalContext.Provider>
  )
}

export default ModalProvider
