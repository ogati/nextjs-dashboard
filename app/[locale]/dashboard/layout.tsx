import SideNav from '../ui/dashboard/side-nav';
 
export default async function Layout({children, params}: {children: React.ReactNode, params: Promise<{ locale: string }>}) {
  const { locale } = await params;
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav/>
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
