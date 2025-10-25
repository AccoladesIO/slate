"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

const AppContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const isSaving = useRef(false);
  const editorRef = useRef(null);
  const excalidrawAPI = useRef(null);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleSideBar = useCallback(() => {
    setSideBarOpen(prev => !prev);
  }, []);

  // Use useCallback with empty deps to prevent function recreation
  const handleSave = useCallback(async () => {
    if (!editorRef.current || !excalidrawAPI.current) {
      console.warn("Editor or Excalidraw not initialized yet.");
      return;
    }

    // Prevent multiple simultaneous saves
    if (isSaving.current) {
      console.log("Save already in progress...");
      return;
    }

    try {
      isSaving.current = true;

      // Get Editor.js data
      const editorData = await editorRef.current.save();

      // Get Excalidraw scene data
      const excalidrawData = excalidrawAPI.current.getSceneElements();
      const appState = excalidrawAPI.current.getAppState();

      // Combine both data
      const payload = {
        editor: editorData,
        excalidraw: {
          elements: excalidrawData,
          appState,
        },
        updatedAt: new Date().toISOString(),
      };

      // Mock save — console JSON data
      console.log("🧩 Mock save payload:", JSON.stringify(payload, null, 2));
      console.log("✅ Mock save complete!");
      
      // When you implement real API call:
      // await fetch('/api/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
    } catch (error) {
      console.error("❌ Error during mock save:", error);
    } finally {
      isSaving.current = false;
    }
  }, []); // Empty deps - function never changes

  // Memoize context value to prevent re-renders
  const contextValue = useRef({
    get sideBarOpen() { return sideBarOpen; },
    get isOpen() { return isOpen; },
    toggleSideBar,
    setIsOpen,
    handleToggle,
    editorRef,
    excalidrawAPI,
    handleSave,
    get isSaving() { return isSaving.current; }
  });

  // Update only the values that changed
  contextValue.current.toggleSideBar = toggleSideBar;
  contextValue.current.handleToggle = handleToggle;
  contextValue.current.handleSave = handleSave;

  return (
    <AppContext.Provider value={contextValue.current}>
      {children}
    </AppContext.Provider>
  );
};

export const useContextValue = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useContextValue must be used within a ContextProvider");
  }
  return context;
};