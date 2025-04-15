


import SideNav from "../components/Layout/sideNav";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full fixed flex-none md:w-52">
        <SideNav />
      </div>
      <div className="ml-52 flex-grow bg-yellow-2 p-2 md:overflow-y-auto md:px-8 md:py-12">{children}</div>
    </div>
  );
}