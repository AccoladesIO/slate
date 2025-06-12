import React, { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import RawTool from '@editorjs/raw';
import Header from '@editorjs/header';
import SimpleImage from '@editorjs/simple-image';
import EditorjsList from '@editorjs/list';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import type EditorJS from '@editorjs/editorjs';

// Define interfaces for our data structure
interface EditorBlock {
    data: {
        text?: string;
        level: number;
    };
    id: string;
    type: string;
}

interface EditorData {
    time: number;
    blocks: EditorBlock[];
    version: string;
}

// Define the Editor component separately
const EditorComponent = () => {
    // Use proper typing for the editor instance
    const editorInstance = useRef<EditorJS | null>(null);

    // Raw data for EditorJS initialization
    const rawDocument: EditorData = {
        "time": 1550476186479,
        "blocks": [{
            data: {
                text: 'Document Name',
                level: 2
            },
            id: "123",
            type: 'header'
        },
        {
            data: {
                level: 4
            },
            id: "1234",
            type: 'header'
        }],
        "version": "2.8.1"
    };

    // Move initialization logic to a callback to properly handle dependencies
    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default;

        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                autofocus: true,
                data: rawDocument,
                holder: 'editorjs',
                tools: {
                    image: SimpleImage,
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+O',
                        config: {
                            quotePlaceholder: 'Enter a quote',
                            captionPlaceholder: "Quote's author",
                        },
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    table: {
                        class: Table,
                        inlineToolbar: true,
                        config: {
                            rows: 2,
                            cols: 3,
                            maxRows: 10,
                            maxCols: 10,
                        },
                    },
                    list: {
                        class: EditorjsList,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: 'unordered',
                        },
                    },
                    embed: {
                        class: Embed,
                        config: {
                            services: {
                                youtube: true,
                                coub: true,
                            },
                        },
                    },
                    header: {
                        class: Header,
                        config: {
                            placeholder: 'Enter a header',
                            shortcut: 'CMD+SHIFT+H',
                            levels: [1, 2, 3],
                            defaultLevel: 3,
                        },
                    },
                    raw: RawTool,
                    code: CodeTool,
                },
            });
        }
    }, [rawDocument]);

    useEffect(() => {
        initializeEditor();

        return () => {
            if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, [initializeEditor]); // Now correctly depends on initializeEditor

    return (
        <div className="w-full h-full p-4 overflow-y-scroll custom-scrollbar" id="editorjs" />
    );
};

// Use dynamic import properly
const Editor = dynamic(() => Promise.resolve(EditorComponent), { ssr: false });

export default Editor;