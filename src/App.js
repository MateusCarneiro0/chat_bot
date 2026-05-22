import { useEffect, useRef, useState } from "react";

import { useKeydown } from "./hooks/useKeydown";
import { useLocalStorage } from "./hooks/useLocalStorage";

import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowCircleUpTwoToneIcon from "@mui/icons-material/ArrowCircleUpTwoTone";

import { IconButton, FormControl, MenuItem, Select } from "@mui/material";

import { GoogleGenAI } from "@google/genai";

import { KEY_1 } from "./Keys"; // Adding your api key from gemini

import { SyncLoader } from "react-spinners";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

function App() {
  //!Modificando a chave o estado é resetado assim ele não replica o chat porque elementos iguais na mesma posição o react não faz nada

  const [chats, setChats] = useLocalStorage(["Chat 1", "Chat 2"], "chats");
  const [selectedChat, setSelectedChat] = useState("Chat 1");
  const [isReadyChat, setIsReadyChat] = useState(false);
  const [chat, setChat] = useState(null);

  useEffect(() => {
    document.title = selectedChat;
  }, [selectedChat]);

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
  }, [selectedChat]);
  return (
    <div className="app">
      <NavBar
        selectedChat={selectedChat}
        chats={chats}
        setSelectedChat={setSelectedChat}
      />
      {isReadyChat ? (
        <Chat key={selectedChat} chat={chat} selectedChat={selectedChat} />
      ) : (
        <SyncLoader />
      )}
    </div>
  );
}
function Chat({ chat, selectedChat }) {
  const [userMessages, setUserMessages] = useState(() => {
    const value = JSON.parse(localStorage.getItem(selectedChat));
    return value?.length ? value.map((chat) => chat.user) : [];
  });
  const [robotMessages, setRobotMessages] = useState(() => {
    const value = JSON.parse(localStorage.getItem(selectedChat));
    return value?.length ? value.map((chat) => chat.robot) : [];
  });
  const [isLoading, setIsLoading] = useState(null);
  const [messages, setMessages] = useLocalStorage(
    userMessages?.map((message, i) => ({
      user: message,
      robot: robotMessages.at(i) ?? "",
    })) || [],
    selectedChat
  ); //!Como quando um estado é mudado ele re-renderiza todos os filhos toda vez que muda ele consegue mudar
  useEffect(() => {
    setMessages(
      userMessages?.map((message, i) => ({
        user: message,
        robot: robotMessages.at(i) ?? "",
      }))
    );
  }, [userMessages, robotMessages, setMessages,selectedChat]);
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
          setRobotMessages((messages) => [...messages, "<h1>Olá</h1>"]);
          setIsLoading(false);
        }, 3000);
      }
    }

    setUserMessages((histo) => [...histo, inputRef.current.value]);
    toogleRobotMessages();
    inputRef.current.value = "";
  };
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight - 15,
      behavior: "smooth",
    });
  }, [messages]);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".up-button",
      {
        x: "100vh",
        opacity: 0,
        rotation: "180deg",
      },
      {
        x: "-60px",
        opacity: 1,
        rotation: "360deg",
        scrollTrigger: {
          trigger: ".button-container",
          start: "top 100px",
          end: "bottom 100px",
          scrub: true,
        },
      }
    );
  });

  return (
    <div className="chat">
      <div className="button-container">
        <IconButton
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="up-button"
        >
          <ArrowCircleUpTwoToneIcon
            sx={{
              width: "50px",
              height: "50px",
            }}
          />
        </IconButton>
      </div>
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
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedChat}
          onChange={(ev) => setSelectedChat(ev.target.value)}
        >
          {chats.map((chat) => (
            <MenuItem key={chat} value={chat}>
              {chat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
    margin: `40px ${robot ? 15 : 80}px ${isLast ? 190 : 0}px ${
      robot ? 80 : 15
    }px`,
    gap: "5px",
    justifySelf: robot && "right",
  };

  const messageRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(SplitText);

    if (typeof children === "string" && messageRef.current) {
      const duration = children.split("").length >= 100 ? 0.01 : 0.03;
      const split = new SplitText(messageRef.current, { type: "chars, words" });
      gsap.from(split.chars, {
        opacity: 0,
        duration: duration,
        stagger: duration,
        ease: "power1.in",
      });
    }
  }, [children]);
  return (
    <div style={{ ...robotStyle }}>
      {!robot && <FaceIcon />}
      <p
        ref={messageRef}
        className="message-text"
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
