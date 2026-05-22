import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

import { marked } from "marked";

import Input from "./Input";
import Message from "./Message";
import SendButton from "./SendButton";

import { SyncLoader } from "react-spinners";

export default function Chat({ chat, selectedChat }) {
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
  }, [userMessages, robotMessages, setMessages, selectedChat]);
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputRef.current.value) return;
    async function toogleRobotMessages() {
      setIsLoading(true);
      if (
        inputRef.current.value !== "/help"
      ) {
        chat
          .sendMessage({ message: inputRef.current.value })
          .then(async (res) => {
            const responseText = await marked.parse(res.text);
            setRobotMessages((messages) => [...messages, responseText]);
            setIsLoading(false);
          });
      } else {
        const helpMessage =
          "Para usar você pode:\n\n<ul><li>Ctrl + Space: Para Escrever</li><li>Enter: Para Enviar</li><li>Ou Ctrl + m: para adicionar um chat</li><li>Ctrl + q: Limpar todos os chats(e recarregue)</li></ul>";

        setTimeout(() => {
          setRobotMessages((messages) => [
            ...messages,
            inputRef.current.value === "Olá"
              ? "Olá que bom que está usando nosso serviço de chatbot <strong>Como posso ajudar?</strong>"
              : helpMessage,
          ]);
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

  return (
    <div className="chat">
      <SendButton />
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
