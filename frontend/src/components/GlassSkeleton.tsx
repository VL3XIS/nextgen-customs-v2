import { cn } from '../utils/cn';

interface GlassSkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
}

export function GlassSkeleton({ className, width, height }: GlassSkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-white/5 rounded-xl border border-white/5 relative overflow-hidden",
                className
            )}
            style={{ width, height }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <GlassSkeleton className="h-8 w-48" />
                    <GlassSkeleton className="h-4 w-32" />
                </div>
                <GlassSkeleton className="h-10 w-40" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <GlassSkeleton key={i} className="h-36" />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassSkeleton className="h-80 lg:col-span-2" />
                <GlassSkeleton className="h-80" />
            </div>
        </div>
    );
}
