import { FormControl, MenuItem, Select } from "@mui/material";

export default function SelectChat({ selectedChat, setSelectedChat, chats }) {
  return (
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
  );
}
