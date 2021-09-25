import AuthContext from "../../context/AuthContext";
import { useContext } from "react";

import "./ProfileSection.scss";

const ProfileSection = ({ handleLogOutFn }) => {
  const userObj = useContext(AuthContext);
  const { profileImg, name } = userObj;
  return (
    <div className="profile-section">
      <div className="img-container">
        <img src={profileImg} alt="img"></img>
      </div>
      {name}
      <div
        className="action-items"
        onClick={() => {
          handleLogOutFn();
        }}
      >
        Logout
      </div>
    </div>
  );
};

export default ProfileSection;
