import React from "react";

export default function Label({ children, bold }) {
  return (
    <span
      style={{
        fontWeight: bold ? "bold" : "normal",
        margin: 4,
        display: "block",
      }}
    >
      {children}
    </span>
  );
}
