"use client";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { useContextValue } from "@/utils/hooks/Context";
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { MutableRefObject } from "react";

const ExcalidrawWrapper = () => {
  const {
    excalidrawAPI,
  }: {
    excalidrawAPI: MutableRefObject<ExcalidrawImperativeAPI | null>;
  } = useContextValue();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Excalidraw
        excalidrawAPI={(api) => (excalidrawAPI.current = api)} // ✅ store API ref globally
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
            toggleTheme: false,
            changeViewBackgroundColor: true,
            clearCanvas: true,
          },
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
      </Excalidraw>
    </div>
  );
};

export default ExcalidrawWrapper;
