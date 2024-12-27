"use client";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";


const ExcalidrawWrapper: React.FC = () => {

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Excalidraw
                UIOptions={{
                    canvasActions: {
                        saveToActiveFile: false,
                        loadScene: false,
                        export: false,
                        toggleTheme: false

                    }
                }}>
                <MainMenu>
                    <MainMenu.DefaultItems.ClearCanvas />
                    <MainMenu.DefaultItems.SaveAsImage />
                    <MainMenu.DefaultItems.ChangeCanvasBackground />
                </MainMenu>
                <WelcomeScreen>
                    <WelcomeScreen.Hints.MenuHint />
                    <WelcomeScreen.Hints.MenuHint />
                    <WelcomeScreen.Hints.ToolbarHint />
                    <WelcomeScreen.Center>
                        <WelcomeScreen.Center.MenuItemHelp />
                    </WelcomeScreen.Center>
                </WelcomeScreen>
            </Excalidraw>
        </div>
    );
};
export default ExcalidrawWrapper;