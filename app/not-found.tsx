import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import SideNav from './ui/dashboard/side-nav';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">
        <main className="flex h-full flex-col items-center justify-center gap-2">
          <FaceFrownIcon className="w-10 text-gray-400" />
          <h2 className="text-xl font-semibold">404 – Page Not Found</h2>
          <p>The page you&apos;re looking for doesn’t exist.</p>
          <Link
            href="/dashboard"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          >
            Go Home
          </Link>
        </main>
      </div>
    </div>
  )
}
