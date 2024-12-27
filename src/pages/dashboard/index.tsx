import Layout from '@/components/Layout/Layout'
import React from 'react'
import { GiBookshelf } from 'react-icons/gi'
import { IoAddOutline, IoPeopleOutline } from 'react-icons/io5'

const Dashboard = () => {
    return (
        <Layout active='Dashboard'>
            <div className='w-full'>
                <div className='w-full min-h-[200px] bg-purple-100 items-center justify-center'>
                    <div className="flex flex-col sm:flex-row w-full p-3 justify-center items-center gap-4 min-h-[200px]">
                        <div className="w-full bg-white rounded-lg shadow-md h-[130px] flex flex-col items-center justify-center text-xs text-black/65 hover:text-black"><IoAddOutline size={40} /> <span className='w-full inline-block text-center'>Create Slate</span> </div>
                        <div className="w-full bg-white rounded-lg shadow-md h-[130px] flex flex-col items-center justify-center text-xs text-black/65 hover:text-black"><GiBookshelf size={40} /> <span className='w-full inline-block text-center'>Browse Presentations</span> </div>
                        <div className="w-full bg-white rounded-lg shadow-md h-[130px] flex flex-col items-center justify-center text-xs text-black/65 hover:text-black"><IoPeopleOutline size={40} /> <span className='w-full inline-block text-center'>View Collaborations</span> </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
