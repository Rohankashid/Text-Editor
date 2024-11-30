// src/components/TextItem.js
import React from "react";

const TextItem = ({ id, text, style, onDrag, onDoubleClick }) => {
    return (
        <div
            draggable
            onDragEnd={(e) => onDrag(e, id)}
            onDoubleClick={() => onDoubleClick(id)}
            style={{ position: "absolute", ...style, cursor: "move" }}
        >
            {text}
        </div>
    );
};

export default TextItem;
