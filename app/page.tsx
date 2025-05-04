import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Shield, Package, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-confia-green" />
            <span className="text-xl font-bold text-confia-green">ConfiaPago</span>
          </div>
          <ConnectWalletButton />
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-confia-light/20 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-confia-green md:text-5xl">
              ConfiaPago: La Forma Segura y Definitiva de Comprar y Vender Online Entre Personas
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              ¿Cansado del riesgo en Marketplace o WhatsApp? Protege tu dinero y tus ventas, sin miedo a estafas.
            </p>
            <ConnectWalletButton
              size="lg"
              className="px-8 py-6 text-lg bg-confia-green hover:bg-confia-green/90 text-white"
            />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-confia-green">Cómo Funciona</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-confia-green/10 text-confia-green">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Acuerdo Claro</h3>
                <p className="text-gray-600">
                  Definan juntos los términos en un formulario simple. Cero malentendidos.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-confia-green/10 text-confia-green">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Depósito Seguro</h3>
                <p className="text-gray-600">
                  El comprador deposita. Los fondos quedan 100% protegidos en escrow hasta la confirmación.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-confia-green/10 text-confia-green">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Verificación y Pago</h3>
                <p className="text-gray-600">
                  El vendedor envía prueba, el comprador confirma. ¡Pago instantáneo y seguro para el vendedor!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-confia-light/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-confia-green">Aseguramos cada transacción P2P</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Con la solidez del escrow inteligente en blockchain y verificación visual asistida por IA. Tu tranquilidad
              es nuestra prioridad.
            </p>
            <ConnectWalletButton
              variant="outline"
              className="border-confia-green text-confia-green hover:bg-confia-green hover:text-white"
            >
              Conecta tu Wallet y Opera con Total Confianza
            </ConnectWalletButton>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} ConfiaPago. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
