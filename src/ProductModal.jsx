import { useState, useEffect, useRef } from "react";

function App({ closeModal, product, modalType }) {
  // modal初始值
  const [modalProduct, setModalProduct] = useState(() => {
    if (modalType === "new") {
      return {
        id: "",
        imageUrl: "",
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: false,
        imagesUrl: [],
      }; //新增時表單為空
    } else {
      return { ...product }; // 帶入父層的user
    }
  });

  return (
    <>
      <div id="productModal" className="modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{modalProduct.title}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                // data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
