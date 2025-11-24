"use client";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { useContextValue } from "@/context/Context";
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { MutableRefObject } from "react";

const ExcalidrawWrapper = () => {
    const {
        excalidrawAPI,
        excalidrawAppState,
    }: {
        excalidrawAPI: MutableRefObject<ExcalidrawImperativeAPI | null>;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        excalidrawAppState: any;
    } = useContextValue() as {
        excalidrawAPI: MutableRefObject<ExcalidrawImperativeAPI | null>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        excalidrawAppState: any;
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Excalidraw
                excalidrawAPI={(api) => (excalidrawAPI.current = api)}
                initialData={{
                    appState: {
                        ...excalidrawAppState,
                        collaborators: [],
                    },
                }}
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
