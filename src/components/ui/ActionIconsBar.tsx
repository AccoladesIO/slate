import { useContextValue } from '@/context/Context';
import React, { useState, useEffect, useCallback} from 'react';
import { FiSave, FiUserPlus, FiUsers, FiTrash2, FiX, FiLink, FiCopy, FiMail, FiEdit2 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { usePresentationEditor } from '@/utils/hooks/usePresentationEditor';
import CollaboratorsModal from './CollaboratorsModal';

interface ShareByEmailPayload {
    email: string;
    accessLevel: 'read' | 'write';
}

interface ShareByLinkPayload {
    accessLevel: 'read' | 'write';
    password?: string;
    expiresInDays?: number;
    expiresAt?: string;
    maxViews?: number;
}

interface ShareLinkResponse {
    id: string;
    url?: string;
    token: string;
    presentationId: string;
    accessLevel: 'read' | 'write';
    createdAt: string;
    expiresAt?: string;
    maxViews?: number;
    currentViews: number;
    password?: string;
}

interface UpdateVisibilityPayload {
    isPublic: boolean;
}

type ShareMethod = 'email' | 'link';

const ActionIconsBar: React.FC = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const router = useRouter();
    const { slug } = router.query;
    const presentationId = typeof slug === 'string' ? slug : '';

    const { deletePresentation } = useContextValue();
    const { handleSave, isSaving, lastSaved } = usePresentationEditor(presentationId);

    const [showShareModal, setShowShareModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);

    const [shareMethod, setShareMethod] = useState<ShareMethod>('email');
    const [email, setEmail] = useState('');
    const [accessLevel, setAccessLevel] = useState<'read' | 'write'>('read');
    const [password, setPassword] = useState('');
    const [expiresInDays, setExpiresInDays] = useState<number>(7);
    const [maxViews, setMaxViews] = useState<number | ''>('');
    const [usePassword, setUsePassword] = useState(false);
    const [useMaxViews, setUseMaxViews] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const [visibilityLoading, setVisibilityLoading] = useState(false);
    const [loadingExistingLinks, setLoadingExistingLinks] = useState(false);

    const [sharedLink, setSharedLink] = useState<ShareLinkResponse | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    
    const fetchExistingShareLinks = useCallback(async (): Promise<void> => {
        try {
            setLoadingExistingLinks(true);
            const response = await fetch(`${baseUrl}/share-link/presentation/${presentationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    const latestLink = data.data[0];
                    setSharedLink({
                        ...latestLink,
                        url: `${window.location.origin}/shared/${latestLink.token}`
                    });
                    
                    setAccessLevel(latestLink.accessLevel);
                    setPassword(latestLink.password || '');
                    setUsePassword(!!latestLink.password);
                    setMaxViews(latestLink.maxViews || '');
                    setUseMaxViews(!!latestLink.maxViews);

                    if (latestLink.expiresAt) {
                        const expiryDate = new Date(latestLink.expiresAt);
                        const today = new Date();
                        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        setExpiresInDays(diffDays > 0 ? diffDays : 1);
                    } else {
                        setExpiresInDays(7);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch existing share links:', error);
        } finally {
            setLoadingExistingLinks(false);
        }
    }, [baseUrl, presentationId]);

    useEffect(() => {
        if (showShareModal && presentationId) {
            fetchExistingShareLinks();
        } else if (!showShareModal) {
            setSharedLink(null);
            setIsEditingExistingLink(false);
        }
    }, [showShareModal, presentationId, fetchExistingShareLinks]);

    const shareByEmail = async (payload: ShareByEmailPayload): Promise<void> => {
        const response = await fetch(`${baseUrl}/sharing/${presentationId}/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to share presentation' }));
            throw new Error(error.message || 'Failed to share presentation');
        }
    };

    const shareByLink = async (payload: ShareByLinkPayload): Promise<ShareLinkResponse> => {
        const response = await fetch(`${baseUrl}/share-link/presentation/${presentationId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create share link' }));
            throw new Error(error.message || 'Failed to create share link');
        }
        const data = await response.json();
        return {
            ...data.data,
            url: `${window.location.origin}/shared/${data.data.token}`
        };
    };

    const updateShareLink = async (linkId: string, payload: Partial<ShareByLinkPayload>): Promise<ShareLinkResponse> => {
        const response = await fetch(`${baseUrl}/share-link/${linkId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to update share link' }));
            throw new Error(error.message || 'Failed to update share link');
        }
        const data = await response.json();
        return {
            ...data.data,
            url: `${window.location.origin}/shared/${data.data.token}`
        };
    };

    const deleteSharedLink = async (linkId: string): Promise<void> => {
        const response = await fetch(`${baseUrl}/share-link/${linkId}`, {
            method: 'DELETE',
            credentials: "include",
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to delete share link' }));
            throw new Error(error.message || 'Failed to delete share link');
        }
    };

    const updatePresentationVisibility = async (payload: UpdateVisibilityPayload): Promise<void> => {
        const response = await fetch(`${baseUrl}/sharing/${presentationId}/visibility`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to update visibility' }));
            throw new Error(error.message || 'Failed to update visibility');
        }
    };

    const handleOptionClick = (option: string): void => {
        if (option === "Save") {
            if (typeof handleSave === 'function') {
                void (handleSave as () => Promise<void>)();
            }
        }
        if (option === "Share") {
            setShowShareModal(true);
        }
        if (option === "View Collaborators") {
            setShowCollaboratorsModal(true);
        }
        if (option === "Delete") {
            setShowDeleteModal(true);
        }
    };

    const handleShare = async (): Promise<void> => {
        if (shareMethod === 'email') {
            if (!email) return;

            try {
                setShareLoading(true);
                const payload: ShareByEmailPayload = {
                    email,
                    accessLevel
                };
                await shareByEmail(payload);
                setEmail('');
                setShowShareModal(false);
                alert('Invitation sent successfully!');
            } catch (error) {
                console.error('Failed to share by email:', error);
                alert(error instanceof Error ? error.message : 'Failed to send invitation');
            } finally {
                setShareLoading(false);
            }
        } else if (shareMethod === 'link' && !sharedLink) {
            try {
                setShareLoading(true);
                const payload: ShareByLinkPayload = {
                    accessLevel,
                    expiresInDays,
                };

                if (usePassword && password) {
                    payload.password = password;
                }

                if (useMaxViews && maxViews !== '') {
                    payload.maxViews = Number(maxViews);
                }

                const response = await shareByLink(payload);
                setSharedLink(response);
            } catch (error) {
                console.error('Failed to create share link:', error);
                alert(error instanceof Error ? error.message : 'Failed to create share link');
            } finally {
                setShareLoading(false);
            }
        }
    };

    const handleCopyLink = async (): Promise<void> => {
        if (!sharedLink) return;

        try {
            await navigator.clipboard.writeText(sharedLink.url || `${window.location.origin}/shared/${sharedLink.token}`);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
            alert('Failed to copy link to clipboard');
        }
    };

    const handleDeleteLink = async (): Promise<void> => {
        if (!sharedLink) return;

        if (!confirm('Are you sure you want to delete this share link? This will make the existing link invalid.')) {
            return;
        }

        try {
            setShareLoading(true);
            await deleteSharedLink(sharedLink.id);
            setSharedLink(null);
            setIsEditingExistingLink(false);
            setAccessLevel('read');
            setExpiresInDays(7);
            setPassword('');
            setUsePassword(false);
            setMaxViews('');
            setUseMaxViews(false);

            alert('Share link deleted successfully! You can now create a new one.');
        } catch (error) {
            console.error('Failed to delete share link:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete share link');
        } finally {
            setShareLoading(false);
        }
    };

    const handleUpdateLink = async (): Promise<void> => {
        if (!sharedLink) return;

        try {
            setShareLoading(true);
            const payload: Partial<ShareByLinkPayload> = {
                accessLevel,
                expiresInDays,
            };

            if (usePassword && password) {
                payload.password = password;
            } else if (!usePassword) {
                payload.password = undefined;
            }

            if (useMaxViews && maxViews !== '') {
                payload.maxViews = Number(maxViews);
            } else if (!useMaxViews) {
                payload.maxViews = undefined;
            }

            const response = await updateShareLink(sharedLink.id, payload);
            setSharedLink(response);
            setIsEditingExistingLink(false);
            alert('Share link updated successfully!');
        } catch (error) {
            console.error('Failed to update share link:', error);
            alert(error instanceof Error ? error.message : 'Failed to update share link');
        } finally {
            setShareLoading(false);
        }
    };

    const handleToggleVisibility = async (): Promise<void> => {
        try {
            setVisibilityLoading(true);
            await updatePresentationVisibility({ isPublic: !isPublic });
            setIsPublic(!isPublic);
        } catch (error) {
            console.error('Failed to update visibility:', error);
            alert(error instanceof Error ? error.message : 'Failed to update visibility');
        } finally {
            setVisibilityLoading(false);
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (!presentationId) return;

        try {
            setDeleteLoading(true);
            if (typeof (deletePresentation) === 'function') {
                await (deletePresentation as (id: string) => Promise<void>)(presentationId);
                setShowDeleteModal(false);
                router.push('/dashboard/');
            } else {
                console.error('deletePresentation is not a function', deletePresentation);
                alert('Unable to delete presentation');
            }
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete presentation');
        } finally {
            setDeleteLoading(false);
        }
    };

    const resetShareModal = (): void => {
        setShowShareModal(false);
        setShareMethod('email');
        setEmail('');
        setAccessLevel('read');
        setPassword('');
        setExpiresInDays(7);
        setMaxViews('');
        setUsePassword(false);
        setUseMaxViews(false);
        setCopySuccess(false);
        setIsEditingExistingLink(false); 
        setSharedLink(null);
    };
    
    const LinkSettingsForm: React.FC<{isCreating: boolean, linkData?: ShareLinkResponse | null}> = ({ isCreating, linkData }) => {
        const showPasswordField = usePassword || (!isCreating && !!linkData?.password);

        const showMaxViewsField = useMaxViews || (!isCreating && !!linkData?.maxViews);

        return (
            <div className="space-y-4">
                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'oklch(0.45 0.18 300)' }}
                    >
                        Access Level
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAccessLevel('read')}
                            type="button"
                            disabled={shareLoading}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${accessLevel === 'read' ? 'text-white' : ''}`}
                            style={{
                                background: accessLevel === 'read' ? 'oklch(0.65 0.25 330)' : 'transparent',
                                color: accessLevel === 'read' ? 'white' : 'oklch(0.45 0.18 300)',
                                border: '1px solid oklch(0.65 0.25 330 / 0.3)'
                            }}
                        >
                            Read
                        </button>
                        <button
                            onClick={() => setAccessLevel('write')}
                            type="button"
                            disabled={shareLoading}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${accessLevel === 'write' ? 'text-white' : ''}`}
                            style={{
                                background: accessLevel === 'write' ? 'oklch(0.65 0.25 330)' : 'transparent',
                                color: accessLevel === 'write' ? 'white' : 'oklch(0.45 0.18 300)',
                                border: '1px solid oklch(0.65 0.25 330 / 0.3)'
                            }}
                        >
                            Write
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'oklch(0.45 0.18 300)' }}
                    >
                        Expires In (Days)
                    </label>
                    <input
                        aria-label="Expires In Days"
                        type="number"
                        value={expiresInDays}
                        onChange={(e) => setExpiresInDays(Number(e.target.value))}
                        min="1"
                        max="365"
                        disabled={shareLoading}
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

                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={usePassword}
                            onChange={(e) => {
                                setUsePassword(e.target.checked);
                                if (!e.target.checked && isCreating) {
                                    setPassword('');
                                }
                            }}
                            disabled={shareLoading}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: 'oklch(0.65 0.25 330)' }}
                        />
                        <span
                            className="text-sm font-medium"
                            style={{ color: 'oklch(0.45 0.18 300)' }}
                        >
                            Require Password
                        </span>
                    </label>
                    {showPasswordField && (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isCreating ? "Enter password" : "Enter new password (optional)"}
                            disabled={shareLoading}
                            className="w-full px-4 py-3 rounded-lg transition-all outline-none mt-2"
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
                    )}
                </div>

                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useMaxViews}
                            onChange={(e) => {
                                setUseMaxViews(e.target.checked);
                                if (!e.target.checked && isCreating) {
                                    setMaxViews('');
                                }
                            }}
                            disabled={shareLoading}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: 'oklch(0.65 0.25 330)' }}
                        />
                        <span
                            className="text-sm font-medium"
                            style={{ color: 'oklch(0.45 0.18 300)' }}
                        >
                            Limit Views
                        </span>
                    </label>
                    {showMaxViewsField && (
                        <input
                            type="number"
                            value={maxViews}
                            onChange={(e) => setMaxViews(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Maximum views"
                            min="1"
                            disabled={shareLoading}
                            className="w-full px-4 py-3 rounded-lg transition-all outline-none mt-2"
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
                    )}
                </div>
            </div>
        );
    };

    const LinkView: React.FC<{link: ShareLinkResponse}> = ({ link }) => (
        <div className="space-y-4">
            <div
                className="p-4 rounded-lg"
                style={{ background: 'oklch(0.98 0.01 70)' }}
            >
                <p
                    className="text-sm font-medium mb-2"
                    style={{ color: 'oklch(0.45 0.18 300)' }}
                >
                    Share Link
                </p>
                <div className="flex gap-2">
                    <input
                        aria-label="Link url"
                        type="text"
                        value={link.url || `${window.location.origin}/shared/${link.token}`}
                        readOnly
                        className="flex-1 px-3 py-2 rounded-lg text-sm truncate"
                        style={{
                            border: '1px solid oklch(0.65 0.25 330 / 0.3)',
                            background: 'white',
                            color: 'oklch(0.45 0.18 300)'
                        }}
                    />
                    <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center gap-2 whitespace-nowrap"
                        style={{
                            background: copySuccess ? '#10b981' : 'oklch(0.65 0.25 330)'
                        }}
                    >
                        <FiCopy size={16} />
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            <div
                className="p-4 rounded-lg space-y-2 text-sm"
                style={{ background: 'oklch(0.98 0.01 70)', color: 'oklch(0.45 0.18 300)' }}
            >
                <div className="flex justify-between">
                    <span className="font-medium">Access Level:</span>
                    <span className="capitalize">{link.accessLevel}</span>
                </div>
                {link.expiresAt && (
                    <div className="flex justify-between">
                        <span className="font-medium">Expires:</span>
                        <span>{new Date(link.expiresAt).toLocaleDateString()}</span>
                    </div>
                )}
                {(link.maxViews !== null && link.maxViews !== undefined) && (
                    <div className="flex justify-between">
                        <span className="font-medium">Views:</span>
                        <span>{link.currentViews} / {link.maxViews}</span>
                    </div>
                )}
                {link.password && (
                    <div className="flex justify-between">
                        <span className="font-medium">Password Protected:</span>
                        <span>Yes</span>
                    </div>
                )}
            </div>
            
            <div className="flex gap-2 pt-4 border-t" style={{ borderColor: 'oklch(0.65 0.25 330 / 0.2)' }}>
                 <button
                    onClick={() => setIsEditingExistingLink(true)}
                    className="flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                        border: '1px solid oklch(0.65 0.25 330 / 0.3)',
                        color: 'oklch(0.45 0.18 300)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiEdit2 size={16} />
                    Edit Settings
                </button>
                <button
                    onClick={handleDeleteLink}
                    disabled={shareLoading}
                    className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                    style={{ background: '#dc2626' }}
                    onMouseEnter={(e) => !shareLoading && (e.currentTarget.style.background = '#b91c1c')}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                    Delete Link
                </button>
            </div>
        </div>
    );

    const LinkEditForm: React.FC<{link: ShareLinkResponse | null}> = ({ link }) => (
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'oklch(0.65 0.25 330 / 0.2)' }}>
            <h4
                className="text-sm font-semibold"
                style={{ color: 'oklch(0.45 0.18 300)' }}
            >
                {link ? 'Update Link Settings' : 'Create New Link'}
            </h4>
            
            <LinkSettingsForm isCreating={!link} linkData={link} />

            <div className="flex gap-3">
                <button
                    onClick={() => setIsEditingExistingLink(false)}
                    disabled={shareLoading}
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
                    onClick={link ? handleUpdateLink : handleShare}
                    disabled={shareLoading || (usePassword && !password)}
                    className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                    style={{ background: 'oklch(0.65 0.25 330)' }}
                    onMouseEnter={(e) => !shareLoading && (e.currentTarget.style.background = 'oklch(0.60 0.25 330)')}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330)'}
                >
                    {shareLoading ? 'Processing...' : (link ? 'Update Link' : 'Create Link')}
                </button>
            </div>
        </div>
    );
    
    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleOptionClick('Save')}
                    disabled={isSaving}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all hover:bg-opacity-10 disabled:opacity-50"
                    style={{ color: 'oklch(0.65 0.25 330)' }}
                    title={isSaving ? "Saving..." : lastSaved ? `Last saved: ${(lastSaved as Date).toLocaleTimeString()}` : "Save"}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiSave size={20} />
                </button>

                <button
                    onClick={() => handleOptionClick('Share')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                    style={{ color: 'oklch(0.65 0.25 330)' }}
                    title="Share"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiUserPlus size={20} />
                </button>

                <button
                    onClick={() => handleOptionClick('View Collaborators')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                    style={{ color: 'oklch(0.65 0.25 330)' }}
                    title="View Collaborators"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiUsers size={20} />
                </button>

                <div
                    className="w-px h-6 mx-1"
                    style={{ background: 'oklch(0.65 0.25 330 / 0.2)' }}
                />

                <button
                    onClick={() => handleOptionClick('Delete')}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                    style={{ color: '#dc2626' }}
                    title="Delete"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FiTrash2 size={20} />
                </button>
            </div>

            {showShareModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={resetShareModal}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
                        style={{ border: '1px solid oklch(0.65 0.25 330 / 0.2)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3
                                className="text-xl font-semibold"
                                style={{ color: 'oklch(0.45 0.18 300)' }}
                            >
                                Share Project
                            </h3>
                            <button
                                aria-label='Close modal'
                                onClick={resetShareModal}
                                className="p-1 rounded-lg transition-all"
                                onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330 / 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <FiX size={20} style={{ color: 'oklch(0.45 0.18 300)' }} />
                            </button>
                        </div>

                        {loadingExistingLinks ? (
                            <div className="flex items-center justify-center py-12">
                                <div 
                                    className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                                    style={{ borderColor: 'oklch(0.65 0.25 330)', borderTopColor: 'transparent', borderWidth: '3px' }}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2 mb-6">
                                    <button
                                        onClick={() => setShareMethod('email')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all"
                                        style={{
                                            background: shareMethod === 'email' ? 'oklch(0.65 0.25 330)' : 'transparent',
                                            color: shareMethod === 'email' ? 'white' : 'oklch(0.45 0.18 300)',
                                            border: shareMethod === 'email' ? 'none' : '1px solid oklch(0.65 0.25 330 / 0.3)'
                                        }}
                                    >
                                        <FiMail size={18} />
                                        Email
                                    </button>
                                    <button
                                        onClick={() => setShareMethod('link')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all"
                                        style={{
                                            background: shareMethod === 'link' ? 'oklch(0.65 0.25 330)' : 'transparent',
                                            color: shareMethod === 'link' ? 'white' : 'oklch(0.45 0.18 300)',
                                            border: shareMethod === 'link' ? 'none' : '1px solid oklch(0.65 0.25 330 / 0.3)'
                                        }}
                                    >
                                        <FiLink size={18} />
                                        Link
                                    </button>
                                </div>

                                <div
                                    className="mb-6 p-4 rounded-lg"
                                    style={{ background: 'oklch(0.98 0.01 70)' }}
                                >
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span
                                                className="font-medium block mb-1"
                                                style={{ color: 'oklch(0.45 0.18 300)' }}
                                            >
                                                Make Public
                                            </span>
                                            <span
                                                className="text-sm"
                                                style={{ color: 'oklch(0.45 0.18 300 / 0.6)' }}
                                            >
                                                Anyone with the link can view
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={isPublic}
                                                onChange={handleToggleVisibility}
                                                disabled={visibilityLoading}
                                                className="sr-only peer"
                                            />
                                            <div
                                                className="w-11 h-6 rounded-full peer transition-all cursor-pointer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-disabled:opacity-50"
                                                style={{
                                                    background: isPublic ? 'oklch(0.65 0.25 330)' : 'oklch(0.65 0.25 330 / 0.3)'
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                                {shareMethod === 'email' && (
                                    <>
                                        <div className="space-y-4">
                                            <div>
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
                                                    disabled={shareLoading}
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

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: 'oklch(0.45 0.18 300)' }}
                                                >
                                                    Access Level
                                                </label>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setAccessLevel('read')}
                                                        type="button"
                                                        disabled={shareLoading}
                                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${accessLevel === 'read' ? 'text-white' : ''}`}
                                                        style={{
                                                            background: accessLevel === 'read' ? 'oklch(0.65 0.25 330)' : 'transparent',
                                                            color: accessLevel === 'read' ? 'white' : 'oklch(0.45 0.18 300)',
                                                            border: '1px solid oklch(0.65 0.25 330 / 0.3)'
                                                        }}
                                                    >
                                                        Read
                                                    </button>
                                                    <button
                                                        onClick={() => setAccessLevel('write')}
                                                        type="button"
                                                        disabled={shareLoading}
                                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${accessLevel === 'write' ? 'text-white' : ''}`}
                                                        style={{
                                                            background: accessLevel === 'write' ? 'oklch(0.65 0.25 330)' : 'transparent',
                                                            color: accessLevel === 'write' ? 'white' : 'oklch(0.45 0.18 300)',
                                                            border: '1px solid oklch(0.65 0.25 330 / 0.3)'
                                                        }}
                                                    >
                                                        Write
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={resetShareModal}
                                                disabled={shareLoading}
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
                                                onClick={handleShare}
                                                disabled={shareLoading || !email}
                                                className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                                                style={{ background: 'oklch(0.65 0.25 330)' }}
                                                onMouseEnter={(e) => !shareLoading && (e.currentTarget.style.background = 'oklch(0.60 0.25 330)')}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330)'}
                                            >
                                                {shareLoading ? 'Sending...' : 'Send Invite'}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {shareMethod === 'link' && (
                                    <>
                                        {sharedLink && !isEditingExistingLink ? (
                                            <LinkView link={sharedLink} />
                                        ) : sharedLink && isEditingExistingLink ? (
                                            <LinkEditForm link={sharedLink} />
                                        ) : (
                                            <>
                                                <LinkSettingsForm isCreating={true} />
                                                <div className="flex gap-3 mt-6">
                                                    <button
                                                        onClick={resetShareModal}
                                                        disabled={shareLoading}
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
                                                        onClick={handleShare}
                                                        disabled={shareLoading || (usePassword && !password)}
                                                        className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                                                        style={{ background: 'oklch(0.65 0.25 330)' }}
                                                        onMouseEnter={(e) => !shareLoading && (e.currentTarget.style.background = 'oklch(0.60 0.25 330)')}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'oklch(0.65 0.25 330)'}
                                                    >
                                                        {shareLoading ? 'Creating...' : 'Create Link'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                        style={{ border: '1px solid rgba(220, 38, 38, 0.2)' }}
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
                                aria-label='Close delete modal'
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
                                disabled={deleteLoading}
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
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                                style={{ background: '#dc2626' }}
                                onMouseEnter={(e) => !deleteLoading && (e.currentTarget.style.background = '#b91c1c')}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CollaboratorsModal
                presentationId={presentationId}
                isOpen={showCollaboratorsModal}
                onClose={() => setShowCollaboratorsModal(false)}
            />
        </>
    );
};

export default ActionIconsBar;