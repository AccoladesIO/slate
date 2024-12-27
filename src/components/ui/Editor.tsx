import React, { useEffect, useRef, useState } from 'react';
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

// Dynamic import to disable SSR
const Editor = dynamic(
    () =>
        import('@editorjs/editorjs').then((EditorJS) => {
            return () => {
                const editorInstance = useRef<any>(null);

                // Raw data for EditorJS initialization
                const initialData = {
                    time: 1550476186479,
                    blocks: [
                        {
                            id: '123',
                            type: 'header',
                            data: {
                                text: 'Slate Header',
                                level: 1,
                            },
                        },
                        {
                            id: '1234',
                            type: 'header',
                            data: {
                                text: 'Slate Header',
                                level: 3,
                            },
                        },
                    ],
                };

                const [editorData, setEditorData] = useState(initialData);

                // Initialize EditorJS on component mount
                useEffect(() => {
                    const initializeEditor = async () => {
                        // Dynamically import EditorJS on the client side
                        const EditorJSInstance = (await import('@editorjs/editorjs')).default;

                        editorInstance.current = new EditorJSInstance({
                            autofocus: true,
                            data: editorData,  // Set the initial document data
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
                    };

                    initializeEditor();

                    // Cleanup the editor on unmoun
                }, []); // Only rerun when the editor data changes

                return (
                    <div className="w-full h-full p-4 overflow-y-scroll" id='editorjs'>
                    </div>
                );
            };
        }),
    { ssr: false }
);

export default Editor;
