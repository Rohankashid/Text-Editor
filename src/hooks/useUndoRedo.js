// src/hooks/useUndoRedo.js
import { useState, useCallback } from "react";

export default function useUndoRedo(initialState) {
    const [history, setHistory] = useState([initialState]);
    const [currentStep, setCurrentStep] = useState(0);

    const setState = useCallback((newState) => {
        const updatedHistory = [...history.slice(0, currentStep + 1), newState];
        setHistory(updatedHistory);
        setCurrentStep(updatedHistory.length - 1);
    }, [currentStep, history]);

    const undo = useCallback(() => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    }, [currentStep]);

    const redo = useCallback(() => {
        if (currentStep < history.length - 1) setCurrentStep(currentStep + 1);
    }, [currentStep, history]);

    return [history[currentStep], setState, undo, redo];
}
