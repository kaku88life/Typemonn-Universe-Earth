'use client';

import { Settings, X } from 'lucide-react';
import { useState } from 'react';
import HolographicPanel from './HolographicPanel';
import { useLanguageStore, Language } from '@/store/useLanguageStore';

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguageStore();

    const languages: { code: Language; label: string }[] = [
        { code: 'EN', label: 'English' },
        { code: 'ZH', label: '繁體中文' },
        { code: 'JP', label: '日本語' },
    ];

    return (
        <div className="relative pointer-events-auto">
            {/* Gear Icon Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-cyan-900/50 
                    ${isOpen ? 'text-cyan-400 rotate-90' : 'text-cyan-600/80 hover:text-cyan-400 rotate-0'}
                `}
            >
                <Settings className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-10 left-0 z-50 animate-in fade-in slide-in-from-top-2">
                    <HolographicPanel title="SYSTEM CONFIG" className="w-48">
                        <div className="flex flex-col gap-2 mt-2">
                            <span className="text-[10px] text-cyan-400/50 font-mono mb-1">LANGUAGE SELECT</span>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        flex items-center justify-between px-3 py-2 text-xs font-mono border rounded transition-all
                                        ${language === lang.code
                                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                            : 'border-transparent bg-black/40 text-cyan-700 hover:border-cyan-600/50 hover:text-cyan-400'}
                                    `}
                                >
                                    <span>{lang.label}</span>
                                    {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]" />}
                                </button>
                            ))}
                        </div>
                    </HolographicPanel>
                </div>
            )}
        </div>
    );
}
