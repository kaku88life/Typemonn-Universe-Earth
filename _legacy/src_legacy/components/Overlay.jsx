import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Overlay({ selectedWork, onDeselect }) {
    return (
        <>
            <div style={{ position: 'fixed', top: '30px', left: '40px', zIndex: 10, pointerEvents: 'none' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', margin: 0, letterSpacing: '-1px' }}>
                    TYPE-MOON UNIVERSE
                </h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 4px', fontSize: '1.1rem' }}>
                    Chronological World Guide
                </p>
            </div>

            <AnimatePresence>
                {selectedWork && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        style={{
                            position: 'fixed',
                            top: '120px',
                            right: '40px',
                            width: '350px',
                            zIndex: 10
                        }}
                    >
                        <div className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
                            <button
                                onClick={onDeselect}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    opacity: 0.7
                                }}
                            >
                                ×
                            </button>

                            <div style={{
                                fontSize: '4rem',
                                color: selectedWork.color,
                                opacity: 0.1,
                                position: 'absolute',
                                top: '10px',
                                right: '20px',
                                fontWeight: 900,
                                zIndex: -1
                            }}>
                                {selectedWork.year}
                            </div>

                            <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', borderBottom: `2px solid ${selectedWork.color}`, paddingBottom: '10px' }}>
                                {selectedWork.title}
                            </h2>

                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: selectedWork.color }}>📍</span>
                                <span style={{ fontWeight: 600 }}>{selectedWork.location.name}</span>
                            </div>

                            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                                {selectedWork.description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
