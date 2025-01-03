import { useRouter } from 'next/router';
import React from 'react';

const LoginPage: React.FC = () => {
    const router = useRouter()
    return (
        <div className="h-screen md:flex">
            {/* Left Section */}
            <div className="relative overflow-hidden md:flex w-1/2  justify-around items-center hidden bg-cover" style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/017/033/097/original/simple-abstract-background-design-suitable-for-ppt-backgrounds-and-others-free-vector.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 bg-purple-500 bg-opacity-30"></div>

                <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
            </div>

            {/* Right Section */}
            <div className="flex md:w-full justify-center py-10 items-center bg-white">
                <form className="bg-white">
                    <p className="text-lg font-bold text-gray-600 mb-7 flex items-center justify-start gap-4"><img src='/Wing.png' alt='Slate Logo' className='w-8 h-8 rounded-md' />
                        Welcome Back</p>

                    {/* Input Fields */}
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                        </svg>
                        <input
                            className="pl-2 outline-none border-none text-sm"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            className="pl-2 outline-none border-none text-sm"
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
                    >
                        Login
                    </button>
                    <span className='w-full text-xs text-purple-700 cursor-pointer' onClick={() => router.push('/auth/signup/')}>
                        Don't have an Account?
                    </span>
                    <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">
                        Forgot Password?
                    </span>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
