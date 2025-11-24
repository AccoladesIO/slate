import React, { useState, useEffect } from 'react';
import { FiX, FiUserCheck, FiTrash2, FiMail, FiClock } from 'react-icons/fi';

interface SharedWithUser {
    id: string;
    name: string;
    email: string;
}

interface PresentationCollaborator {
    id: string;
    presentationId: string;
    sharedWithUserId: string;
    accessLevel: 'read' | 'write';
    sharedByUserId: string;
    createdAt: string;
    updatedAt: string;
    sharedWith: SharedWithUser;
}

interface CollaboratorsResponse {
    success: boolean;
    data: PresentationCollaborator[];
}

interface CollaboratorsModalProps {
    presentationId: string;
    isOpen: boolean;
    onClose: () => void;
}

const CollaboratorsModal: React.FC<CollaboratorsModalProps> = ({
    presentationId,
    isOpen,
    onClose
}) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const [collaborators, setCollaborators] = useState<PresentationCollaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchCollaborators = async (): Promise<CollaboratorsResponse> => {
        const response = await fetch(`${baseUrl}/sharing/${presentationId}/shares`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Failed to fetch collaborators');
        }
        return response.json();
    };

    const removeCollaborator = async (userId: string): Promise<{ success: boolean }> => {
        const response = await fetch(`${baseUrl}/sharing/${presentationId}/revoke`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to revoke access' }));
            throw new Error(errorData.message || 'Failed to revoke access');
        }
        return { success: true };
    };

    const loadCollaborators = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchCollaborators();
            if (response.success) {
                setCollaborators(response.data);
            }
        } catch (err) {
            setError('Failed to load collaborators');
            console.error('Error loading collaborators:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && presentationId) {
            loadCollaborators();
        }
    }, [isOpen, presentationId]);

    const handleRemoveCollaborator = async (collaborator: PresentationCollaborator): Promise<void> => {
        if (!confirm(`Are you sure you want to remove access for ${collaborator.sharedWith.email}?`)) {
            return;
        }

        try {
            setRemovingId(collaborator.id);
            const response = await removeCollaborator(collaborator.sharedWithUserId);
            
            if (response.success) {
                setCollaborators(prev => prev.filter(collab => collab.id !== collaborator.id));
            }
        } catch (err) {
            console.error('Error removing collaborator:', err);
            alert((err instanceof Error) ? err.message : 'Failed to remove collaborator');
        } finally {
            setRemovingId(null);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[85vh] flex flex-col"
                style={{ border: '1px solid oklch(0.65 0.25 330 / 0.2)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: 'oklch(0.65 0.25 330 / 0.1)' }}
                >
                    <div>
                        <h3 
                            className="text-xl font-semibold"
                            style={{ color: 'oklch(0.45 0.18 300)' }}
                        >
                            Collaborators
                        </h3>
                        <p 
                            className="text-sm mt-1"
                            style={{ color: 'oklch(0.45 0.18 300 / 0.6)' }}
                        >
                            Manage who has access to this presentation
                        </p>
                    </div>
                    <button
                        aria-label='Close modal'
                        onClick={onClose}
                        className="p-1 rounded-lg transition-all"
                        onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <FiX size={20} style={{ color: 'oklch(0.45 0.18 300)' }} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div 
                                className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                                style={{ borderColor: 'oklch(0.65 0.25 330)', borderTopColor: 'transparent' }}
                            />
                        </div>
                    )}

                    {error && (
                        <div 
                            className="p-4 rounded-lg text-sm"
                            style={{ background: '#fee2e2', color: '#dc2626' }}
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && collaborators.length === 0 && (
                        <div 
                            className="text-center py-12"
                            style={{ color: 'oklch(0.45 0.18 300 / 0.6)' }}
                        >
                            <FiUserCheck size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No collaborators yet</p>
                            <p className="text-sm mt-2">Share this presentation to add collaborators</p>
                        </div>
                    )}

                    {!loading && !error && collaborators.length > 0 && (
                        <div className="space-y-3">
                            {collaborators.map((collaborator) => (
                                <div
                                    key={collaborator.id}
                                    className="p-4 rounded-xl transition-all"
                                    style={{ 
                                        border: '1px solid oklch(0.65 0.25 330 / 0.15)',
                                        background: 'oklch(0.98 0.01 70)'
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
                                            style={{ background: 'oklch(0.65 0.25 330)' }}
                                        >
                                            {getInitials(collaborator.sharedWith.name)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div className="min-w-0">
                                                    <h4 
                                                        className="font-semibold truncate"
                                                        style={{ color: 'oklch(0.45 0.18 300)' }}
                                                    >
                                                        {collaborator.sharedWith.name}
                                                    </h4>
                                                    <div 
                                                        className="flex items-center gap-1.5 text-sm mt-0.5"
                                                        style={{ color: 'oklch(0.45 0.18 300 / 0.7)' }}
                                                    >
                                                        <FiMail size={14} />
                                                        <span className="truncate">{collaborator.sharedWith.email}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span
                                                        className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize"
                                                        style={{
                                                            background: 'oklch(0.65 0.25 330 / 0.1)',
                                                            color: 'oklch(0.65 0.25 330)'
                                                        }}
                                                    >
                                                        {collaborator.accessLevel}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemoveCollaborator(collaborator)}
                                                        disabled={removingId === collaborator.id}
                                                        className="p-2 rounded-lg transition-all disabled:opacity-50"
                                                        style={{ color: '#dc2626' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        title="Remove collaborator"
                                                    >
                                                        {removingId === collaborator.id ? (
                                                            <div 
                                                                className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                                                                style={{ borderColor: '#dc2626', borderTopColor: 'transparent' }}
                                                            />
                                                        ) : (
                                                            <FiTrash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div 
                                                className="flex items-center gap-4 text-xs mt-2"
                                                style={{ color: 'oklch(0.45 0.18 300 / 0.5)' }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <FiClock size={12} />
                                                    <span>Added {formatDate(collaborator.createdAt)}</span>
                                                </div>
                                                {collaborator.updatedAt !== collaborator.createdAt && (
                                                    <div className="flex items-center gap-1">
                                                        <span>•</span>
                                                        <span>Updated {formatDate(collaborator.updatedAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div 
                    className="p-6 border-t"
                    style={{ borderColor: 'oklch(0.65 0.25 330 / 0.1)' }}
                >
                    <div className="flex items-center justify-between">
                        <p 
                            className="text-sm"
                            style={{ color: 'oklch(0.45 0.18 300 / 0.6)' }}
                        >
                            {collaborators.length} {collaborators.length === 1 ? 'collaborator' : 'collaborators'}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg font-medium text-white transition-all"
                            style={{ 
                                background: 'oklch(0.65 0.25 330)',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.60 0.25 330)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330)'}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollaboratorsModal;