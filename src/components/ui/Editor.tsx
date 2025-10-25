import React, { useEffect, useCallback } from 'react';
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
import { useContextValue } from '@/utils/hooks/Context'; // ✅ import global context
import EditorJS from '@editorjs/editorjs';

const EditorComponent = () => {
  const { editorRef } = useContextValue() as { editorRef: React.MutableRefObject<EditorJS | null> }; // ✅ use global ref

  const rawDocument = {
    time: 1550476186479,
    blocks: [
      {
        data: { text: 'Document Name', level: 1 },
        id: '123',
        type: 'header',
      },
      {
        data: { level: 4 },
        id: '1234',
        type: 'header',
      },
    ],
    version: '2.8.1',
  };

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;

    if (!editorRef.current) {
      editorRef.current = new EditorJS({
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
          paragraph: { class: Paragraph, inlineToolbar: true },
          table: {
            class: Table,
            inlineToolbar: true,
            config: { rows: 2, cols: 3, maxRows: 10, maxCols: 10 },
          },
          list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: { defaultStyle: 'unordered' },
          },
          embed: {
            class: Embed,
            config: { services: { youtube: true, coub: true } },
          },
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              shortcut: 'CMD+SHIFT+H',
              levels: [1, 2, 3, 4],
              defaultLevel: 3,
            },
          },
          raw: RawTool,
          code: CodeTool,
        },
      });
    }
  }, [editorRef, rawDocument]);

  useEffect(() => {
    initializeEditor();
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initializeEditor]);

  return <div className="w-full h-full p-4 overflow-y-scroll" id="editorjs" />;
};

const Editor = dynamic(() => Promise.resolve(EditorComponent), { ssr: false });
export default Editor;
