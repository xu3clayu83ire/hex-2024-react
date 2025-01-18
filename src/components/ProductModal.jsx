import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

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

    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: tempProduct.imagesUrl,
      },
    };

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
                          <label htmlFor="num" className="col-form-label-sm">
                            產品數量
                          </label>
                          <input
                            min="0"
                            max="50"
                            type="number"
                            className="form-control form-control-sm"
                            id="num"
                            value={tempProduct.num}
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
                          商品描述
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
                          id="note"
                          rows="5"
                          //value={tempProduct.featuresHighlights}
                          //onChange={handleModalInputChange}
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
                          //value={tempProduct.featuresHighlights}
                          //onChange={handleModalInputChange}
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
                          //value={tempProduct.featuresPayment}
                          //onChange={handleModalInputChange}
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
                                    className="form-control form-control-sm"
                                    value={item.length > 0 ? item : ""}
                                    onChange={(e) =>
                                      handleImageChange(idx, e.target.value)
                                    }
                                  />
                                  <img
                                    src={item}
                                    width={100}
                                    hight={100}
                                    className="border"
                                  ></img>
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
                                  className="form-control form-control-sm"
                                  value={item}
                                  onChange={(e) =>
                                    handleImageChange(idx, e.target.value)
                                  }
                                />
                                <img
                                  src={item}
                                  width={100}
                                  hight={100}
                                  className="border"
                                ></img>
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
