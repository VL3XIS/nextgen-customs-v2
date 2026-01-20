import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Menu, User as UserIcon } from 'lucide-react';
import Sidebar from './Sidebar';
// import VoiceWidget from './VoiceWidget';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Map paths to readable titles
    const getPageTitle = (path: string) => {
        if (path.includes('/dashboard/jobs')) return 'Active Jobs';
        if (path.includes('/dashboard/new-job')) return 'Job Intake';
        if (path.includes('/dashboard/schedule')) return 'Bay Schedule';
        if (path.includes('/dashboard/social-studio')) return 'Social Studio';
        if (path.includes('/dashboard/history')) return 'Job History';
        if (path.includes('/dashboard/analytics')) return 'Analytics';
        if (path.includes('/dashboard/settings')) return 'Settings';
        return 'Command Center';
    };

    return (
        <div className="min-h-screen flex relative">
            <Toaster position="top-right" theme="dark" closeButton richColors />

            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

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

                    {/* Page Title */}
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-display font-bold text-white tracking-wide uppercase">
                            {getPageTitle(location.pathname)}
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
                {/* <VoiceWidget /> */}
            </div>
        </div>
    );
}
