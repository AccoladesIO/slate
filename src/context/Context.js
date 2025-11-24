"use client";

import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect,
} from "react";
import { saveToIndexedDB, loadFromIndexedDB } from "@/lib/IndexedDB";
import { presentationAPI } from "@/lib/api/presentation";

const initialExcalidrawData = {
    elements: [],
    appState: {
        collaborators: [],
        viewModeEnabled: false,
        zoom: { value: 1 },
        scrollX: 0,
        scrollY: 0,
        width: 0,
        height: 0,
    },
};

const initialPresentationData = {
    title: "",
    description: "",
    editorData: null,
    excalidrawData: initialExcalidrawData,
    updatedAt: new Date(0).toISOString(),
    id: null,
};

const AppContext = createContext(null);

export const ContextProvider = ({ children }) => {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [presentationSlug, setPresentationSlug] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [presentations, setPresentations] = useState([]);
    const [currentPresentation, setCurrentPresentation] = useState(initialPresentationData);
    const [excalidrawAppState, setExcalidrawAppState] = useState(initialExcalidrawData.appState);

    useEffect(() => {
        if (!presentationSlug) return;

        (async () => {
            const data = await loadFromIndexedDB(presentationSlug);
            console.log("Loaded from IndexedDB:", data);
        })();
    }, [presentationSlug]);

    const editorRef = useRef(null);
    const excalidrawAPI = useRef(null);
    const autoSaveTimerRef = useRef(null);

    const saveToBackend = useCallback(async (data) => {
        if (!presentationSlug) return false;

        try {
            await presentationAPI.update(presentationSlug, {
                title: data.title,
                description: data.description,
                editorData: data.editor,
                excalidrawData: data.excalidraw,
            });
            setLastSaved(new Date());
            return true;
        } catch (error) {
            console.error("Failed to save to backend:", error);
            return false;
        }
    }, [presentationSlug]);

    const handleSave = useCallback(async () => {
        if (!editorRef.current || !excalidrawAPI.current || !presentationSlug) {
            console.warn("Editor, Excalidraw, or presentation ID not initialized");
            return;
        }

        if (isSaving) {
            console.log("Save already in progress");
            return;
        }

        try {
            setIsSaving(true);

            const editorData = await editorRef.current.save();
            const excalidrawData = excalidrawAPI.current.getSceneElements();
            let appState = excalidrawAPI.current.getAppState();

            // CRITICAL FIX: Ensure collaborators is always an array upon saving
            appState = {
                ...appState,
                collaborators: Array.isArray(appState.collaborators) ? appState.collaborators : [],
            };

            setExcalidrawAppState(appState);

            const payload = {
                title: currentPresentation?.title,
                description: currentPresentation?.description,
                editor: editorData,
                excalidraw: {
                    elements: excalidrawData,
                    appState,
                },
            };

            await saveToIndexedDB(presentationSlug, payload);
            await saveToBackend(payload);

            console.log("✅ Saved successfully");
        } catch (error) {
            console.error("❌ Save error:", error);
        } finally {
            setIsSaving(false);
        }
    }, [presentationSlug, isSaving, saveToBackend, currentPresentation]);

    useEffect(() => {
        if (!presentationSlug) return;

        const autoSave = async () => {
            try {
                const editorData = await editorRef.current.save();
                const excalidrawData = excalidrawAPI.current.getSceneElements();
                let appState = excalidrawAPI.current.getAppState();
                appState = {
                    ...appState,
                    collaborators: Array.isArray(appState.collaborators) ? appState.collaborators : [],
                };

                setExcalidrawAppState(appState);

                const payload = {
                    title: currentPresentation?.title,
                    description: currentPresentation?.description,
                    editor: editorData,
                    excalidraw: {
                        elements: excalidrawData,
                        appState,
                    },
                };

                await saveToIndexedDB(presentationSlug, payload);
                console.log("💾 Auto-saved to IndexedDB");
            } catch (err) {
                console.error("❌ Auto-save error:", err);
            }
        };

        autoSaveTimerRef.current = setInterval(autoSave, 30000);

        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, [presentationSlug, currentPresentation]);

    const loadPresentation = useCallback(async (id) => {
        try {
            const [localData, serverResponse] = await Promise.all([
                loadFromIndexedDB(id),
                presentationAPI.getById(id)
            ]);

            const serverData = serverResponse.data;
            setCurrentPresentation(serverData);

            let dataToLoad = {
                title: serverData.title,
                description: serverData.description,
                editor: serverData.editorData,
                excalidraw: serverData.excalidrawData,
            };

            if (localData) {
                const localTime = new Date(localData.updatedAt).getTime();
                const serverTime = new Date(serverData.updatedAt).getTime();

                if (localTime > serverTime) {
                    console.log("📦 Using local data (newer)");
                    dataToLoad = {
                        title: localData.title || serverData.title,
                        description: localData.description || serverData.description,
                        editor: localData.editorData,
                        excalidraw: localData.excalidrawData,
                    };
                } else {
                    console.log("🌐 Using server data");
                }
            }

            if (editorRef.current && dataToLoad.editor) {
                try {
                    await editorRef.current.isReady;
                    await editorRef.current.render(dataToLoad.editor);
                    console.log("✅ Editor data loaded");
                } catch (err) {
                    console.error("Failed to render editor data:", err);
                }
            }

            if (excalidrawAPI.current && dataToLoad.excalidraw) {
                try {
                    excalidrawAPI.current.updateScene({
                        elements: dataToLoad.excalidraw.elements || [],
                        appState: dataToLoad.excalidraw.appState || initialExcalidrawData.appState,
                    });
                    setExcalidrawAppState(dataToLoad.excalidraw.appState || initialExcalidrawData.appState);
                    console.log("✅ Excalidraw data loaded");
                } catch (err) {
                    console.error("Failed to update excalidraw scene:", err);
                }
            }

            return dataToLoad;
        } catch (error) {
            console.error("Failed to load presentation:", error);
            return null;
        }
    }, [presentationSlug]);

    const createPresentation = useCallback(async (data) => {
        try {
            const response = await presentationAPI.create(data);
            setPresentations((prev) => [response.data, ...prev]);
            console.log("Presentation created:", response.data);
            return response.data;
        } catch (error) {
            console.error("Failed to create presentation:", error);
            throw error;
        }
    }, []);

    const fetchPresentations = useCallback(async (params) => {
        try {
            const response = await presentationAPI.getAll(params);
            setPresentations(response.data.presentations);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch presentations:", error);
            throw error;
        }
    }, []);

    const updatePresentation = useCallback(async (id, data) => {
        try {
            const response = await presentationAPI.update(id, data);
            setPresentations((prev) =>
                prev.map((p) => (p.id === id ? response.data : p))
            );
            return response.data;
        } catch (error) {
            console.error("Failed to update presentation:", error);
            throw error;
        }
    }, []);

    const deletePresentation = useCallback(async (id) => {
        try {
            await presentationAPI.delete(id);
            setPresentations((prev) => prev.filter((p) => p.id !== id));
            return true;
        } catch (error) {
            console.error("Failed to delete presentation:", error);
            throw error;
        }
    }, []);

    const duplicatePresentation = useCallback(async (id) => {
        try {
            const response = await presentationAPI.duplicate(id);
            setPresentations((prev) => [response.data, ...prev]);
            return response.data;
        } catch (error) {
            console.error("Failed to duplicate presentation:", error);
            throw error;
        }
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const toggleSideBar = useCallback(() => {
        setSideBarOpen((prev) => !prev);
    }, []);

    const value = {
        sideBarOpen,
        isOpen,
        isSaving,
        lastSaved,
        presentations,
        currentPresentation,
        presentationSlug,
        editorRef,
        excalidrawAPI,
        excalidrawAppState,
        toggleSideBar,
        setIsOpen,
        handleToggle,
        handleSave,
        setPresentationSlug,
        loadPresentation,
        createPresentation,
        fetchPresentations,
        updatePresentation,
        deletePresentation,
        duplicatePresentation,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useContextValue = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useContextValue must be used within a ContextProvider");
    }
    return context;
};