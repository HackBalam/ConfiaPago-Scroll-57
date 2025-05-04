import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Página no encontrada</h1>
        <p className="mb-8 text-lg text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
