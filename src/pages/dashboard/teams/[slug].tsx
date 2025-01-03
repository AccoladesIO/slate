import Layout from '@/components/Layout/Layout'
import React from 'react'
import { useRouter } from 'next/router'


const TeamSlug = () => {
    const router = useRouter()
    const { slug } = router.query
    return (
        <Layout active='Teams'>
            <div className='w-full p-4'>
                <p className='w-full text-left text-base font-bold my-4'>Team holla {slug}
                </p>
                <div className='grid grid-cols-3 sm:grid-cols-5 items-center justify-center text-left font-semibold border-b'>
                    <div className='w-full p-2 text-bold col-span-2'>Slate</div>
                    <div className='w-full p-2 text-bold'>Created at</div>
                    <div className='w-full p-2 text-bold hidden sm:block'>Last Modified</div>
                    <div className='w-full p-2 text-bold'>Collaborators</div>
                </div>
            </div>
        </Layout>
    )
}

export default TeamSlug
