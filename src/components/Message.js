import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { SplitText } from "gsap/SplitText";

import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function Message({ children, robot, isLast }) {
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
      {typeof children === "string" ? (
        <p
          ref={messageRef}
          className={`message-text ${robot ? "robot" : "user"}`}
          style={{
            overflowWrap: "break-word",
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
          dangerouslySetInnerHTML={{ __html: children }}
        />
      ) : (
        <p className="message-text">{children}</p>
      )}
      {robot && <SmartToyIcon />}
    </div>
  );
}
