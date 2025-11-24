import Layout from '@/components/Layout/Layout';
import Editor from '@/components/ui/Editor';
import Slate from '@/components/ui/Slate';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import ActionIconsBar from '@/components/ui/ActionIconsBar';
import { useContextValue } from '@/context/Context';

const SingleCanvas = () => {
  const { setPresentationSlug } = useContextValue() as { setPresentationSlug?: (slug: string) => void };
  const router = useRouter();
  const { slug } = router.query;

    useEffect(() => {
    if (slug && typeof slug === 'string') {
      setPresentationSlug?.(slug);
    }
  }, [slug, setPresentationSlug]);


  const [leftWidth, setLeftWidth] = useState(50);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  let isResizing = false;

  const handleMouseDown = () => {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent): void => {
    if (!isResizing) return;
    const parent = resizerRef.current?.parentElement;
    const containerWidth = parent instanceof HTMLElement ? parent.clientWidth : undefined;
    if (!containerWidth) return;
    const newLeftWidth = (event.clientX / containerWidth) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) setLeftWidth(newLeftWidth);
  };

  const handleMouseUp = () => {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <Layout active="Canvas">
      <div className="w-full min-h-screen" style={{ background: 'oklch(0.98 0.01 70)' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'oklch(0.65 0.25 330 / 0.15)' }}
        >
          <h2 className="w-full text-sm font-medium" style={{ color: 'oklch(0.45 0.18 300)' }}>
            Project Title
          </h2>

          <div className="flex items-center gap-4">
            <ActionIconsBar />
          </div>
        </div>

        {/* Main Content */}
        <div
          className="
            flex flex-col sm:flex-row w-full h-[900px] p-4 gap-3
          "
        >
          {/* Left Panel (Editor) */}
          <div
            style={{
              width: '100%',
              ...(typeof window !== 'undefined' && window.innerWidth >= 640
                ? { width: `${leftWidth}%` }
                : {}),
              background: 'white',
              border: '1px solid oklch(0.65 0.25 330 / 0.12)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px oklch(0.45 0.18 300 / 0.06)',
            }}
            className="h-[400px] sm:h-full overflow-hidden"
          >
            <Editor />
          </div>

          {/* Divider (hidden on small screens) */}
          <div
            ref={resizerRef}
            className="hidden sm:block w-2 rounded-full h-[60px] my-auto cursor-ew-resize transition-all hover:w-3"
            style={{
              background: 'oklch(0.65 0.25 330)',
              boxShadow: '0 2px 6px oklch(0.65 0.25 330 / 0.3)',
            }}
            onMouseDown={handleMouseDown}
          />

          {/* Right Panel (Slate) */}
          <div
            style={{
              width: '100%',
              ...(typeof window !== 'undefined' && window.innerWidth >= 640
                ? { width: `${100 - leftWidth}%` }
                : {}),
              background: 'white',
              border: '1px solid oklch(0.65 0.25 330 / 0.12)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px oklch(0.45 0.18 300 / 0.06)',
            }}
            className="h-[400px] sm:h-full overflow-hidden"
          >
            <Slate />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleCanvas;
