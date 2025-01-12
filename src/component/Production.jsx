import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";

import Nav from "./Nav.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const apiUrlLoginCheck = `${API_BASE}/api/user/check`;
const apiUrlProducts = `${API_BASE}/api/${API_PATH}/admin/products`;
const apiUrlSignin = `${API_BASE}/admin/signin`;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);

  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [templateData, setTemplateData] = useState({
    id: "",
    title: "",
    category: "",
    unit: "",
    num: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    features: {
      description: "",
      highlights: "",
      payment: "",
      shipping: "",
    },
    imageUrl: "",
    imagesUrl: [],
  });

  useEffect(() => {}, [templateData]);

  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
      //features: product.features || {},
      featuresDescription: product.features?.description || "",
      featuresHighlights: product.features?.highlights || "",
      featuresPayment: product.features?.payment || "",
      featuresShipping: product.features?.shipping || "",
      //   imagesUrl_1: product.imagesUrl.length == 0 ? "" : product.imagesUrl[0],
      //   imagesUrl_2: product.imagesUrl.length == 0 ? "" : product.imagesUrl[1],
      //   imagesUrl_3: product.imagesUrl.length == 0 ? "" : product.imagesUrl[2],
    });

    productModalRef.current.show();
    setModalType(type);
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const getProductionData = async () => {
    try {
      const response = await axios.get(apiUrlProducts);
      setProducts(response.data.products);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const delProductData = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      );
      console.log("刪除成功", response.data);
      productModalRef.current.hide();
      getProductData();
    } catch (err) {
      console.error("刪除失敗", err.response.data.message);
    }
  };

  const updateProductData = async (id) => {
    let product;
    if (modalType === "edit") {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;

    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl,
      },
    };

    try {
      let response;
      if (modalType === "edit") {
        response = await axios.put(url, productData);
        console.log("更新成功", response.data);
      } else {
        response = await axios.post(url, productData);
        console.log("新增成功", response.data);
      }

      productModalRef.current.hide();
      getProductData();
    } catch (err) {
      if (modalType === "edit") {
        console.error("更新失敗", err.response.data.message);
      } else {
        console.error("新增失敗", err.response.data.message);
      }
    }
  };

  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiUrlSignin, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;

      axios.defaults.headers.common.Authorization = `${token}`;

      getProductionData();

      setisAuth(true);
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const checkAdmin = async () => {
    try {
      await axios.post(apiUrlLoginCheck);
      getProductData();
      setisAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    checkAdmin();
  }, []);

  return (
    <>
      {isAuth ? (
        <>
          <div className="container">
            <div className="d-flex justify-content-between">
              <h5 className="fw-bold">產品列表</h5>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => openModal(templateData, "new")}
              >
                新增
              </button>
            </div>
            <table className="table">
              <thead>
                <tr className="text-center">
                  <th scope="col" width="50">
                    序號
                  </th>
                  <th scope="col" width="150">
                    分類
                  </th>
                  <th scope="col">產品名稱</th>
                  <th scope="col" width="80">
                    原價
                  </th>
                  <th scope="col" width="80">
                    售價
                  </th>
                  <th scope="col" width="80">
                    是否啟用
                  </th>
                  <th scope="col" width="150">
                    編輯
                  </th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td>{++idx}</td>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td>
                        <del>{item.origin_price}</del>
                      </td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                      <td className="text-end">
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic outlined example"
                        >
                          <button
                            id="btn-edit"
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            data-id={item.id}
                            onClick={() => openModal(item, "edit")}
                          >
                            編輯
                          </button>
                          <button
                            id="btn-delete"
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            data-id={item.id}
                            onClick={() => openModal(item, "delete")}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 巧克力電商</p>
        </div>
      )}

      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
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
              <h5 className="modal-title fs-5 fw-bold" id="exampleModalLabel">
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
              ></button>
            </div>
            <div className="modal-body">
              <form className="g-3">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="row align-items-end">
                      <div className="col-9">
                        <label
                          htmlFor="inputName"
                          className="col-form-label-sm"
                        >
                          產品名稱
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="inputName"
                          value={templateData.title}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="col-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="isEnabled"
                            checked={templateData.is_enabled}
                            onChange={handleModalInputChange}
                          />
                          <label className="form-check-label" for="isEnabled">
                            是否啟用
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="inputCategory"
                        className="col-form-label-sm"
                      >
                        產品分類
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="inputCategory"
                        value={templateData.category}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="inputFeature"
                        className="col-form-label-sm"
                      >
                        產品特色
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="inputFeature"
                        rows="5"
                        value={templateData.description}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label htmlFor="inputNum" className="col-form-label-sm">
                          產品數量
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="inputNum"
                          value={templateData.num}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label
                          htmlFor="inputUnit"
                          className="col-form-label-sm"
                        >
                          產品單位
                        </label>
                        {/* <select
                          className="form-select form-select-sm"
                          id="inputUnit"
                        >
                          <option selected>盒</option>
                        </select> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label
                          htmlFor="inputOriginPrice"
                          className="col-form-label-sm"
                        >
                          建議售價
                        </label>
                        <input
                          htmlFor="number"
                          className="form-control form-control-sm"
                          id="inputOriginPrice"
                          value={templateData.origin_price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label
                          htmlFor="inputPrice"
                          className="col-form-label-sm"
                        >
                          目前價格
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="inputPrice"
                          value={templateData.price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="col-12">
                      <label
                        htmlFor="inputDescription"
                        className="col-form-label-sm"
                      >
                        商品描述
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="inputDescription"
                        rows="5"
                        value={templateData.featuresDescription}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label htmlFor="inputNote" className="col-form-label-sm">
                        注意事項
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="inputNote"
                        rows="5"
                        value={templateData.featuresHighlights}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="inputShipping"
                        className="col-form-label-sm"
                      >
                        配送方式
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="inputShipping"
                        value={templateData.featuresShipping}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="inputPayment"
                        className="col-form-label-sm"
                      >
                        付款方式
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="inputPayment"
                        rows="5"
                        value={templateData.featuresPayment}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <hr className="text-secondary my-3" />
                {/* <div className="row">
                  <div className="col-12">
                    <label
                      for="inputImageUrl"
                      className="col-form-label-sm d-flex justify-content-between"
                    >
                      圖片網址
                    </label>
                    <div class="input-group mb-2">
                      <span class="input-group-text">1</span>
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        value={templateData.imagesUrl_1}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div class="input-group mb-2">
                      <span class="input-group-text">2</span>
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        value={templateData.imagesUrl_2}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div class="input-group mb-2">
                      <span class="input-group-text">3</span>
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        value={templateData.imagesUrl_3}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>
                </div> */}
              </form>
            </div>
            <div className="modal-footer">
              <button
                id="btn-clear"
                type="button"
                className="btn btn-secondary"
                onClick={() => closeModal()}
              >
                取消
              </button>
              {modalType === "delete" ? (
                <>
                  <button
                    id="btn-clear"
                    type="button"
                    className="btn btn-danger"
                    onClick={() => delProductData(templateData.id)}
                  >
                    刪除
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => updateProductData(templateData.id)}
                  >
                    確認
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
