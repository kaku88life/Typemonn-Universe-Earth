import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import HolographicPanel from './HolographicPanel';
import { useLanguageStore, Language } from '@/store/useLanguageStore';

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguageStore();

    const languages: { code: Language; label: string }[] = [
        { code: 'EN', label: 'ENGLISH' },
        { code: 'ZH', label: '繁體中文' },
        { code: 'JP', label: '日本語' },
    ];

    return (
        <div className="relative pointer-events-auto">
            {/* Trigger Button: System Config + Triangle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <span className="text-xs font-mono text-cyan-600 group-hover:text-cyan-400 transition-colors">
                    SYSTEM CONFIG
                </span>
                <ChevronDown
                    size={12}
                    className={`
                        text-cyan-700 group-hover:text-cyan-400 transition-all duration-300
                        ${isOpen ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]' : ''}
                    `}
                />
            </button>

            {/* Dropdown Choice */}
            {isOpen && (
                <div className="absolute top-8 left-0 z-50 animate-in fade-in slide-in-from-top-1 w-32">
                    <HolographicPanel className="!p-1">
                        <div className="flex flex-col gap-0.5">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        flex items-center justify-between px-2 py-1.5 text-[10px] font-mono rounded transition-all
                                        ${language === lang.code
                                            ? 'bg-cyan-900/40 text-cyan-100'
                                            : 'text-cyan-600 hover:text-cyan-300 hover:bg-cyan-900/20'}
                                    `}
                                >
                                    <span>{lang.label}</span>
                                    {language === lang.code && <Check size={10} className="text-cyan-400" />}
                                </button>
                            ))}
                        </div>
                    </HolographicPanel>
                </div>
            )}
        </div>
    );
}
