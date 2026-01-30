import React from 'react';
import { motion } from 'framer-motion';

export default function Timeline({ works, selectedWork, onSelectWork }) {
    // Sort works by year
    const sortedWorks = [...works].sort((a, b) => a.year - b.year);

    return (
        <div style={{
            position: 'fixed',
            bottom: '40px',
            left: 0,
            width: '100%',
            zIndex: 10,
            padding: '0 20px',
            boxSizing: 'border-box'
        }}>
            <div className="glass-panel" style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '20px',
                gap: '24px',
                maxWidth: '1200px',
                margin: '0 auto',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none',  /* IE 10+ */
            }}>
                {sortedWorks.map((work) => {
                    const isSelected = selectedWork?.id === work.id;
                    return (
                        <motion.div
                            key={work.id}
                            onClick={() => onSelectWork(work)}
                            style={{
                                minWidth: '200px',
                                padding: '16px',
                                borderRadius: '12px',
                                background: isSelected ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${isSelected ? work.color : 'rgba(255, 255, 255, 0.1)'}`,
                                cursor: 'pointer',
                                flexShrink: 0,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: work.color
                            }} />

                            <div style={{ marginLeft: '12px' }}>
                                <div style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '4px' }}>{work.year}</div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? '#fff' : '#e0e0e0', marginBottom: '6px' }}>
                                    {work.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#aaa', lineHeight: 1.4 }}>
                                    {work.location.name}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
