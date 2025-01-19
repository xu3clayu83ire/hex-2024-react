import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";

import ProductModal from "./components/ProductModal.jsx";
import Logon from "./components/Logon.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const apiUrlLoginCheck = `${API_BASE}/api/user/check`;
const apiUrlProducts = `${API_BASE}/api/${API_PATH}/admin/products`;
const apiUrlImageUpload = `${API_BASE}/api/${API_PATH}/admin/upload`;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    num: 0,
    unit: "",
    qty_total: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
    payment: "",
    highlight: "",
    shipping: "",
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

    checkAdmin();
  }, []);

  // ---======================================---
  // 產品
  // ---======================================---
  const getProductList = async (page) => {
    try {
      const _page = page === undefined ? 1 : page;
      const _apiUrlProducts = `${apiUrlProducts}?page=${_page}`;
      const response = await axios.get(_apiUrlProducts);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log("取得產品列表失敗: " + error.response.data.message);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_pages: 1,
    current_page: 1,
    has_pre: false,
    has_next: true,
    category: "",
  });
  const handlePagination = (inputPage) => {
    //console.log("inputPage=" + inputPage);
    if (inputPage == currentPage || inputPage > pagination.total_pages) return;
    setCurrentPage(inputPage);
    getProductList(inputPage);
  };
  // const deleteProductData = async (id) => {
  //   try {
  //     const response = await axios.delete(
  //       `${API_BASE}/api/${API_PATH}/admin/product/${id}`
  //     );
  //     console.log("刪除成功", response.data);
  //     productModalRef.current.hide();
  //     getProductList();
  //   } catch (err) {
  //     console.error("刪除失敗", err.response.data.message);
  //   }
  // };
  // const createorUpdateProductData = async (id) => {
  //   let product;
  //   if (modalType === "edit") {
  //     product = `product/${id}`;
  //   } else {
  //     product = `product`;
  //   }

  //   const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;

  //   const productData = {
  //     data: {
  //       ...tempProduct,
  //       origin_price: Number(tempProduct.origin_price),
  //       price: Number(tempProduct.price),
  //       is_enabled: tempProduct.is_enabled ? 1 : 0,
  //       imagesUrl: tempProduct.imagesUrl,
  //     },
  //   };

  //   try {
  //     let response;
  //     if (modalType === "edit") {
  //       response = await axios.put(url, productData);
  //       console.log("更新成功", response.data);
  //     } else {
  //       response = await axios.post(url, productData);
  //       console.log("新增成功", response.data);
  //     }

  //     productModalRef.current.hide();
  //     getProductList();
  //   } catch (err) {
  //     if (modalType === "edit") {
  //       console.error("更新失敗", err.response.data.message);
  //     } else {
  //       console.error("新增失敗", err.response.data.message);
  //     }
  //   }
  // };

  // ---======================================---
  // Modal
  // ---======================================---
  const productModalRef = useRef(null);
  const openModal = (item, modalType) => {
    if (modalType === "new") {
      setTempProduct({
        id: "",
        imageUrl: "",
        title: "",
        category: "",
        num: 0,
        unit: "",
        qty_total: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: false,
        imagesUrl: [],
        payment: "",
        highlight: "",
        shipping: "",
      });
    } else {
      setTempProduct(item);
    }

    setModalType(modalType);
    productModalRef.current.show();
  };
  const closeModal = () => {
    setModalType(null);
    productModalRef.current.hide();
  };
  // const handleModalInputChange = (e) => {
  //   const { id, value } = e.target;
  //   setTempProduct((prevData) => ({
  //     ...prevData,
  //     [id]: value,
  //   }));
  // };
  // const handleImageChange = (index, value) => {
  //   console.log(index, value);
  //   setTempProduct((prevData) => {
  //     let newImages = [];
  //     if (prevData.imagesUrl?.length > 0) {
  //       newImages = [...prevData.imagesUrl];
  //     }
  //     newImages[index] = value;
  //     return { ...prevData, imagesUrl: newImages };
  //   });
  // };

  // ---======================================---
  // 登入
  // ---======================================---
  const [isAuth, setisAuth] = useState(false);
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  // const handleInputChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: value,
  //   }));
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(apiUrlSignin, formData);
  //     const { token, expired } = response.data;
  //     document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
  //     axios.defaults.headers.common.Authorization = `${token}`;
  //     getProductList();
  //     setisAuth(true);
  //   } catch (error) {
  //     console.log("登入失敗: " + error.response.data.message);
  //   }
  // };
  const checkAdmin = async () => {
    try {
      await axios.post(apiUrlLoginCheck);
      getProductList();
      setisAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  // ---======================================---
  // 渲染
  // ---======================================---
  return (
    <>
      {isAuth ? (
        <>
          <div className="container">
            <h5 className="fw-bold">產品列表</h5>
            <div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => openModal({}, "new")}
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
                    庫存量
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
                      <td>{item.num}</td>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td>
                        <del>{item.origin_price}</del>
                      </td>
                      <td>{item.price}</td>
                      <td>{item.qty_total}</td>
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
            <nav
              aria-label="Page navigation example"
              className="d-flex justify-content-center"
            >
              <ul className="pagination">
                <li className="page-item">
                  <a
                    className="page-link"
                    role="button"
                    aria-label="Previous"
                    onClick={() =>
                      handlePagination(currentPage > 1 ? currentPage - 1 : 1)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {[...Array(pagination.total_pages).keys()].map((item, idx) => {
                  const nowPage = idx + 1;
                  return (
                    <>
                      <li
                        key={idx}
                        className={
                          nowPage === pagination.current_page
                            ? "page-item active"
                            : "page-item"
                        }
                      >
                        <a
                          className="page-link"
                          role="button"
                          onClick={() => handlePagination(nowPage)}
                        >
                          {nowPage}
                        </a>
                      </li>
                    </>
                  );
                })}
                <li className="page-item">
                  <a
                    className="page-link"
                    role="button"
                    aria-label="Next"
                    onClick={() => handlePagination(currentPage + 1)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      ) : (
        <>
          <Logon setisAuth={setisAuth} getProductList={getProductList}></Logon>
        </>
      )}
      <ProductModal
        getProductList={getProductList}
        productModalRef={productModalRef}
        modalType={modalType}
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        closeModal={closeModal}
      ></ProductModal>
    </>
  );
}

export default App;
