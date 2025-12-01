import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrayBar, SortingStep, SortingAlgorithm } from "../types";
import { generateRandomArray, getSortingGenerator } from "../algorithms";
import { useTheme } from "../../../contexts/ThemeContext";
import { useResizablePanel } from "../shared";
import { ControlPanel, Visualization, InfoPanel, CustomArrayModal } from "./components";

const ArrayVisualizer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // State
  const [array, setArray] = useState<ArrayBar[]>([]);
  const [arraySize, setArraySize] = useState<number>(20);
  const [speed, setSpeed] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<SortingStep | null>(null);
  const [stepHistory, setStepHistory] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [isPanelMinimized, setIsPanelMinimized] = useState<boolean>(false);
  const [isEditingArray, setIsEditingArray] = useState<boolean>(false);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");

  // Refs
  const generatorRef = useRef<Generator<SortingStep> | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Resizable panel hook
  const { panelWidth, panelRef, isResizing, handleMouseDown } = useResizablePanel({
    defaultWidth: 320,
    minWidth: 280,
    maxWidth: 600,
  });

  // Initialize array
  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setCurrentStep(null);
    setStepHistory([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    isPlayingRef.current = false;
    generatorRef.current = null;
    setIsEditingArray(false);
    setCustomArrayInput("");
  }, [arraySize]);

  // Set custom array from user input
  const applyCustomArray = useCallback(() => {
    const numbers = customArrayInput
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 100);

    if (numbers.length >= 2 && numbers.length <= 50) {
      const newArray: ArrayBar[] = numbers.map((value, index) => ({
        id: `bar-${index}`,
        value,
        state: "default" as const,
      }));
      setArray(newArray);
      setArraySize(numbers.length);
      setCurrentStep(null);
      setStepHistory([]);
      setCurrentStepIndex(-1);
      setIsPlaying(false);
      isPlayingRef.current = false;
      generatorRef.current = null;
      setIsEditingArray(false);
      setCustomArrayInput("");
    }
  }, [customArrayInput]);

  // Open custom array editor
  const openCustomArrayEditor = useCallback(() => {
    const currentValues = array.map((bar) => bar.value).join(", ");
    setCustomArrayInput(currentValues);
    setIsEditingArray(true);
  }, [array]);

  // Play animation
  const play = useCallback(async () => {
    if (!generatorRef.current) {
      generatorRef.current = getSortingGenerator(algorithm, array);
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    const animate = async () => {
      if (!isPlayingRef.current || !generatorRef.current) return;

      const result = generatorRef.current.next();

      if (!result.done) {
        const step = result.value;
        setCurrentStep(step);
        setArray([...step.array]);
        setStepHistory((prev) => [...prev, step]);
        setCurrentStepIndex((prev) => prev + 1);

        const delay = Math.max(10, 500 - speed * 4);
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (isPlayingRef.current) {
          requestAnimationFrame(() => animate());
        }
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    animate();
  }, [algorithm, array, speed]);

  // Pause animation
  const pause = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // Step forward
  const stepForward = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = getSortingGenerator(algorithm, array);
    }

    const result = generatorRef.current.next();

    if (!result.done) {
      const step = result.value;
      setCurrentStep(step);
      setArray([...step.array]);
      setStepHistory((prev) => [...prev, step]);
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [algorithm, array]);

  // Step backward
  const stepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevStep = stepHistory[currentStepIndex - 1];
      setCurrentStep(prevStep);
      setArray([...prevStep.array]);
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex, stepHistory]);

  // Reset
  const reset = useCallback(() => {
    const resetArray = array.map((bar) => ({
      ...bar,
      state: "default" as const,
    }));
    setArray(resetArray);
    setCurrentStep(null);
    setStepHistory([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    isPlayingRef.current = false;
    generatorRef.current = null;
  }, [array]);

  return (
    <div className={`flex flex-col h-full relative ${isDark ? "bg-gray-900" : "bg-slate-50"}`}>
      {/* Control Panel */}
      <ControlPanel
        isDark={isDark}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        arraySize={arraySize}
        setArraySize={setArraySize}
        speed={speed}
        setSpeed={setSpeed}
        isPlaying={isPlaying}
        isEditingArray={isEditingArray}
        array={array}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        isPanelMinimized={isPanelMinimized}
        setIsPanelMinimized={setIsPanelMinimized}
        currentStepIndex={currentStepIndex}
        onGenerateNewArray={generateNewArray}
        onOpenCustomArrayEditor={openCustomArrayEditor}
        onStepBackward={stepBackward}
        onStepForward={stepForward}
        onPlay={play}
        onPause={pause}
        onReset={reset}
      />

      {/* Custom Array Modal */}
      {isEditingArray && (
        <CustomArrayModal
          isDark={isDark}
          customArrayInput={customArrayInput}
          setCustomArrayInput={setCustomArrayInput}
          onClose={() => {
            setIsEditingArray(false);
            setCustomArrayInput("");
          }}
          onApply={applyCustomArray}
        />
      )}

      {/* Main Visualization Area */}
      <div className="flex-1 flex overflow-hidden">
        <Visualization
          isDark={isDark}
          array={array}
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          stepHistoryLength={stepHistory.length}
        />

        {showInfo && (
          <InfoPanel
            algorithm={algorithm}
            isDark={isDark}
            isPanelMinimized={isPanelMinimized}
            setIsPanelMinimized={setIsPanelMinimized}
            panelWidth={panelWidth}
            isResizing={isResizing}
            handleMouseDown={handleMouseDown}
            panelRef={panelRef}
          />
        )}
      </div>
    </div>
  );
};

export default ArrayVisualizer;
