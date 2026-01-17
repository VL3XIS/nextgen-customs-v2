// ... imports ...
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, BarChart2, Settings, LogOut, Menu, X, Briefcase, User as UserIcon } from 'lucide-react';
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
        <div className="min-h-screen flex relative">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar with Glass Effect */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-brand-obsidian/90 backdrop-blur-xl border-r border-white/5 text-white transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden h-32">
                    <div className="flex flex-col items-center z-10">
                        {/* Shield Logo Approximation */}
                        <div className="relative mb-2">
                            <div className="w-12 h-14 bg-gradient-to-br from-red-600 to-black rounded-b-full border-2 border-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                <span className="font-display font-bold text-2xl text-white italic">NC</span>
                            </div>
                        </div>
                        <div className="text-center leading-none">
                            <span className="block font-display font-bold text-2xl tracking-widest text-white neon-text">NEXTGEN</span>
                            <span className="block font-sans text-[10px] text-red-500 tracking-[0.4em] font-bold mt-1">CUSTOMS</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-red-900/80 to-red-600/20 text-white border-l-4 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className={cn(
                                    "h-5 w-5 relative z-10 transition-transform duration-300",
                                    isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                                )} />
                                <span className={cn(
                                    "font-medium tracking-wide relative z-10 text-sm",
                                    isActive && "font-bold"
                                )}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5 bg-black/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-xl transition-all duration-300 group"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Carbon Fiber BG */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 carbon-bg">
                {/* Glass Header */}
                <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 bg-brand-black/50 backdrop-blur-md border-b border-white/5">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Page Title / Breadcrumb (Optional) */}
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-display font-bold text-white tracking-wide">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Portal'}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6 ml-auto">
                        <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <p className="text-xs text-brand-red">Master Access</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-brand-neon hover:border-brand-neon/50 transition-colors shadow-lg shadow-black/50 cursor-pointer">
                                <UserIcon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
