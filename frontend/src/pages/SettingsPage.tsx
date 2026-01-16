import { useState } from 'react';
import api from '../services/api';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
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
        } catch (error) {
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
        } catch (error) {
            alert('Failed to change password');
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

            {toast && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
                    {toast}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Shop Profile</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-brand-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Security</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-brand-darkRed transition-colors shadow-md">
                                Change Password
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
