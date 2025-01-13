import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
//import Modal from "./Modal.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
//console.log(API_BASE)

const apiUrlLoginCheck = `${API_BASE}/api/user/check`;
const apiUrlProducts = `${API_BASE}/api/${API_PATH}/admin/products`;
const apiUrlSignin = `${API_BASE}/admin/signin`;

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
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
  });
  const [modalType, setModalType] = useState(null);

  // ---======================================---
  // useEffect
  // ---======================================---
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

    //checkAdmin();
  }, []);

  // ---======================================---
  // 產品
  // ---======================================---
  const getProductList = async (e) => {
    try {
      const response = await axios.get(apiUrlProducts);
      setProducts(response.data.products);
    } catch (error) {
      console.log("取得產品列表失敗: " + error.response.data.message);
    }
  };

  // ---======================================---
  // Modal
  // ---======================================---
  const productModalRef = useRef(null);
  const openModal = (e) => {
    productModalRef.current.show();
  };

  // ---======================================---
  // 登入
  // ---======================================---
  const [isAuth, setisAuth] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrlSignin, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      getProductList();
      setisAuth(true);
    } catch (error) {
      console.log("登入失敗: " + error.response.data.message);
    }
  };

  return (
    <>
      {isAuth ? (
        <>
          {products.map((item) => (
            <>
              <div>{item.title}</div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => openModal(e)}
              >
                編輯
              </button>
            </>
          ))}
        </>
      ) : (
        <>
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
        </>
      )}

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
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
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
