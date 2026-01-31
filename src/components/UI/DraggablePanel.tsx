'use client';

import React, { useState } from 'react';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';
import HolographicPanel from './HolographicPanel';

interface DraggablePanelProps {
    id: string;
    title?: string;
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
    className?: string;
}

function DraggableItem({ id, title, children, defaultPosition, className }: DraggablePanelProps) {
    // Local state for free movement without snap-to-grid usually
    // But @dnd-kit is controlled. We need to store coordinates.
    const [coordinates, setCoordinates] = useState(defaultPosition || { x: 0, y: 0 });

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    // Combine local coordinates with active drag transform
    const style = {
        transform: CSS.Translate.toString(transform ? {
            x: coordinates.x + transform.x,
            y: coordinates.y + transform.y,
            scaleX: 1,
            scaleY: 1
        } : {
            x: coordinates.x,
            y: coordinates.y,
            scaleX: 1,
            scaleY: 1
        }),
        position: 'absolute' as const, // Absolute positioning for free movement
        zIndex: 50,
        touchAction: 'none',
    };

    // We only attach listeners to the handle
    return (
        <div ref={setNodeRef} style={style} className={className}>
            <HolographicPanel className="pointer-events-auto">
                {/* Drag Handle */}
                <div
                    {...listeners}
                    {...attributes}
                    className="flex items-center justify-center p-1 cursor-grab active:cursor-grabbing border-b border-cyan-500/30 hover:bg-cyan-900/40 transition-colors"
                >
                    <GripHorizontal className="w-4 h-4 text-cyan-500/50" />
                    {title && <span className="ml-2 text-[10px] text-cyan-400 font-mono uppercase">{title}</span>}
                </div>

                {/* Content */}
                <div className="cursor-default">
                    {children}
                </div>
            </HolographicPanel>
        </div>
    );
}

// Wrapper to provide Context if used in isolation, but typically we want one context for the page.
// However, simple independent items can manage their own state if we update it on onDragEnd.
// To keep it simple, we'll export the Item and a Controller, or just the component if we assume Parent handles Context?
// No, let's make it self-contained if possible, OR expect Page to wrap.
// Actually, multiple DndContexts can exist if they don't overlap keys.
// Let's implement a self-contained wrapper that assumes it handles its own drag end for updating its OWN position key?
// No, DndContext needs to wrap the draggable.

export default function DraggablePanel(props: DraggablePanelProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        })
    );

    // We need state LIFTED purely if we want to save it, but local state fine for "session"
    // To make it truly movable, we need to handle onDragEnd to update the base coordinates.

    // BUT: DndContext wraps the interaction.
    // If we have multiple panels, we can wrap ALL of them in one Context in Page.
    // Let's create a specialized component that handles the logic *assuming* it is inside a context, OR
    // handle the context internally if it's an isolated island. 

    // Simplest for now: Isolate state management inside this component?
    // Not possible because DndContext needs to cover the area they move IN? 
    // No, DndContext just needs to wrap the draggable and droppable nodes. 
    // Since there are no droppables (free movement), we just need to detect drag end.

    const [coordinates, setCoordinates] = useState(props.defaultPosition || { x: 0, y: 0 });
    const panelRef = React.useRef<HTMLDivElement>(null);

    // Responsive: Handle Window Resize
    React.useEffect(() => {
        const handleResize = () => {
            setCoordinates((prev) => {
                let newX = prev.x;
                let newY = prev.y;

                // Simple boundary check (Keep fully on screen if possible, or at least top-left visible)
                // We need the element size, but here we just ensure it doesn't go off the right/bottom too far
                // Assuming standard panel width ~200-600px
                const maxX = window.innerWidth - 50; // Keep at least 50px visible
                const maxY = window.innerHeight - 50;

                if (newX > maxX) newX = maxX - 100; // Nudge back
                if (newY > maxY) newY = maxY - 100;

                // Check left/top
                if (newX < 0) newX = 20;
                if (newY < 0) newY = 20;

                return { x: newX, y: newY };
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { delta } = event;
        setCoordinates((prev) => ({
            x: prev.x + delta.x,
            y: prev.y + delta.y,
        }));
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <DraggableContent panelRef={panelRef} coordinates={coordinates} {...props} />
        </DndContext>
    );
}

// Inner component to consume the draggable hook
function DraggableContent({ coordinates, id, title, children, className, panelRef }: DraggablePanelProps & { coordinates: { x: number, y: number }, panelRef?: React.RefObject<HTMLDivElement | null> }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const style = {
        transform: CSS.Translate.toString(transform ? {
            x: coordinates.x + transform.x,
            y: coordinates.y + transform.y,
            scaleX: 1,
            scaleY: 1
        } : {
            x: coordinates.x,
            y: coordinates.y,
            scaleX: 1,
            scaleY: 1
        }),
        position: 'fixed' as const, // Fixed to screen
        zIndex: 60, // Above normal UI
        touchAction: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} className={className}>
            <div className="backdrop-blur-md bg-black/80 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                {/* Drag Handle Area */}
                <div
                    {...listeners}
                    {...attributes}
                    className="flex items-center justify-between px-3 py-1 cursor-grab active:cursor-grabbing bg-cyan-950/30 border-b border-cyan-500/20 hover:bg-cyan-900/40 transition-colors group"
                >
                    <div className="flex items-center gap-2">
                        <GripHorizontal className="w-3 h-3 text-cyan-500/50 group-hover:text-cyan-400" />
                        {title && <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase select-none">{title}</span>}
                    </div>
                </div>

                <div className="p-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
