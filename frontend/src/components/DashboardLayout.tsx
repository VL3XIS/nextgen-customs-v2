import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, BarChart2, Settings, LogOut, Menu, X, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Briefcase, label: 'Jobs', path: '/dashboard/jobs' },
        { icon: PlusCircle, label: 'New Job', path: '/dashboard/new-job' },
        { icon: History, label: 'Job History', path: '/dashboard/history' },
        { icon: BarChart2, label: 'Analytics', path: '/dashboard/analytics' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-black text-white transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold tracking-wider">NEXT GEN</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-brand-red text-white shadow-lg shadow-red-900/20"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-600"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        <div className="h-8 w-8 rounded-full bg-brand-red flex items-center justify-center text-white font-bold">
                            U
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
