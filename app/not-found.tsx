import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <Shield className="h-16 w-16 text-confia-green" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Página no encontrada</h1>
        <p className="mb-8 text-lg text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild className="bg-confia-green hover:bg-confia-green/90 text-white">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
