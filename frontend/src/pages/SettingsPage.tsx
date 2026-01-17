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
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-8 font-rajdhani uppercase tracking-wide">
                Settings <span className="text-brand-red">.</span>
            </h1>

            {toast && (
                <div className="fixed top-4 right-4 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg shadow-lg animate-fade-in backdrop-blur-md">
                    {toast}
                </div>
            )}

            <div className="glass-panel-neon p-8 rounded-2xl border border-brand-red/20 space-y-8">
                <section>
                    <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2 font-rajdhani uppercase tracking-wide">Shop Profile</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Shop Name</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="w-full px-4 py-3 input-neon"
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
                    <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2 font-rajdhani uppercase tracking-wide">Security</h2>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Current Password</label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full px-4 py-3 input-neon"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full px-4 py-3 input-neon"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full px-4 py-3 input-neon"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-brand-red hover:bg-brand-neon text-white px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(255,42,60,0.3)] hover:shadow-[0_0_25px_rgba(255,42,60,0.5)] transition-all font-bold tracking-wide">
                                Change Password
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
