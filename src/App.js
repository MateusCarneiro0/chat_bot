import { useEffect, useRef, useState } from "react";
import { useKeydown } from "./hooks/useKeydown";

import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';

import { IconButton } from "@mui/material";

import { GoogleGenAI } from "@google/genai";

import { KEY_1 } from "./Keys"; // Adding your api key from gemini

import { SyncLoader } from "react-spinners";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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
  const [isLoading, setIsLoading] = useState(null);
  const messages = userMessages.map((message, i) => ({
    user: message,
    robot: robotMessages.at(i) ?? "",
  })); //!Como quando um estado é mudado ele re-renderiza todos os filhos toda vez que muda ele consegue mudar

  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputRef.current.value) return;
    function toogleRobotMessages() {
      setIsLoading(true);
      if (inputRef.current.value !== "hello") {
        chat.sendMessage({ message: inputRef.current.value }).then((res) => {
          setRobotMessages((messages) => [...messages, res.text]);
          setIsLoading(false);
        });
      } else {
        setTimeout(() => {
          setRobotMessages((messages) => [...messages, "Deu tudo certo"]);
          setIsLoading(false);
        }, 3000);
      }
    }

    setUserMessages((histo) => [...histo, inputRef.current.value]);
    toogleRobotMessages();
    inputRef.current.value = "";
  };

  return (
    <div className="chat">

      <IconButton >
        <ArrowCircleUpTwoToneIcon />
      </IconButton>
      {messages.map((chat, i) => {
        return (
          <div id={`chat_${i}`} key={i}>
            <Message key={chat.user + i}>{chat.user}</Message>
            <Message
              isLast={i === messages.length - 1}
              key={chat.robot + i}
              robot={true}
            >
              {chat.robot || <SyncLoader />}
            </Message>
          </div>
        );
      })}

      <Input
        inputRef={inputRef}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

function NavBar({ selectedChat, chats, setSelectedChat }) {
  return (
    <div className="navbar" id="initial-section">
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

function Input({ inputRef, onSendMessage, isLoading }) {
  const [isFocus, setIsFocus] = useState(false);

  useKeydown(() => inputRef.current.focus(), "Space", true);
  useKeydown(onSendMessage, "Enter", false);
  useEffect(() => {
    if (isLoading) {
      setIsFocus(false);
    }
  }, [isLoading]);
  return (
    <div className="container-input">
      <textarea
        disabled={isLoading}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        ref={inputRef}
        name={`chat-input`}
        className="chat-input"
        placeholder="type something"
        type="text"
      />
      {!isLoading && (
        <IconButton
          sx={{
            position: "fixed",
            bottom: `${isFocus ? "95px" : "85px"}`,
            marginLeft: "150px",
            transition: "all 0.3s ease-in",
          }}
          onClick={onSendMessage}
        >
          <SendRoundedIcon />
        </IconButton>
      )}
    </div>
  );
}

function Message({ children, robot, isLast }) {
  const robotStyle = {
    display: "flex",
    alignItems: "center",
    margin: `40px ${robot ? 15 : 80}px ${isLast ? 150 : 0}px ${
      robot ? 80 : 15
    }px`,
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
          animation:
            "typing 3s steps(2, end) infinite, blink-caret 0.75s step-end infinite;",
        }}
      >
        {children}
      </p>
      {robot && <SmartToyIcon />}
    </div>
  );
}

export default App;

/**
 *
 */
