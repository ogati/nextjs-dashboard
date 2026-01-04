import { notFound } from 'next/navigation';
import { routing } from './routing';
import { getRequestConfig } from 'next-intl/server';
import LanguageToggle from '@/app/[locale]/ui/language-toggler';

export default getRequestConfig(async ({ requestLocale } ) => {
  const locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as ('en'|'fr'))) {
    notFound();
  }

  return {
    locale,
    messages: {
      home: (await import(`../messages/${locale}/home.json`)).default,
      dashboard: (await import(`../messages/${locale}/dashboard.json`)).default,
      invoices: (await import(`../messages/${locale}/invoices.json`)).default,
      customers: (await import(`../messages/${locale}/customers.json`)).default,
      login: (await import(`../messages/${locale}/login.json`)).default,
      sideNav: (await import(`../messages/${locale}/sideNav.json`)).default,
      languageToggle: (await import(`../messages/${locale}/languageToggle.json`)).default
    }
  };
});
