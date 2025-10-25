import { useContextValue } from '@/utils/hooks/Context';
import React, { useState } from 'react';
import { FiSave, FiUserPlus, FiUsers, FiTrash2, FiX } from 'react-icons/fi';

const ActionIconsBar = () => {
    const { handleSave }: { handleSave: () => void } = useContextValue();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [email, setEmail] = useState('');

    const handleOptionClick = (option: string) => {
        console.log(`${option} clicked`);

        if (option === "Save") {
            handleSave();
        }
        if (option === "Share") {
            setShowInviteModal(true);
        }
        if (option === "View Collaborators") {
            // Add view collaborators functionality
        }
        if (option === "Delete") {
            setShowDeleteModal(true);
        }
    };

    const handleInvite = () => {
        console.log('Inviting:', email);
        // Add invite API call here
        setEmail('');
        setShowInviteModal(false);
    };

    const handleDelete = () => {
        console.log('Deleting project');
        // Add delete API call here
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="flex items-center gap-2">
                {/* Save Button */}
                <button
                    onClick={() => handleOptionClick('Save')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all hover:bg-opacity-10"
                    style={{
                        color: 'oklch(0.65 0.25 330)'
                    }}
                    title="Save"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiSave size={20} />
                </button>

                {/* Invite Button */}
                <button
                    onClick={() => handleOptionClick('Share')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                    style={{
                        color: 'oklch(0.65 0.25 330)'
                    }}
                    title="Invite"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiUserPlus size={20} />
                </button>

                {/* View Collaborators Button */}
                <button
                    onClick={() => handleOptionClick('View Collaborators')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                    style={{
                        color: 'oklch(0.65 0.25 330)'
                    }}
                    title="View Collaborators"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiUsers size={20} />
                </button>

                {/* Divider */}
                <div
                    className="w-px h-6 mx-1"
                    style={{ background: 'oklch(0.65 0.25 330 / 0.2)' }}
                />

                {/* Delete Button */}
                <button
                    onClick={() => handleOptionClick('Delete')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                    style={{
                        color: '#dc2626'
                    }}
                    title="Delete"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiTrash2 size={20} />
                </button>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowInviteModal(false)}
                >
                    <div 
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                        style={{ border: '1px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 
                                className="text-xl font-semibold"
                                style={{ color: 'oklch(0.45 0.18 300)' }}
                            >
                                Invite Collaborator
                            </h3>
                            <button
                                aria-label='Fix modal call'
                                onClick={() => setShowInviteModal(false)}
                                className="p-1 rounded-lg transition-all"
                                onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <FiX size={20} style={{ color: 'oklch(0.45 0.18 300)' }} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <label 
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'oklch(0.45 0.18 300)' }}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                className="w-full px-4 py-3 rounded-lg transition-all outline-none"
                                style={{ 
                                    border: '1px solid oklch(0.65 0.25 330 / 0.3)',
                                    background: 'oklch(0.98 0.01 70)'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'oklch(0.65 0.25 330)';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px oklch(0.65 0.25 330 / 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'oklch(0.65 0.25 330 / 0.3)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
                                style={{ 
                                    border: '1px solid oklch(0.65 0.25 330 / 0.3)',
                                    color: 'oklch(0.45 0.18 300)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInvite}
                                className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all"
                                style={{ 
                                    background: 'oklch(0.65 0.25 330)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.60 0.25 330)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330)'}
                                disabled={!email}
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div 
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                        style={{ border: '1px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 
                                className="text-xl font-semibold"
                                style={{ color: '#dc2626' }}
                            >
                                Delete Project
                            </h3>
                            <button
                                aria-label='Shoe delete modal'
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 rounded-lg transition-all"
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <FiX size={20} style={{ color: '#dc2626' }} />
                            </button>
                        </div>
                        
                        <p className="mb-6" style={{ color: 'oklch(0.45 0.18 300)' }}>
                            Are you sure you want to delete this project? This action cannot be undone and all data will be permanently lost.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
                                style={{ 
                                    border: '1px solid oklch(0.65 0.25 330 / 0.3)',
                                    color: 'oklch(0.45 0.18 300)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all"
                                style={{ 
                                    background: '#dc2626'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionIconsBar;