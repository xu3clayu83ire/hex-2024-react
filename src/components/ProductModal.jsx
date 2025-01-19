import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const apiUrlImageUpload = `${API_BASE}/api/${API_PATH}/admin/upload`;

function ProductModal({
  getProductList,
  productModalRef,
  modalType,
  tempProduct,
  setTempProduct,
  closeModal,
}) {
  const handleModalInputChange = (e) => {
    const { id, value } = e.target;
    setTempProduct((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleImageChange = (index, value) => {
    console.log(index, value);
    setTempProduct((prevData) => {
      let newImages = [];
      if (prevData.imagesUrl?.length > 0) {
        newImages = [...prevData.imagesUrl];
      }
      newImages[index] = value;
      return { ...prevData, imagesUrl: newImages };
    });
  };
  const createorUpdateProductData = async (id) => {
    let product;
    if (modalType === "edit") {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;

    // 圖片
    const _imagesUrl = [...document.querySelectorAll(".imageSmall")]
      .filter((item) => item.attributes.src.value.length > 0)
      .map((item) => item.attributes.src.value);

    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: _imagesUrl,
        imageUrl: _imagesUrl.length > 0 ? _imagesUrl[0] : "",
      },
    };

    console.dir(productData);

    let message = modalType === "edit" ? "更新" : "新增";

    try {
      let response;
      if (modalType === "edit") {
        response = await axios.put(url, productData);
      } else {
        response = await axios.post(url, productData);
      }
      message = message + "成功";
      console.log(message, response.data);
      productModalRef.current.hide();
      getProductList();
    } catch (err) {
      message = message + "失敗";
      console.log(message, response.data.message);
      //   if (modalType === "edit") {
      //     console.error("更新失敗", err.response.data.message);
      //   } else {
      //     console.error("新增失敗", err.response.data.message);
      //   }
    } finally {
      alert(message);
    }
  };
  const deleteProductData = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      );
      console.log("刪除成功", response.data);
      productModalRef.current.hide();
      getProductList();
      alert("刪除成功");
    } catch (err) {
      console.error("刪除失敗", err.response.data.message);
    }
  };
  const handleImageUpload = async () => {
    const imageUpload = document.querySelector("#imageUpload");
    if (
      imageUpload.files[0] === undefined ||
      imageUpload.files[0].length === 0
    ) {
      alert("請選擇圖片");
      return;
    }
    if (imageUpload.files[0].length > 1) {
      alert("一次最多上傳一張圖片");
      return;
    }
    const imageTexts = [...document.querySelectorAll(".imageText")];
    const imageTextsEmptyArray = imageTexts.filter(
      (item) => item.value.length === 0
    );
    if (imageTextsEmptyArray.length === 0) {
      alert("最多上傳五張圖片");
      return;
    }
    const formData = new FormData();
    formData.append("file", imageUpload.files[0]);
    imageUpload.value = "";
    try {
      const response = await axios.post(apiUrlImageUpload, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log(response.data.imageUrl);
      const rtnImageUrl = response.data.imageUrl;
      //"https://storage.googleapis.com/vue-course-api.appspot.com/annreact/1737293718044.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=or8s%2FJaGYjUKsOJYqvvsKPIDNrJE%2FYE3ixM1TD18Ul5d6bcZu7PE0TKHEn2gCCidAPwQ6uZM2UmDe%2BryLxlNcmxSPBlmfr35ylla%2BR6ihrgYRSDTBjevGLODpDAuek6fAaCvV%2FlvkAvpcXMQtTS2bG1BEiba9KfI0XzQcSsQ2QTwdrEVDrDQscEePymcoWjqR2k6Dy1xIVbZ%2BFY6HiVvzDl7NB3r61lATphudWMvpKOkJkcjc6EJueGa6vWvBF%2BJuGhAOSvStjKinmkhbZmJ9EbkMthHl4HHwXQHsOLn19Teu7IkIx35oEVBqqcZC4S4S6%2Bx%2BdYa9%2Fcx3MBQQ2tl9g%3D%3D";

      imageTextsEmptyArray[0].value = rtnImageUrl;
      const imageSmalls = [...document.querySelectorAll(".imageSmall")];
      imageSmalls.filter(
        (item) => item.attributes.src.value.length === 0
      )[0].attributes.src.value = rtnImageUrl;
    } catch (err) {
      console.error(err);
      alert("圖片上傳失敗");
    }
  };
  const cleanImageText = (idx) => {
    const imageTexts = [...document.querySelectorAll(".imageText")];
    imageTexts[idx].value = "";
    const imageSmalls = [...document.querySelectorAll(".imageSmall")];
    imageSmalls[idx].src = "";
  };
  return (
    <>
      <div
        className="modal"
        //style={{ display: "block" }}
        id="productModal"
        tabIndex="-1"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
        ref={productModalRef}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div
              className={`modal-header ${
                modalType === "delete" ? "bg-danger" : "bg-dark"
              } text-white`}
              data-bs-theme="dark"
            >
              <h5 className="modal-title fs-5 fw-bold" id="myModalLabel">
                <span>
                  {modalType === "delete"
                    ? "刪除產品"
                    : modalType === "edit"
                    ? "編輯產品"
                    : "新增產品"}
                </span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => closeModal()}
              ></button>
            </div>
            <div className="modal-body">
              {modalType !== "delete" ? (
                <form className="p-3">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="row align-items-end">
                        <div className="col-9">
                          <label htmlFor="title" className="col-form-label-sm">
                            產品名稱
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="title"
                            value={tempProduct.title}
                            onChange={handleModalInputChange}
                          />
                        </div>
                        <div className="col-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="is_enabled"
                              checked={tempProduct.is_enabled}
                              onChange={handleModalInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_enabled"
                            >
                              是否啟用
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="category" className="col-form-label-sm">
                          產品分類
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="category"
                          value={tempProduct.category}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <label
                            htmlFor="qty_total"
                            className="col-form-label-sm"
                          >
                            產品數量
                          </label>
                          <input
                            min="0"
                            max="50"
                            type="number"
                            className="form-control form-control-sm"
                            id="qty_total"
                            value={tempProduct.qty_total}
                            onChange={handleModalInputChange}
                          />
                        </div>
                        <div className="col-6">
                          <label htmlFor="unit" className="col-form-label-sm">
                            產品單位
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="unit"
                            value={tempProduct.unit}
                            onChange={handleModalInputChange}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <label
                            htmlFor="origin_price"
                            className="col-form-label-sm"
                          >
                            建議售價
                          </label>
                          <input
                            min="0"
                            type="number"
                            className="form-control form-control-sm"
                            id="origin_price"
                            value={tempProduct.origin_price}
                            onChange={handleModalInputChange}
                          />
                        </div>
                        <div className="col-6">
                          <label htmlFor="price" className="col-form-label-sm">
                            目前價格
                          </label>
                          <input
                            min="0"
                            type="number"
                            className="form-control form-control-sm"
                            id="price"
                            value={tempProduct.price}
                            onChange={handleModalInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <label
                          htmlFor="description"
                          className="col-form-label-sm"
                        >
                          產品特色
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          id="description"
                          rows="5"
                          value={tempProduct.description}
                          onChange={handleModalInputChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="col">
                      <div className="col-12">
                        <label htmlFor="content" className="col-form-label-sm">
                          商品內容
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          id="content"
                          rows="5"
                          value={tempProduct.content}
                          onChange={handleModalInputChange}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="note" className="col-form-label-sm">
                          注意事項
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          id="highlight"
                          rows="5"
                          value={tempProduct.highlight}
                          onChange={handleModalInputChange}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="shipping" className="col-form-label-sm">
                          配送方式
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          id="shipping"
                          rows="5"
                          value={tempProduct.shipping}
                          onChange={handleModalInputChange}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="payment" className="col-form-label-sm">
                          付款方式
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          id="payment"
                          rows="5"
                          value={tempProduct.payment}
                          onChange={handleModalInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <hr className="text-secondary my-3" />
                  <div className="row">
                    <div className="col-12">
                      <label
                        htmlFor=""
                        className="col-form-label-sm d-flex justify-content-between"
                      >
                        圖片網址(最多五個)
                      </label>
                      <div className="input-group mb-2">
                        <input
                          type="file"
                          id="imageUpload"
                          name="file"
                          accept=".jpg, .jpeg, .png"
                          className="form-control"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          id="btn-imageUpload"
                          onClick={() => handleImageUpload()}
                        >
                          上傳圖片
                        </button>
                      </div>
                      {tempProduct.imagesUrl?.length > 0
                        ? tempProduct.imagesUrl
                            .concat(
                              Array.from(
                                {
                                  length: 5 - tempProduct.imagesUrl.length,
                                },
                                () => ""
                              )
                            )
                            .map((item, idx) => (
                              <>
                                <div className="input-group mb-2">
                                  <span className="input-group-text">
                                    {idx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm bg-light imageText"
                                    value={item.length > 0 ? item : ""}
                                    onChange={(e) =>
                                      handleImageChange(idx, e.target.value)
                                    }
                                    //readOnly
                                  />
                                  <img
                                    src={item}
                                    width={100}
                                    hight={100}
                                    className="border imageSmall"
                                  ></img>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => cleanImageText(idx)}
                                    // disabled={item.length > 0 ? false : true}
                                  >
                                    刪除圖片
                                  </button>
                                </div>
                              </>
                            ))
                        : Array.from({ length: 5 }, () => "").map(
                            (item, idx) => (
                              <div className="input-group mb-2">
                                <span className="input-group-text">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-sm bg-light imageText"
                                  value={item}
                                  onChange={(e) =>
                                    handleImageChange(idx, e.target.value)
                                  }
                                  //readOnly
                                />
                                <img
                                  src={item}
                                  width={100}
                                  hight={100}
                                  className="border imageSmall"
                                ></img>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => cleanImageText(idx)}
                                  // disabled={item.length > 0 ? false : true}
                                >
                                  刪除圖片
                                </button>
                              </div>
                            )
                          )}
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <p>確定要刪除這筆資料:</p>
                  <p>{tempProduct.title}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => closeModal()}
              >
                取消
              </button>
              {modalType === "delete" ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteProductData(tempProduct.id)}
                >
                  删除
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => createorUpdateProductData(tempProduct.id)}
                >
                  儲存
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProductModal;
