import { useEffect, useState } from "react";
import { useContextValue } from "@/context/Context";

export const usePresentationEditor = (presentationId) => {
    const {
        loadPresentation,
        editorRef,
        excalidrawAPI,
        handleSave,
        isSaving,
        lastSaved,
        currentPresentation,
        setPresentationSlug,
    } = useContextValue();
    if (presentationId) setPresentationSlug(presentationId);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeEditor = async () => {
            if (!presentationId) return;

            const checkEditorsReady = async () => {
                let attempts = 0;
                const maxAttempts = 50;

                while (attempts < maxAttempts) {
                    if (editorRef.current && excalidrawAPI.current) {
                        return true;
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }
                return false;
            };

            const editorsReady = await checkEditorsReady();

            if (!editorsReady) {
                setError("Editors failed to initialize");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                await loadPresentation(presentationId);
            } catch (err) {
                setError(err.message || "Failed to load presentation");
            } finally {
                setLoading(false);
            }
        };

        initializeEditor();
    }, [presentationId, loadPresentation]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave]);

    return {
        loading,
        error,
        isSaving,
        lastSaved,
        currentPresentation,
        handleSave,
    };
};