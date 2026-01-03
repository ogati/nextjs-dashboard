import Pagination from '../../ui/invoices/pagination';
import Search from '../../ui/search';
import Table from '../../ui/invoices/table';
import { CreateInvoice } from '../../ui/invoices/buttons';
import { lusitana } from '../../ui/fonts';
import { InvoicesTableSkeleton } from '../../ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '../../lib/data';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('invoices');

  return {
    title: t('title')
  };
}

export default async function Page({searchParams}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>
}) {
  const t = await getTranslations('invoices');
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{ t('title') }</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}