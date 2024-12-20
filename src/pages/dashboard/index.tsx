import Layout from '@/components/Layout/Layout'
import React from 'react'

const Dashboard = () => {
    return (
        <Layout active='Dashboard'>
            <div className='w-full'>
                <div className='w-full min-h-[300px] bg-purple-100 items-center justify-center '>
                    <div className="flex flex-col sm:flex-row w-full p-3 justify-center items-center gap-4 min-h-[300px]">
                        <div className="w-full bg-white rounded-lg shadow-md h-[130px]"></div>
                        <div className="w-full bg-white rounded-lg shadow-md h-[130px]"></div>
                        <div className="w-full bg-white rounded-lg shadow-md h-[130px]"></div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
