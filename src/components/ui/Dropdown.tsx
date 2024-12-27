import { useContextValue } from '@/utils/hooks/Context';
import React from 'react';
import { PiDotsThreeBold } from 'react-icons/pi';

const DropdownMenu = () => {
    const { isOpen,  handleToggle } = useContextValue()

    const handleOptionClick = (option: string) => {
        console.log(`${option} clicked`);
        // setIsOpen(false);
        // Add functionality for each option here
    };

    return (
        <div className="relative inline-block text-left">
            {/* Dropdown Trigger */}
            <div className='flex flex-col items-center justify-center w-10 h-8 text-purple-600 font-bold' onClick={handleToggle}>
                <PiDotsThreeBold size={20} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <button
                            onClick={() => handleOptionClick('Save')}
                            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => handleOptionClick('Share')}
                            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                            Invite
                        </button>
                        <button
                            onClick={() => handleOptionClick('View Collaborators')}
                            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                            View Collaborators
                        </button>
                        <button
                            onClick={() => handleOptionClick('Delete')}
                            className="block px-4 py-2 text-xs text-red-700 hover:bg-red-100 hover:text-red-900 w-full text-left"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
