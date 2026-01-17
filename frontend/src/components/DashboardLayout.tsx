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
                <div className="p-8 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-neon to-transparent opacity-50" />

                    <div className="flex items-center space-x-3 z-10">
                        {/* Simple Logo Placeholder until image load */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red to-brand-black flex items-center justify-center border border-white/10 shadow-lg shadow-brand-red/20">
                            <span className="font-display font-bold text-xl italic text-white">N</span>
                        </div>
                        <div>
                            <span className="block font-display font-bold text-xl tracking-wider text-white">NEXTGEN</span>
                            <span className="block text-xs text-brand-red tracking-[0.2em] font-medium scale-90 origin-left">CUSTOMS</span>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-brand-red/10 text-white border-l-2 border-brand-neon"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-transparent opacity-100" />
                                )}
                                <Icon className={cn(
                                    "h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-brand-neon drop-shadow-[0_0_8px_rgba(255,42,60,0.5)]" : "text-gray-400 group-hover:text-white"
                                )} />
                                <span className={cn(
                                    "font-medium tracking-wide relative z-10",
                                    isActive && "text-shadow-sm"
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

            {/* Main Content Area - Transparent to show Carbon Fiber */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
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
