import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ProfileSection from "./components/ProfileSection/ProfileSection";
import SearchPeople from "./components/SearchPeople/SearchPeople";
import ChatCardListing from "./components/ChatCardListing/ChatCardListing";
import ChatSection from "./components/ChatSection/ChatSection";
import Login from "./components/Login/Login";

import { BASE_URL, LOGIN, USER_LIST } from "./utils/apiEndpoints";
import { postRequest, getRequest } from "./utils/apiRequest";

import AuthContext from "./context/AuthContext";
import SocketContext from "./context/SocketContext";

import friendListReducer from "./reducers/friendListReducer";

import io from "socket.io-client";
import "./App.scss";

const initialState = {}; // stores the message

const socket = io.connect("http://localhost:2000", {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

function App() {
  const [cookie, setCookie, removeCookie] = useCookies(["messagingApp"]);
  const [error, setError] = useState(null);
  const [userObj, setUserObj] = useState(() => {
    return cookie.user;
  });
  const [recentMsg, setRecentMsg] = useState({});
  const [recentOnlineFriend, setRecentOnlineFirend] = useState({});
  const [recentOfflineFriend, setRecentOfflineFirend] = useState({});

  const [friendList, friendListDispath] = useReducer(
    friendListReducer,
    initialState
  );

  // prevent state change on refresh
  useEffect(() => {
    if (userObj && userObj.sessionId) {
      joinUser(userObj);
      getFriendList(userObj);
    }
  }, []);

  const handleLogin = async (userData) => {
    const formData = new FormData();
    if (userData.file) {
      formData.append("profileImg", userData.file, userData.file.name);
    }
    formData.append("payload", JSON.stringify({ name: userData.name }));

    const response = await postRequest(`${BASE_URL}${LOGIN}`, formData);
    console.log("printing user data", response);
    if (response.error) {
      setError(response.error);
      alert(error);
      return false;
    } else {
      setCookie("user", response);
      setUserObj(response);
      joinUser(response);
      getFriendList(response);
    }
  };
  const getFriendList = async (userData) => {
    console.log("inside getFriendList");
    const response = await getRequest(
      `${BASE_URL}${USER_LIST}/${userData.sessionId}`
    );
    console.log(response);
    if (response.error) {
      setError(response.error);
      return false;
    } else {
      friendListDispath({ type: "FRIENDS", payload: response });
      onlineOfflineUser();
    }
  };

  const onlineOfflineUser = () => {
    socket.on("new-online-user", (data) => {
      friendListDispath({ type: "NEW_FRIENDS", payload: data });
      setRecentOnlineFirend(data);
    });
    socket.on("new-offline-user", (data) => {
      setRecentOfflineFirend(data);
    });
  };
  const handleLogOut = () => {
    removeCookie("user");
    setUserObj(null);
  };

  const joinUser = (userData) => {
    let initData = {
      createdAt: userData.createdAt,
      name: userData.name,
      profileImg: userData.profileImg,
      sessionId: userData.sessionId,
      updatedAt: userData.updatedAt,
      _id: userData._id,
    };
    socket.emit("join-user", initData, (cbData) => {
      console.log("user-joint");
    });

    socket.on("receive-msg", (data) => {
      console.log(data);
      updateRecentMsg(data);
      setRecentMsg(data);
    });

    socket.on("user-typing", (data) => {
      console.log(data);
      updateRecentMsg(data);
    });
  };
  const updateRecentMsg = (data) => {
    friendListDispath({ type: "RECENT_MSG", payload: data });
  };
  return (
    <>
      {!(userObj && userObj.sessionId) ? (
        <Login handleLogin={handleLogin}></Login>
      ) : (
        <AuthContext.Provider value={userObj}>
          <SocketContext.Provider value={socket}>
            <div className="App">
              <Router>
                <div className="left-side">
                  <ProfileSection
                    handleLogOutFn={handleLogOut}
                  ></ProfileSection>
                  <SearchPeople></SearchPeople>
                  <ChatCardListing friendList={friendList}></ChatCardListing>
                </div>
                <Switch>
                  <Route path="/:id">
                    <div className="right-side">
                      <ChatSection
                        updateRecentMsg={updateRecentMsg}
                        recentMsg={recentMsg}
                        recentOnlineFriend={recentOnlineFriend}
                        recentOfflineFriend={recentOfflineFriend}
                      ></ChatSection>
                    </div>
                  </Route>
                </Switch>
              </Router>
            </div>
          </SocketContext.Provider>
        </AuthContext.Provider>
      )}
    </>
  );
}

export default App;
///
