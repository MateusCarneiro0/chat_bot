import { useState } from "react";

function App() {
  const [chats, setChats] = useState(["Chat 1"]);
  const [selectedChat,setSelectedChat] = useState("Chat 1")
  return (
    <div className="app">
      <h1>ChatBot</h1>
      <select value={selectedChat} onChange={(ev) => setSelectedChat(ev.target.value)}>
        {chats.map((chat) => (
          <option key={chat} value={chat}>
            {chat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
