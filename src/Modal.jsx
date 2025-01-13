import { useState, useEffect, useRef } from "react";

function App({ closeEditModal, user, saveUser, modalType }) {
  // modalUser的初始值
  const [modalUser, setModalUser] = useState(() => {
    if (modalType === "new") {
      return { username: "", useremail: "" }; //新增時表單為空
    } else {
      return { ...user }; // 帶入父層的user
    }
  });

  const modalTitle =
    modalType === "new"
      ? "新增使用者"
      : modalType === "edit"
      ? "修改使用者"
      : "刪除使用者";

  function handleLocalInputChange(e) {
    const { id, value } = e.target;
    setModalUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  }

  // 將modalUsert傳給父層
  function handleSave() {
    saveUser(modalUser);
    closeEditModal();
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      id="myModal"
      tabIndex="-1"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="myModalLabel">
              {modalTitle}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeEditModal}
            ></button>
          </div>
          <div className="modal-body">
            {modalType !== "delete" ? (
              <form id="userForm">
                <input
                  value={modalUser.username}
                  onChange={handleLocalInputChange}
                  id="username"
                  name="username"
                  type="text"
                  style={{ width: "300px" }}
                  placeholder="請輸入使用者姓名"
                />
                <input
                  value={modalUser.useremail}
                  onChange={handleLocalInputChange}
                  id="useremail"
                  name="useremail"
                  type="email"
                  style={{ width: "300px" }}
                  placeholder="請輸入使用者Email"
                />
              </form>
            ) : (
              <p>確定要刪除使用者:{modalUser.username}</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={closeEditModal}
            >
              取消
            </button>
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleSave}
              >
                删除
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                儲存
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
