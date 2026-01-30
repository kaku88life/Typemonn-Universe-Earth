import clsx from 'clsx';
import { ReactNode } from 'react';

interface HolographicPanelProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export default function HolographicPanel({ children, className, title }: HolographicPanelProps) {
    return (
        <div className={clsx(
            "backdrop-blur-md bg-black/60 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.1)] text-cyan-50",
            "transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
            className
        )}>
            {title && (
                <div className="border-b border-cyan-500/30 px-4 py-2 bg-cyan-900/20 rounded-t-xl">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-cyan-400">{title}</h3>
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}
