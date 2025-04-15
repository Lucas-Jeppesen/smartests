


import SideNav from "../components/Layout/sideNav";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-52">
        <SideNav />
      </div>
      <div className="flex-grow bg-yellow-2 p-2 md:overflow-y-auto md:px-8 md:py-12">{children}</div>
    </div>
  );
}