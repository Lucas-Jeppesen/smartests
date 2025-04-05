import Link from "next/link"
import { PlusCircle} from "lucide-react"

export default function Inicio() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inicio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crear un nuevo test bento box */}
        <Link
          href="/crear-test"
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-64"
        >
          <PlusCircle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-center">Crear un nuevo test</h2>
        </Link>
        <Link
          href="/mis-tests"
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-64"
        >
          <PlusCircle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-center">Ver tests y asiganturas</h2>
        </Link>
      </div>
    </div>
  )
}

