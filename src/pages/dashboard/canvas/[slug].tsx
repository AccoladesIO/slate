import Layout from '@/components/Layout/Layout'
import DropdownMenu from '@/components/ui/Dropdown'
import Editor from '@/components/ui/Editor'
import Slate from '@/components/ui/Slate'
import { useContextValue } from '@/utils/hooks/Context'
import React from 'react'
import { useRouter } from 'next/router'

const SingleCanvas = () => {
    const router = useRouter()
    const { slug } = router.query
    const { handleToggle } = useContextValue()
    return (
        <Layout active='Canvas'>
            <div className='w-full'>
                <div className='flex items-center justify-between p-4'>
                    <h2 className='w-full text-sm text-black/50'>Project Title {slug}</h2>
                    <div className='flex flex-col items-center justify-center text-purple-600' onClick={handleToggle}>
                        <DropdownMenu />
                    </div>
                </div>
                <div className='w-full grid h-[800px] grid-cols-2'>
                    <div className='w-full h-full border-black/15 border bg-white'>
                        <Editor />
                    </div>
                    <div className='w-full h-full border-black/15 border bg-white'><Slate /></div>
                </div>
            </div>
        </Layout>
    )
}

export default SingleCanvas
