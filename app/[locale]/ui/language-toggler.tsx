'use client'

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "use-intl";

export default function LanguageToggle() {
  const t = useTranslations('languageToggle');
  const pathname = usePathname();
  const qs = useSearchParams().toString();
  const newPathname = 'fr' === useLocale()? `${pathname.replace('/fr', '/en')}` : `${pathname.replace('/en', '/fr')}`;

  return (
    <Link href={newPathname + (qs && `?${qs}`)} className="p-1 hover:bg-sky-100 text-blue-600">{ t('language') }</Link>
  );
}