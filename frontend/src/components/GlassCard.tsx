import { cn } from '../utils/cn';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    neonBorder?: boolean;
    hoverEffect?: boolean;
}

export const GlassCard = ({
    children,
    className,
    neonBorder = false,
    hoverEffect = false
}: GlassCardProps) => {
    return (
        <div className={cn(
            // Base "Liquid Glass" Style
            "glass-panel rounded-2xl relative overflow-hidden",

            // Optional Neon Border
            neonBorder && "neon-border",

            // Optional Hover Effects
            hoverEffect && "glass-panel-hover neon-border-hover cursor-pointer",

            className
        )}>
            {/* Inner Glow Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
