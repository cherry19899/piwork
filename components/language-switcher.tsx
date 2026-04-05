'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'pt', label: 'Português' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <select
        value={i18n.language}
        onChange={e => handleLanguageChange(e.target.value)}
        className="text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground hover:bg-secondary transition-colors"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code} className="bg-card text-foreground">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
