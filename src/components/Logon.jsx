import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const apiUrlSignin = `${API_BASE}/admin/signin`;

function Logon({ setisAuth, getProductList }) {
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
      <div className="container login">
        <div className="row justify-content-center">
          <h1 className="font-weight-normal h3 mb-3 text-center">請先登入</h1>
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
  );
}
export default Logon;
