import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Loader2, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await apiService.login({ email, password });
            login(res.data.token, res.data.admin);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

            <div className="max-w-md w-full relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-indigo-500/10">
                    <div className="p-10">
                        <div className="flex justify-center mb-10">
                            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-xl shadow-indigo-500/20 transform group-hover:rotate-6 transition-transform">
                                <Truck className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Admin Portal</h1>
                            <p className="text-slate-400 font-medium">Log in to manage your fleet operations</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-[#0f172a]/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:bg-[#0f172a] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300 ml-1">
                                    Password
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-[#0f172a]/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:bg-[#0f172a] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:translate-y-[-2px] active:translate-y-[0px] transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <Truck className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="p-6 bg-[#0f172a]/50 border-t border-white/5 text-center">
                        <p className="text-sm text-slate-500">
                            Forgot your password? <a href="#" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Contact Superadmin</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
