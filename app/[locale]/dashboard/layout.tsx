import SideNav from '../ui/dashboard/side-nav';
import LanguageToggle from '../ui/language-toggler';
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:w-64">
        <div className="text-right p-1">
          <LanguageToggle/>
        </div>
        <SideNav/>
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{ children }</div>
    </div>
  );
}
