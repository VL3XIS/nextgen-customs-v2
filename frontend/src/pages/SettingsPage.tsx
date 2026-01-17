import { useState } from 'react';
import api from '../services/api';
import type { User } from '../types';

interface UserWithShop extends User {
    shopName?: string;
}

export default function SettingsPage() {
    const [user] = useState<UserWithShop>(JSON.parse(localStorage.getItem('user') || '{}'));
    const [shopName, setShopName] = useState(user.shopName || '');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [toast, setToast] = useState('');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.put('/user/profile', { shopName });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setToast('Profile updated!');
            setTimeout(() => setToast(''), 3000);
        } catch (error: unknown) {
            console.error('Update profile error:', error);
            alert('Failed to update profile');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return alert("Passwords don't match");
        try {
            await api.put('/user/password', { currentPassword: passwords.current, newPassword: passwords.new });
            setToast('Password changed!');
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setToast(''), 3000);
        } catch (error: unknown) {
            console.error('Change password error:', error);
            alert('Failed to change password');
        }
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8 font-rajdhani uppercase tracking-wider">
                SETTINGS
            </h1>

            {toast && (
                <div className="fixed top-4 right-4 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg shadow-lg animate-fade-in backdrop-blur-md">
                    {toast}
                </div>
            )}

            <div className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-8 space-y-10">
                <section>
                    <h2 className="text-sm font-bold text-white mb-6 border-b border-brand-red/20 pb-3 font-rajdhani uppercase tracking-wider">SHOP PROFILE</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">CUSTOMER NAME</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                placeholder="Next Gen Customs"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg border border-white/10 transition-colors font-medium">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-white mb-6 border-b border-brand-red/20 pb-3 font-rajdhani uppercase tracking-wider">CHANGE PASSWORD</h2>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">CURRENT PASSWORD</label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">NEW PASSWORD</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-brand-red hover:bg-brand-red/80 text-white px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all font-bold tracking-wide border border-brand-red/50 font-rajdhani uppercase">
                                Change Password
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
