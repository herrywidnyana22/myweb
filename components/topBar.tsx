'use client'

import Image from "next/image";
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { navUtilsIcons } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { AVAILABLE_LANGUAGES } from "@/lib/constants/languages";
import { Tooltip } from "./tooltip";
import { FlagIcon } from "./flagIcon";

export const TopBar = () => {
    const { currentLanguage, setCurrentLanguage, selectedTranslationLanguages } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get available languages (selected translations + default)
    const availableLanguages = AVAILABLE_LANGUAGES.filter(
        lang => lang.code === 'id' || selectedTranslationLanguages.includes(lang.code)
    );

    // Ensure current language is in available languages, otherwise default to 'id'
    useEffect(() => {
        if (!availableLanguages.find(lang => lang.code === currentLanguage)) {
            setCurrentLanguage('id');
        }
    }, [availableLanguages, currentLanguage, setCurrentLanguage]);

    const currentLangInfo = AVAILABLE_LANGUAGES.find(lang => lang.code === currentLanguage);

    // Update time on client side only
    useEffect(() => {
        setIsMounted(true);
        
        // Set initial time
        setCurrentTime(dayjs().format('ddd, D MMM h:mm A'));

        // Update time every minute
        const interval = setInterval(() => {
            setCurrentTime(dayjs().format('ddd, D MMM h:mm A'));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        setCurrentLanguage(langCode);
        setIsLangMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };

        if (isLangMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isLangMenuOpen]);

    return ( 
        <nav className="flex justify-between items-center bg-white/50 backdrop-blur-3xl p-2 px-5 select-none relative z-9999">
            <div className="flex items-center max-sm:w-full max-sm:justify-center gap-3">
                <Image
                    src={'/icons/logo.webp'}
                    alt="logo"
                    height={24}
                    width={24}
                    className="size-6"
                />
                <p className="font-bold cursor-pointer hover:underline transition-all text-gray-800">
                    Herry Widnyana
                </p>
            </div>
            <div className="flex items-center max-sm:w-full max-sm:justify-center gap-5">
                {/* Language Switcher */}
                {isMounted && availableLanguages.length > 1 && (
                    <div className="relative z-50" ref={dropdownRef}>
                        <button
                            title={currentLangInfo?.nativeName || 'Select Language'}
                            type="button"
                            onClick={() => {
                                setIsLangMenuOpen(!isLangMenuOpen);
                            }}
                            className="group flex items-center p-1 rounded-sm bg-transparent transition-all hover:bg-gray-200 shadow-none cursor-pointer"
                        >
                            <FlagIcon 
                                code={currentLangInfo?.countryCode || 'id'} 
                                flagCode={currentLangInfo?.flag || '🇮🇩'}
                            />
                            <ChevronDown className="size-3 text-gray-800 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>

                        {/* Dropdown Menu */}
                        {isLangMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-gray-300 rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-9999 min-w-45">
                                {availableLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer ${
                                            currentLanguage === lang.code ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <FlagIcon 
                                            code={lang.countryCode || 'id'} 
                                            flagCode={lang.flag || '🇮🇩'}
                                        />
                                        <div className="flex-1 text-left">
                                            <div className="text-sm font-medium text-gray-700">
                                                {lang.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {lang.nativeName}
                                            </div>
                                        </div>
                                        {currentLanguage === lang.code && (
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <ul className="flex items-center gap-5 max-sm:hidden">
                    {navUtilsIcons.map(({id, imgSrc}) => (
                        <li key={id}>
                            <Image
                                src={imgSrc}
                                alt={`icon-${id}`}
                                height={14}
                                width={14}
                                className="size-4"
                            />
                        </li>
                    ))}
                </ul>
                <time className="text-sm font-medium text-black">{currentTime}</time>
            </div>
        </nav>
    );
}