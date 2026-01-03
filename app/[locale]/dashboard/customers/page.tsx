import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('customers');

  return {
    title: t('title')
  };
}

export default async function Page() {
  const t = await getTranslations('customers');

  return <p>{ t('title') }</p>;
}