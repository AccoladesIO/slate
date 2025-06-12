import Layout from '@/components/Layout/Layout'
import DropdownMenu from '@/components/ui/Dropdown'
import Editor from '@/components/ui/Editor'
import Slate from '@/components/ui/Slate'
import { useContextValue } from '@/utils/hooks/Context'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'

const SingleCanvas = () => {
    const router = useRouter()
    const { slug } = router.query
    const { handleToggle } = useContextValue()

    const [leftWidth, setLeftWidth] = useState(50);
    const resizerRef = useRef<HTMLDivElement>(null);
    let isResizing = false;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
        isResizing = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: { clientX: number }) => {
        if (!isResizing) return;
        const containerWidth = resizerRef.current?.parentElement?.clientWidth;
        if (!containerWidth) return;
        const newLeftWidth = (event.clientX / containerWidth) * 100;
        if (newLeftWidth > 20 && newLeftWidth < 80) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <Layout active='Canvas'>
            <div className='w-full'>
                <div className='flex items-center justify-between p-4'>
                    <h2 className='w-full text-sm text-black/50'>Project Title {slug}</h2>
                    <div className='flex flex-col items-center justify-center text-purple-600' onClick={handleToggle}>
                        <DropdownMenu />
                    </div>
                </div>
                <div className='w-full h-[800px] flex'>
                    <div style={{ width: `${leftWidth}%` }} className='h-full border border-black/15 bg-white'>
                        <Editor />
                    </div>
                    <div ref={resizerRef} className='w-1 h-[100px] my-auto cursor-ew-resize bg-gray-500' onMouseDown={handleMouseDown}></div>
                    <div style={{ width: `${100 - leftWidth}%` }} className='h-full border border-black/15 bg-white'>
                        <Slate />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SingleCanvas
