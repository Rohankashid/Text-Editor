// src/components/Toolbar.js
import React from "react";

const Toolbar = ({ onAddText, onStyleChange, undo, redo }) => {
    return (
        <div className="toolbar">
            <button onClick={onAddText}>Add Text</button>
            <select onChange={(e) => onStyleChange("fontFamily", e.target.value)}>
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
            </select>
            <select onChange={(e) => onStyleChange("fontSize", e.target.value)}>
                <option value="16px">16px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
            </select>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
        </div>
    );
};

export default Toolbar;
