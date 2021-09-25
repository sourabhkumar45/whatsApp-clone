import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "./Login.scss";
const Login = ({ handleLogin }) => {
  const [user, setUser] = useState({
    name: "",
    file: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  const handleName = (e) => {
    setUser({ ...user, name: e.target.value });
  };

  const onFileChange = (e) => {
    setUser({ ...user, file: e.target.files[0] });
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img
          src="https://logos-world.net/wp-content/uploads/2020/05/WhatsApp-Logo.png"
          alt="logo"
        ></img>
      </div>
      <div className="login-form">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="profile-image">
            <input
              className="file-upload"
              type="file"
              onChange={(e) => onFileChange(e)}
            ></input>
            <FontAwesomeIcon
              icon={faUser}
              className="icon-block"
            ></FontAwesomeIcon>
          </div>
          <div className="profile-name">
            <FontAwesomeIcon
              className="icon-block"
              icon={faUser}
            ></FontAwesomeIcon>
            <input
              placeholder="Your Name"
              type="text"
              name="name"
              onChange={(e) => {
                handleName(e);
              }}
            ></input>
          </div>
          <input
            type="submit"
            className="profile-submit-btn"
            value="Join Now"
          ></input>
        </form>
      </div>
    </div>
  );
};
export default Login;
