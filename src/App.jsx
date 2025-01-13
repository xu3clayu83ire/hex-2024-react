import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import Modal from "./Modal.jsx";

function App() {
  const [user, setUser] = useState({
    username: "",
    useremail: "",
  });
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    axios.get("https://randomuser.me/api/?results=1").then((res) => {
      const data = res.data.results[0];
      setUser({
        username: data.name.last,
        useremail: data.email,
      });
    });
  }, []);

  function openEditModal(type) {
    setModalType(type);
  }

  function closeEditModal() {
    setModalType(null);
  }

  function saveUser(newUser) {
    setUser(newUser);
  }
  return (
    <>
      <div>
        <p>{user.username}</p>
        <p>{user.useremail}</p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => openEditModal("new")}
      >
        新增
      </button>
      <button
        type="button"
        className="btn btn-success"
        onClick={() => openEditModal("edit")}
      >
        編輯
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => openEditModal("delete")}
      >
        刪除
      </button>

      {modalType && (
        <Modal
          closeEditModal={closeEditModal}
          user={user}
          saveUser={saveUser}
          modalType={modalType}
        />
      )}
    </>
  );
}

export default App;
