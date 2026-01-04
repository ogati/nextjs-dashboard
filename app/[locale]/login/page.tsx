import { getTranslations } from 'next-intl/server';
import AcmeLogo from '../ui/acme-logo';
import LoginForm from '../ui/login-form';
import { Metadata } from 'next';
import { Suspense } from 'react';
import LanguageToggle from '../ui/language-toggler';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('login');

  return {
    title: t('login')
  };
}

export default async function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col md:-mt-32">
        <div className="h-5"></div>
        <div className="text-right pb-1">
            <LanguageToggle/>
          </div>
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
