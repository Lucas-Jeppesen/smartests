
import Tests from "@/app/components/tests/tests";
import Link from "next/link";

export default function MisTests() {
  return(
    <div className="flex flex-col gap-8 w-full">  
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-green-4">Aqui tienes tus Tests: </h1>
        <Link href="/escritorio/crear-test" className='bg-yellow-1 hover:bg-green-1 hover:text-yellow-1 text-green-2 font-medium text-sm px-6 py-1 rounded cursor-pointer border border-green-1 transition-all duration-300 ease-in-out'>Crear nuevo</Link>
      </div>
        <Tests />
    </div>
  );
}