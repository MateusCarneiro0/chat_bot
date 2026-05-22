import { useState, useEffect } from "react";
import { useKeydown } from "../hooks/useKeydown";

import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { IconButton } from "@mui/material";

export default function Input({ inputRef, onSendMessage, isLoading }) {
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
        placeholder="type something or type /help"
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
