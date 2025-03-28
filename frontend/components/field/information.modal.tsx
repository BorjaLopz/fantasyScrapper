export default function InformationModal({ informationModalOpen, setInformationModalOpen, informationModalType, informationModalMessage }: any) {
  const modalMessage = informationModalMessage.split(",")
  let playerName = ""
  let originalPosition = ""
  let positionToPut = ""
  let modalTitle = ""
  if (informationModalType == "wrong_position") {
    modalTitle = "Posición incorrecta"
    playerName = modalMessage[0]
    originalPosition = modalMessage[1]
    positionToPut = modalMessage[2]
  }

  return (
    <div>MODAL INFORMATION</div>
    // <Modal className="modal squad-builder-tailwind" show={informationModalOpen} onClose={() => setInformationModalOpen(false)}>
    //   <Modal.Header><span className="font-bold text-2xl">{modalTitle}</span></Modal.Header>
    //   <Modal.Body>
    //     <div className="text-center">
    //       <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-600" />
    //       <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 font-sans">
    //         {`${playerName} ${translate("informationModal.playersPosition", lang)} ${originalPosition}${translate("informationModal.positionError", lang).replace("{}", positionToPut)}`}
    //       </h3>
    //     </div>
    //   </Modal.Body>
    //   <Modal.Footer>
    //     <Button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4
    //                focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-0.5
    //               text-center me-2 mb-2" onClick={() => setInformationModalOpen(false)}>{translate("playerSelectModal.closeModal", lang)}</Button>
    //   </Modal.Footer>
    // </Modal>
  );
}