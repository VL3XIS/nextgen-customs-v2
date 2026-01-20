import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen carbon-bg flex items-center justify-center p-4">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-brand-red/30">
                <div className="flex justify-center mb-6">
                    <img
                        src="/nextgen-logo-premium.png"
                        alt="Next Gen Customs"
                        className="w-full h-auto max-w-[320px] object-contain filter drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    />
                </div>
                <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-wider font-rajdhani">Sign in to your dashboard</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-red hover:bg-brand-red/80 text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] border border-brand-red/50 font-rajdhani uppercase tracking-wider"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand-red hover:text-brand-neon font-medium transition-colors">
                        Sign up
                    </Link>
                </div>


            </div>
        </div>
    );
}
