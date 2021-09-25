import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faUser } from "@fortawesome/free-solid-svg-icons";

import { formatDate } from "../../utils/helper";
import "./ChatHeader.scss";
const ChatHeader = ({ friendInfo }) => {
  const { isOnline, profileImg, name, updatedAt } = friendInfo;
  
  return (
    <div className="chat-header">
      <div className="img-container">
        {profileImg ? (
          <img src={profileImg} alt="image2"></img>
        ) : (
          <FontAwesomeIcon
            className="icon-block"
            icon={faUser}
          ></FontAwesomeIcon>
        )}
      </div>
      <div className="card-details">
        <h4 className="title">{name ? name : ""}</h4>
        <p className="desc">
          {isOnline
            ? "Online"
            : `Last seen at ${updatedAt ? formatDate(updatedAt) : ""}`}
        </p>
      </div>
      <div className="action-items">
        <FontAwesomeIcon
          icon={faEllipsisV}
          className="icon-block"
        ></FontAwesomeIcon>
      </div>
    </div>
  );
};
export default ChatHeader;
