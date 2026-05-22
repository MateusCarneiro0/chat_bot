import SelectChat from "./SelectChat";

export default function NavBar({ selectedChat, chats, setSelectedChat }) {
  return (
    <div className="navbar" id="initial-section">
      <h1>ChatBot</h1>
      <SelectChat
        selectedChat={selectedChat}
        chats={chats}
        setSelectedChat={setSelectedChat}
      />
    </div>
  );
}
