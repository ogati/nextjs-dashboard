'use client'

import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'use-intl';

// Map of links to display in the side navigation
const links = [
  { key: 'dashboard', href: '/dashboard', icon: HomeIcon },
  { key: 'invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { key: 'customers', href: '/dashboard/customers', icon: UserGroupIcon }
];

export default function NavLinks() {
  const t = useTranslations('sideNav');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.key}
            href={ `/${locale}${link.href}` }
            className={`${pathname === ('/' + locale + link.href) && 'bg-sky-100 text-blue-600'} flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{ t(`${ link.key }`) }</p>
          </Link>
        );
      })}
    </>
  );
}
