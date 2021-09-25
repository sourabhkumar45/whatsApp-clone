import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { shortFormatTime } from "./../../utils/helper";

import { NavLink } from "react-router-dom";

import "./ChatCardListing.scss";
import friendListReducer from "../../reducers/friendListReducer";
const ChatCardListing = ({ friendList }) => {
  const renderMessage = (data) => {
    let msg = "";
    if (data.recentMsg && data.recentMsg.msg) {
      if (data.recentMsg.msg.type === "message") {
        msg = data.recentMsg.msg.value;
      } else if (data.recentMsg.msg.type === "file") {
        msg = "Media Shared";
      } else if (data.recentMsg.msg.type === "typing") {
        msg = <i style={{ color: "#a7a7a7" }}>Typing...</i>;
      } else msg = "";
    }

    return msg;
  };
  return (
    <div className="chat-card-listing">
      {Object.keys(friendList).map((key) => {
        return (
          <NavLink
            key={friendList[key].sessionId}
            className="note-card"
            to={`/${key}`}
          >
            <div className="card">
              {friendList[key].profileImg ? (
                <div className="img-container" key={friendList[key].sessionId}>
                  <img src={friendList[key].profileImg} alt="profile"></img>
                </div>
              ) : (
                <div className="img-container" key={friendList[key].sessionId}>
                  <img
                    src="https://wallpaperaccess.com/full/2213424.jpg"
                    alt=""
                  ></img>
                </div>
              )}
              <div className="card-details">
                <h4 className="title">{friendList[key].name}</h4>
                <p className="desc">{renderMessage(friendList[key])}</p>
              </div>
              <div className="time">
                {friendList[key].recentMsg &&
                  shortFormatTime(friendList[key].recentMsg.time)}
              </div>
              <div className="action-btn">
                <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
              </div>
            </div>
          </NavLink>
        );
      })}
    </div>
  );
};
export default ChatCardListing;
