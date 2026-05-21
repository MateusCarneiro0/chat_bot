import { useEffect, useRef, useState } from "react";
import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { GoogleGenAI } from "@google/genai";
import { KEY_1 } from "./Keys";// Adding your api key from gemini

function App() {
  const [chats, setChats] = useState(["Chat 1"]);
  const [selectedChat, setSelectedChat] = useState("Chat 1");
  const ai = useRef(null)

  useEffect(() => {
    ai.current = new GoogleGenAI({
      apiKey: KEY_1,
    });
  }, []);
  return (
    <div className="app">
      <NavBar
        selectedChat={selectedChat}
        chats={chats}
        setSelectedChat={setSelectedChat}
      />
      <Chat ai={ai.current} />
    </div>
  );
}
function Chat({ai}) {
  const [messages, setMessages] = useState([{ user: "say", robot: "hello" }]);
  const [isLoading,setIsLoading] = useState(false)
  
  const inputRef = useRef(null);
  const handleSendMessage = () => {
    setIsLoading(true)
    setMessages((histo) => [...histo,{user:inputRef.current.value,robot:""}])
  }
  return (
    <div className="chat">
      {messages.map((chat) => {
        return (
          <>
            <Message>{chat.user}</Message>
            <Message robot={true}>{chat.robot}</Message>
          </>
        );
      })}
      <Input inputRef={inputRef}/>
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

function Input({ inputRef }) {
  return (
    <div className="container-input">
      <input
        ref={inputRef}
        name="chat-input"
        className="chat-input"
        placeholder="type something"
        type="text"
      />
      <button>Send</button>
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
