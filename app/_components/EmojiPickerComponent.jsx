import EmojiPicker from "emoji-picker-react";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function EmojiPickerComponent({ children, setEmojiIcon }) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (openEmojiPicker && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap below trigger
        left: rect.left + window.scrollX,
      });
    }
  }, [openEmojiPicker]);

  return (
    <div ref={triggerRef} className="inline-block relative">
      <div onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
        {children}
      </div>

      {openEmojiPicker &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: 1,
            }}
          >
            <EmojiPicker
              onEmojiClick={(e) => {
                setEmojiIcon(e.emoji);
                setOpenEmojiPicker(false);
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}

export default EmojiPickerComponent;
