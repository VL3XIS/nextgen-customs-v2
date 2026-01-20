import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, BarChart2, Settings, LogOut, Briefcase, Share2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';

interface SidebarProps {
    isOpen: boolean; // Mobile toggle
    setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Briefcase, label: 'Jobs', path: '/dashboard/jobs' },
        { icon: PlusCircle, label: 'Job Intake', path: '/dashboard/new-job' },
        { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule' },
        { icon: Share2, label: 'Social Studio', path: '/dashboard/social-studio' },
        { icon: History, label: 'Job History', path: '/dashboard/history' },
        { icon: BarChart2, label: 'Analytics', path: '/dashboard/analytics' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 bg-black/60 backdrop-blur-xl border-r border-white/5 text-white transform transition-all duration-300 ease-in-out lg:transform-none flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.4)]",
                isOpen ? "translate-x-0" : "-translate-x-full",
                collapsed ? "w-20" : "w-72"
            )}>
                {/* Logo Section */}
                <div className={cn(
                    "p-6 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden bg-white/[0.02]",
                    collapsed ? "p-2" : "p-6"
                )}>
                    <div className="flex flex-col items-center z-10 w-full transition-all duration-300">
                        {collapsed ? (
                            <div className="h-10 w-10 bg-brand-red rounded-lg flex items-center justify-center font-bold text-xl">N</div>
                        ) : (
                            <img
                                src="/nextgen-logo-premium.png"
                                alt="Next Gen Customs"
                                className="w-full h-auto max-w-[220px] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            />
                        )}
                    </div>
                </div>

                {/* Collapse Toggle (Desktop Only) */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-3 top-24 bg-brand-red text-white p-1 rounded-full shadow-lg border border-white/20 hover:scale-110 transition-transform z-50"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center space-x-4 px-4 py-3.5 rounded-r-xl rounded-l-md transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-red-600/20 to-transparent text-white border-l-4 border-red-600 shadow-[inset_10px_0_20px_-10px_rgba(220,38,38,0.3)]"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent",
                                    collapsed ? "justify-center px-2" : ""
                                )}
                                onClick={() => setIsOpen(false)}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className={cn(
                                    "h-5 w-5 relative z-10 transition-transform duration-300 flex-shrink-0",
                                    isActive ? "text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "group-hover:text-white group-hover:scale-110"
                                )} />

                                {!collapsed && (
                                    <span className={cn(
                                        "font-rajdhani font-medium tracking-wide relative z-10 text-[15px] uppercase whitespace-nowrap opacity-100 transition-opacity duration-300",
                                        isActive ? "text-white neon-text-glow" : "group-hover:text-white"
                                    )}>{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Footer */}
                <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-lg">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center space-x-3 px-4 py-3 w-full text-left text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/20",
                            collapsed ? "justify-center px-2" : ""
                        )}
                        title={collapsed ? "Logout" : undefined}
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                        {!collapsed && (
                            <span className="font-rajdhani font-bold uppercase tracking-wider text-sm whitespace-nowrap">Logout</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
