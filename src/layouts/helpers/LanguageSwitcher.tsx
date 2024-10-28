import config from "@/config/config.json";
import languages from "@/config/language.json";
import React, { useState, useRef, useEffect } from "react";
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({
  lang,
  pathname,
}: {
  lang: string;
  pathname: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { default_language, default_language_in_subdir } = config.settings;

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeTrailingSlash = (path: string) => {
    if (!config.site.trailing_slash) {
      return path.replace(/\/$/, "");
    }
    return path;
  };

  const sortedLanguages = languages
    .filter(language => !config.settings.disable_languages.includes(language.languageCode))
    .sort((a, b) => a.weight - b.weight);

  const handleLanguageChange = (selectedLang: string) => {
    let newPath;
    const baseUrl = window.location.origin;

    if (selectedLang === default_language) {
      if (default_language_in_subdir) {
        newPath = `${baseUrl}/${default_language}${removeTrailingSlash(pathname.replace(`/${lang}`, ""))}`;
      } else {
        newPath = `${baseUrl}${removeTrailingSlash(pathname.replace(`/${lang}`, ""))}`;
      }
    } else {
      newPath = `${baseUrl}/${selectedLang}${removeTrailingSlash(pathname.replace(`/${lang}`, ""))}`;
    }

    window.location.href = newPath;
  };

  return (
    <div className={`relative mr-5 ${sortedLanguages.length > 1 ? "block" : "hidden"}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-darkmode-primary"
        title="切换语言"
      >
        <Globe size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-32 bg-white dark:bg-darkmode-body rounded-lg shadow-lg border dark:border-darkmode-border">
          {sortedLanguages.map((language) => (
            <button
              key={language.languageCode}
              onClick={() => {
                handleLanguageChange(language.languageCode);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-darkmode-primary ${
                lang === language.languageCode ? "text-primary dark:text-darkmode-primary" : ""
              }`}
            >
              {language.languageName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
