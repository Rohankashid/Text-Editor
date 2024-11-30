// src/components/Editor.js
import React, { useState } from "react";
import TextItem from "./TextItem";
import Toolbar from "./Toolbar";
import useUndoRedo from "../hooks/useUndoRedo";

const Editor = () => {
    const [state, setState, undo, redo] = useUndoRedo([]);
    const [selectedId, setSelectedId] = useState(null);

    const addText = () => {
        const newText = {
            id: Date.now(),
            text: "New Text",
            style: { top: "100px", left: "100px", fontSize: "16px", fontFamily: "Arial" },
        };
        setState([...state, newText]);
    };

    const handleDrag = (e, id) => {
        const updatedState = state.map((item) =>
            item.id === id
                ? { ...item, style: { ...item.style, top: `${e.clientY}px`, left: `${e.clientX}px` } }
                : item
        );
        setState(updatedState);
    };

    const handleDoubleClick = (id) => {
        setSelectedId(id);
    };

    const handleStyleChange = (key, value) => {
        if (!selectedId) return;
        const updatedState = state.map((item) =>
            item.id === selectedId ? { ...item, style: { ...item.style, [key]: value } } : item
        );
        setState(updatedState);
    };

    return (
        <div className="editor">
            <Toolbar onAddText={addText} onStyleChange={handleStyleChange} undo={undo} redo={redo} />
            <div className="canvas">
                {state.map((item) => (
                    <TextItem
                        key={item.id}
                        {...item}
                        onDrag={handleDrag}
                        onDoubleClick={handleDoubleClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Editor;
