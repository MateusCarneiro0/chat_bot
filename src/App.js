import { useEffect, useRef, useState } from "react";
import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { GoogleGenAI } from "@google/genai";
import { KEY_1 } from "./Keys"; // Adding your api key from gemini
import { SyncLoader } from "react-spinners";

function App() {
  const [chats, setChats] = useState(["Chat 1"]);
  const [selectedChat, setSelectedChat] = useState("Chat 1");
  const [isReadyChat, setIsReadyChat] = useState(false);
  const [chat, setChat] = useState(null);

  useEffect(() => {
    async function MountTheAI() {
      try {
        const ai = new GoogleGenAI({
          apiKey: KEY_1,
        });
        setChat(ai.chats.create({ model: "gemini-3-flash-preview" }));
        setIsReadyChat(true);
      } catch (error) {
        console.error(error);
        setIsReadyChat(false);
      }
    }
    MountTheAI();
  }, []);
  return (
    <div className="app">
      <NavBar
        selectedChat={selectedChat}
        chats={chats}
        setSelectedChat={setSelectedChat}
      />
      {isReadyChat ? <Chat chat={chat} /> : <SyncLoader />}
    </div>
  );
}
function Chat({ chat }) {
  const [userMessages, setUserMessages] = useState(["say"]);
  const [robotMessages, setRobotMessages] = useState(["hello"]);

  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  useEffect(() => {
    setMessages(
      userMessages.map((message, i) => ({
        user: message,
        robot: robotMessages.at(i) ?? "",
      }))
    );
  }, [userMessages, robotMessages]);
  const handleSendMessage = async () => {
    function toogleRobotMessages() {
      chat
        .sendMessage({ message: inputRef.current.value })
        .then((res) => setRobotMessages((messages) => [...messages, res.text]));
    }

    setUserMessages((histo) => [...histo, inputRef.current.value]);
    toogleRobotMessages();
  };

  return (
    <div className="chat">
      {messages.map((chat) => {
        return (
          <>
            <Message>{chat.user}</Message>
            <Message robot={true}>{chat.robot || <SyncLoader />}</Message>
          </>
        );
      })}
      <Input inputRef={inputRef} onSendMessage={handleSendMessage} />
    </div>
  );
}

function NavBar({ selectedChat, chats, setSelectedChat }) {
  return (
    <div className="navbar">
      <h1>ChatBot</h1>
      <select
        value={selectedChat}
        onChange={(ev) => setSelectedChat(ev.target.value)}
      >
        {chats.map((chat) => (
          <option key={chat} value={chat}>
            {chat}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({ inputRef, onSendMessage }) {
  return (
    <div className="container-input">
      <input
        ref={inputRef}
        name="chat-input"
        className="chat-input"
        placeholder="type something"
        type="text"
      />
      <button onClick={onSendMessage}>Send</button>
    </div>
  );
}

function Message({ children, robot }) {
  const robotStyle = {
    display: "flex",
    alignItems: "center",
    margin: `40px ${robot ? 15 : 80}px 0px ${robot ? 80 : 15}px`,
    gap: "5px",
    justifySelf: robot && "right",
  };
  return (
    <div style={{ ...robotStyle }}>
      {!robot && <FaceIcon />}
      <p
        style={{
          overflowWrap: "break-word",
          whiteSpace: "normal",
          wordBreak: "break-all",
        }}
      >
        {children}
      </p>
      {robot && <SmartToyIcon />}
    </div>
  );
}

export default App;
