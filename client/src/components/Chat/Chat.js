import ScrollToBottom from "react-scroll-to-bottom";
import { shortFormatTime } from "../../utils/helper";

import "./Chat.scss";
const Chat = ({ sessionId, friendName, chats }) => {
  const renderMsg = (msg) => {
    if (msg?.type === "file") {
      if (msg.theme === "audio") {
        return <audio src={msg.value} controls />;
      } else if (msg.theme === "image") {
        return <img style={{ width: "100px" }} src={msg.value} alt="msg" />;
      }
    }
    return msg?.value;
  };
  console.log(chats);
  return (
    <ScrollToBottom className="chat-section">
      {chats.map((chat) => {
        return (
          <div
            key={chat._id}
            className={`chat ${sessionId === chat.senderId ? "you" : "me"}`}
          >
            {/* <span className="name">{friendName}</span> */}

            <p className="msg">{renderMsg(chat.msg)}</p>
            <span>{shortFormatTime(chat.time)}</span>
          </div>
        );
      })}
    </ScrollToBottom>
  );
};
export default Chat;
