"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Plus, Filter, Trash2, Edit2, LogOut, User as UserIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

interface Issue {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
    user?: { name: string; email: string };
}

interface User {
    id: string;
    name: string;
    email: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [filterType, setFilterType] = useState<string>("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = apiClient.getToken();
        if (!token) {
            router.push("/login");
            return;
        }

        fetchUserData();
        fetchIssues();
    }, []);

    useEffect(() => {
        if (filterType === "all") {
            setFilteredIssues(issues);
        } else {
            setFilteredIssues(issues.filter(issue => issue.type === filterType));
        }
    }, [filterType, issues]);

    const fetchUserData = async () => {
        try {
            const response = await apiClient.getMe();
            if (response.success && response.data) {
                setUser(response.data as User);
            }
        } catch (err) {
            console.error(err);
            router.push("/login");
        }
    };

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getIssues();
            if (response.success && response.data) {
                setIssues(response.data as Issue[]);
                setFilteredIssues(response.data as Issue[]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        apiClient.removeToken();
        router.push("/login");
    };

    const handleDeleteIssue = async (id: string) => {
        if (!confirm("Are you sure you want to delete this issue?")) return;

        try {
            await apiClient.deleteIssue(id);
            fetchIssues();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-8 h-8 text-purple-400" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ApniSec
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                            >
                                <UserIcon className="w-5 h-5 text-purple-400" />
                                <span className="text-white text-sm">{user?.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-400">Manage your security issues and track their progress</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                        <div className="text-gray-400 text-sm mb-2">Total Issues</div>
                        <div className="text-3xl font-bold text-white">{issues.length}</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                        <div className="text-gray-400 text-sm mb-2">Open</div>
                        <div className="text-3xl font-bold text-green-400">
                            {issues.filter(i => i.status === "OPEN").length}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-yellow-500/20 p-6">
                        <div className="text-gray-400 text-sm mb-2">In Progress</div>
                        <div className="text-3xl font-bold text-yellow-400">
                            {issues.filter(i => i.status === "IN_PROGRESS").length}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6">
                        <div className="text-gray-400 text-sm mb-2">Resolved</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {issues.filter(i => i.status === "RESOLVED").length}
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                        >
                            <option value="all">All Issues</option>
                            <option value="CLOUD_SECURITY">Cloud Security</option>
                            <option value="REDTEAM_ASSESSMENT">Redteam Assessment</option>
                            <option value="VAPT">VAPT</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Issue</span>
                    </button>
                </div>

                {/* Issues List */}
                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading...</div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                ) : filteredIssues.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        No issues found. Create your first security issue!
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredIssues.map((issue) => (
                            <IssueCard
                                key={issue.id}
                                issue={issue}
                                onDelete={handleDeleteIssue}
                                onUpdate={fetchIssues}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Issue Modal */}
            {showCreateModal && (
                <CreateIssueModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchIssues();
                    }}
                />
            )}
        </div>
    );
}

function IssueCard({ issue, onDelete, onUpdate }: { issue: Issue; onDelete: (id: string) => void; onUpdate: () => void }) {
    const [showEdit, setShowEdit] = useState(false);

    const typeColors: Record<string, string> = {
        CLOUD_SECURITY: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
        REDTEAM_ASSESSMENT: "from-red-500/20 to-orange-500/20 border-red-500/30",
        VAPT: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    };

    const priorityColors: Record<string, string> = {
        LOW: "bg-green-500/20 text-green-400 border-green-500/30",
        MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const statusColors: Record<string, string> = {
        OPEN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        IN_PROGRESS: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        RESOLVED: "bg-green-500/20 text-green-400 border-green-500/30",
        CLOSED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
        <>
            <div className={`bg-gradient-to-r ${typeColors[issue.type]} backdrop-blur-xl rounded-xl border p-6`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-semibold text-purple-400">
                                {issue.type.replace("_", " ")}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded border ${priorityColors[issue.priority]}`}>
                                {issue.priority}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded border ${statusColors[issue.status]}`}>
                                {issue.status.replace("_", " ")}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{issue.title}</h3>
                        <p className="text-gray-300 text-sm">{issue.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowEdit(true)}
                            className="p-2 bg-slate-800/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                        >
                            <Edit2 className="w-4 h-4 text-purple-400" />
                        </button>
                        <button
                            onClick={() => onDelete(issue.id)}
                            className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>

                <div className="text-xs text-gray-500">
                    Created {new Date(issue.createdAt).toLocaleDateString()}
                </div>
            </div>

            {showEdit && (
                <EditIssueModal
                    issue={issue}
                    onClose={() => setShowEdit(false)}
                    onSuccess={() => {
                        setShowEdit(false);
                        onUpdate();
                    }}
                />
            )}
        </>
    );
}

function CreateIssueModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        type: "CLOUD_SECURITY",
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "OPEN",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await apiClient.createIssue(formData);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Issue</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Issue Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                        >
                            <option value="CLOUD_SECURITY">Cloud Security</option>
                            <option value="REDTEAM_ASSESSMENT">Redteam Assessment</option>
                            <option value="VAPT">VAPT</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                            placeholder="Brief summary of the issue"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                            placeholder="Detailed description of the security issue"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-700/50 text-white rounded-lg font-semibold hover:bg-slate-600/50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditIssueModal({ issue, onClose, onSuccess }: { issue: Issue; onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await apiClient.updateIssue(issue.id, formData);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Issue</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-700/50 text-white rounded-lg font-semibold hover:bg-slate-600/50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
