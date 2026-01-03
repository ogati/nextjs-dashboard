import { notFound } from 'next/navigation';
import { routing } from './routing';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale } ) => {
  const locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as ('en'|'fr'))) {
    notFound();
  }

  return {
    locale,
    messages: {
      dashboard: (await import(`../messages/${locale}/dashboard.json`)).default,
      invoices: (await import(`../messages/${locale}/invoices.json`)).default
    }
  };
});
