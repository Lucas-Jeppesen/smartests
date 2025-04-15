
import Tests from "@/app/components/tests/tests";
import Link from "next/link";

export default function MisTests() {
  return(
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-green-4">Aqui tienes tus Tests: </h1>
        <Link href="/crear-test" className='bg-gray-50 text-gray-950 px-4 py-2 rounded mb-4 cursor-pointer border-1 border-gray-400'>Crear nuevo</Link>
      </div>
      <div className="w-2/3">
        <Tests />
      </div>
    </div>
  );
}