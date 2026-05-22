import { useEffect, useState } from "react";

import { useKeydown } from "./hooks/useKeydown";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { GoogleGenAI } from "@google/genai";

import { KEY_1 } from "./Keys"; // Adding your api key from gemini

import { SyncLoader } from "react-spinners";

import NavBar from "./components/NavBar";
import Chat from "./components/Chat";

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

  useKeydown(
    () =>
      setChats((chatsState) => [
        ...chatsState,
        `Chat ${chatsState.length + 1}`,
      ]),
    "KeyM",
    true
  );
  useKeydown(
    () =>
      setChats((chatsState) => {
        localStorage.clear();
        window.location.reload(true);
        return ["Chat 1"];
      }),
    "KeyQ",
    true
  );
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

export default App;
