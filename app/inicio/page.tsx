import Link from "next/link"
import { PlusCircle, Edit, Trash2, ExternalLink } from "lucide-react"

export default function Inicio() {
  // Placeholder test data
  const tests = [
    { id: 1, title: "Test de Matemáticas" },
    { id: 2, title: "Test de Ciencias" },
    { id: 3, title: "Test de Historia" },
    { id: 4, title: "Test de Literatura" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crear un nuevo test bento box */}
        <Link
          href="/crear-test"
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-64"
        >
          <PlusCircle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-center">Crear un nuevo test</h2>
        </Link>

        {/* Mis Tests bento box */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-auto">
          <h2 className="text-2xl font-semibold mb-4">Mis Tests</h2>

          <div className="grid grid-cols-1 gap-4 max-h-[200px] overflow-y-auto pr-2">
            {tests.map((test) => (
              <div
                key={test.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{test.title}</h3>
                  <div className="flex space-x-2">
                    <Link
                      href={`/test/${test.id}`}
                      className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Ver test"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/test/${test.id}/edit`}
                      className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Editar test"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Link>
                    <button className="p-1.5 rounded-md hover:bg-gray-200 transition-colors" aria-label="Eliminar test">
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

