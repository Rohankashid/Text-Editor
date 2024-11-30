import React, { useState, useRef } from "react";
import "./styles.css";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      text: "Double-click to edit",
      x: 100,
      y: 100,
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      fontFamily: "Arial",
      width: 200,
      height: 30,
      textHistory: [
        { text: "Double-click to edit", fontSize: 16, fontFamily: "Arial", fontStyle: "normal", fontWeight: "normal" }
      ],
      historyIndex: 0,
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id, newProps) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, ...newProps } : el
      )
    );
  };

  const handleDrag = (id, e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.width / 2;
    const y = e.clientY - rect.height / 2;
    updateElement(id, { x, y });
  };

  const handleTextChange = (id, e) => {
    const textElement = e.target;
    const newText = textElement.innerText;

    // Preserve cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const cursorOffset = range.startOffset;

    // Update state in the background
    setElements((prevElements) =>
      prevElements.map((el) => {
        if (el.id === id) {
          const newHistory = [
            ...el.textHistory.slice(0, el.historyIndex + 1),
            {
              text: newText,
              fontSize: el.fontSize,
              fontFamily: el.fontFamily,
              fontStyle: el.fontStyle,
              fontWeight: el.fontWeight,
            }
          ];
          return {
            ...el,
            text: newText,
            textHistory: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }
        return el;
      })
    );

    // Restore cursor position using requestAnimationFrame
    window.requestAnimationFrame(() => {
      const textNode = textElement.firstChild;
      if (textNode) {
        const newRange = document.createRange();
        newRange.setStart(textNode, Math.min(cursorOffset, textNode.length));
        newRange.setEnd(textNode, Math.min(cursorOffset, textNode.length));
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    });
  };

  const undo = () => {
    if (selectedElement !== null) {
      setElements((prevElements) =>
        prevElements.map((el) => {
          if (el.id === selectedElement && el.historyIndex > 0) {
            const newIndex = el.historyIndex - 1;
            const previousState = el.textHistory[newIndex];
            return {
              ...el,
              text: previousState.text,
              fontSize: previousState.fontSize,
              fontFamily: previousState.fontFamily,
              fontStyle: previousState.fontStyle,
              fontWeight: previousState.fontWeight,
              historyIndex: newIndex,
            };
          }
          return el;
        })
      );
    }
  };

  const redo = () => {
    if (selectedElement !== null) {
      setElements((prevElements) =>
        prevElements.map((el) => {
          if (el.id === selectedElement && el.historyIndex < el.textHistory.length - 1) {
            const newIndex = el.historyIndex + 1;
            const nextState = el.textHistory[newIndex];
            return {
              ...el,
              text: nextState.text,
              fontSize: nextState.fontSize,
              fontFamily: nextState.fontFamily,
              fontStyle: nextState.fontStyle,
              fontWeight: nextState.fontWeight,
              historyIndex: newIndex,
            };
          }
          return el;
        })
      );
    }
  };

  return (
    <div className="editor">
      <div className="toolbar">
        <button onClick={addTextElement}>Add Text</button>
        <button onClick={undo} disabled={!selectedElement}>Undo</button>
        <button onClick={redo} disabled={!selectedElement}>Redo</button>
        <label>
          Font Size:
          <input
            type="number"
            disabled={!selectedElement}
            value={
              selectedElement
                ? elements.find((el) => el.id === selectedElement)?.fontSize || 16
                : ""
            }
            onChange={(e) =>
              selectedElement &&
              updateElement(selectedElement, {
                fontSize: parseInt(e.target.value),
              })
            }
          />
        </label>
        <label>
          Font Style:
          <select
            disabled={!selectedElement}
            value={
              selectedElement
                ? elements.find((el) => el.id === selectedElement)?.fontStyle || "normal"
                : ""
            }
            onChange={(e) =>
              selectedElement &&
              updateElement(selectedElement, { fontStyle: e.target.value })
            }
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </label>
        <label>
          Font Weight:
          <select
            disabled={!selectedElement}
            value={
              selectedElement
                ? elements.find((el) => el.id === selectedElement)?.fontWeight || "normal"
                : ""
            }
            onChange={(e) =>
              selectedElement &&
              updateElement(selectedElement, { fontWeight: e.target.value })
            }
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </label>
        <label>
          Font Family:
          <select
            disabled={!selectedElement}
            value={
              selectedElement
                ? elements.find((el) => el.id === selectedElement)?.fontFamily || "Arial"
                : ""
            }
            onChange={(e) =>
              selectedElement &&
              updateElement(selectedElement, { fontFamily: e.target.value })
            }
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Cursive">Cursive</option>
            <option value="Monospace">Monospace</option>
          </select>
        </label>
      </div>
      <div className="canvas">
        {elements.map((el) => (
          <div
            key={el.id}
            className={`text-element ${
              selectedElement === el.id ? "editing" : ""
            }`}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              fontSize: el.fontSize,
              fontStyle: el.fontStyle,
              fontWeight: el.fontWeight,
              fontFamily: el.fontFamily,
              width: `${el.width}px`,
              height: `${el.height}px`,
              wordWrap: "break-word",
              overflow: "auto",
            }}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", el.id)}
            onDragEnd={(e) => handleDrag(el.id, e)}
            onDoubleClick={() => setSelectedElement(el.id)}
            onBlur={() => setSelectedElement(null)}
            contentEditable={selectedElement === el.id}
            onInput={(e) => handleTextChange(el.id, e)}
          >
            {el.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
