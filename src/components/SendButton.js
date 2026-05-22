import ArrowCircleUpTwoToneIcon from "@mui/icons-material/ArrowCircleUpTwoTone";
import { IconButton } from "@mui/material";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SendButton() {
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
  );
}
