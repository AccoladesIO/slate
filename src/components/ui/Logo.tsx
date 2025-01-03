import React from 'react'
import { useRouter } from 'next/router'

const Logo = () => {
    const router = useRouter()
    return (
        <div className=' flex items-center justify-start sixtyfour text-purple-500 font-bolder text-sm gap-1 cursor-pointer' onClick={() => router.push('/')} ><img src='/Wing.png' alt='Slate Logo' className='w-8 h-8 rounded-md' />
            Slate</div>
    )
}

export default Logo
