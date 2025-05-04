"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Upload, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Simulación de datos de acuerdo
const acuerdoData = {
  "1": {
    id: "1",
    titulo: "iPhone 13 Pro Max - 256GB",
    descripcion:
      "iPhone 13 Pro Max color Grafito, 256GB de almacenamiento. Incluye cargador original y caja. Tiene 6 meses de uso, en perfecto estado sin rayones ni golpes.",
    precio: 500,
    estado: "pendiente_aprobacion",
    estadoTexto: "Esperando tu Aprobación",
    rol: "comprador",
    contraparte: "0x7890...1234",
    contraparteCompleta: "0x7890abcd1234efgh5678ijkl9012mnop3456",
    fechaCreacion: "2023-05-01",
  },
  "2": {
    id: "2",
    titulo: "MacBook Pro M2 - 512GB",
    descripcion:
      "MacBook Pro con chip M2, 16GB RAM, 512GB SSD. Modelo 2022 en perfecto estado. Incluye cargador original y caja.",
    precio: 1200,
    estado: "escrow_activo",
    estadoTexto: "Fondos en Escrow",
    rol: "vendedor",
    contraparte: "0x4567...8901",
    contraparteCompleta: "0x4567abcd8901efgh2345ijkl6789mnop0123",
    fechaCreacion: "2023-05-10",
  },
  "3": {
    id: "3",
    titulo: 'Monitor Samsung 27"',
    descripcion: "Monitor Samsung de 27 pulgadas, resolución 4K, 144Hz. Modelo 2022, incluye cables y base original.",
    precio: 250,
    estado: "completado",
    estadoTexto: "Completado",
    rol: "vendedor",
    contraparte: "0x1234...5678",
    contraparteCompleta: "0x1234abcd5678efgh9012ijkl3456mnop7890",
    fechaCreacion: "2023-04-15",
    fechaCompletado: "2023-04-20",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  "4": {
    id: "4",
    titulo: "Cámara Sony Alpha A7 III",
    descripcion:
      "Cámara Sony Alpha A7 III con lente kit 28-70mm. Incluye batería extra, cargador y bolso de transporte.",
    precio: 800,
    estado: "disputa",
    estadoTexto: "En Disputa",
    rol: "comprador",
    contraparte: "0x2468...1357",
    contraparteCompleta: "0x2468abcd1357efgh8024ijkl9135mnop7246",
    fechaCreacion: "2023-05-05",
    fechaDisputa: "2023-05-12",
  },
  "5": {
    id: "5",
    titulo: 'iPad Pro 11" - 128GB',
    descripcion: "iPad Pro 11 pulgadas, 128GB, WiFi + Cellular. Modelo 2022, incluye Apple Pencil 2 y Smart Keyboard.",
    precio: 450,
    estado: "pendiente_deposito",
    estadoTexto: "Pendiente de Depósito",
    rol: "comprador",
    contraparte: "0x9876...5432",
    contraparteCompleta: "0x9876abcd5432efgh1098ijkl7654mnop3210",
    fechaCreacion: "2023-05-15",
  },
}

export default function AcuerdoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const acuerdo = acuerdoData[id as keyof typeof acuerdoData]

  const [loading, setLoading] = useState(false)
  const [openDeposito, setOpenDeposito] = useState(false)
  const [openConfirmacion, setOpenConfirmacion] = useState(false)
  const [openDisputa, setOpenDisputa] = useState(false)
  const [openPrueba, setOpenPrueba] = useState(false)

  if (!acuerdo) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">Acuerdo no encontrado</h1>
        <p className="mb-4 text-muted-foreground">El acuerdo que buscas no existe o no tienes acceso a él.</p>
        <Button asChild>
          <Link href="/dashboard/acuerdos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Acuerdos
          </Link>
        </Button>
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente_aprobacion":
        return "bg-warning/10 text-warning"
      case "pendiente_deposito":
        return "bg-blue-500/10 text-blue-500"
      case "escrow_activo":
        return "bg-primary/10 text-primary"
      case "prueba_subida":
        return "bg-purple-500/10 text-purple-500"
      case "completado":
        return "bg-success/10 text-success"
      case "disputa":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleAction = async () => {
    setLoading(true)

    // Simulación de acción según el estado
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)

    // Cerrar modales
    setOpenDeposito(false)
    setOpenConfirmacion(false)
    setOpenDisputa(false)
    setOpenPrueba(false)

    // Redirigir al dashboard después de la acción
    router.push("/dashboard/acuerdos")
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/acuerdos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Acuerdos
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Detalles del Acuerdo Seguro #{acuerdo.id}</h1>
          <Badge variant="outline" className={getEstadoColor(acuerdo.estado)}>
            {acuerdo.estadoTexto}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{acuerdo.titulo}</CardTitle>
              <CardDescription>
                Creado el {acuerdo.fechaCreacion} • Eres {acuerdo.rol === "comprador" ? "Comprador" : "Vendedor"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Descripción</h3>
                <p className="text-sm text-muted-foreground">{acuerdo.descripcion}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Precio</h3>
                  <p className="font-semibold">{acuerdo.precio} USDT</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Fecha de creación</h3>
                  <p>{acuerdo.fechaCreacion}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 font-semibold">Estado actual</h3>
                <div className="rounded-md bg-muted p-4">
                  {acuerdo.estado === "pendiente_aprobacion" && acuerdo.rol === "comprador" && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        Revisa detenidamente los términos propuestos. Tu aceptación confirma tu compromiso.
                      </p>
                    </div>
                  )}

                  {acuerdo.estado === "pendiente_deposito" && acuerdo.rol === "comprador" && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        Activa la Protección Total: Deposita {acuerdo.precio} USDT. Tus fondos estarán 100% seguros en
                        nuestro contrato inteligente hasta que confirmes la recepción satisfactoria.
                      </p>
                    </div>
                  )}

                  {acuerdo.estado === "escrow_activo" && acuerdo.rol === "vendedor" && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        ¡Luz Verde! Los fondos están asegurados. Procede con el envío/entrega según lo pactado y sube tu
                        prueba visual para garantizar la transparencia.
                      </p>
                    </div>
                  )}

                  {acuerdo.estado === "prueba_subida" && acuerdo.rol === "comprador" && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        Verifica tu Compra: El vendedor ha subido la prueba. Revisa que todo esté en orden. Tu
                        confirmación libera el pago de forma segura e instantánea.
                      </p>
                      <div className="rounded-md border p-2">
                        <img
                          src="/placeholder.svg?height=200&width=400"
                          alt="Prueba de envío"
                          className="mx-auto h-auto max-w-full rounded-md"
                        />
                      </div>
                    </div>
                  )}

                  {acuerdo.estado === "disputa" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <p className="font-medium">Acuerdo Pausado para Revisión Justa</p>
                      </div>
                      <p className="text-sm">
                        Hemos recibido una solicitud de disputa. Los fondos permanecen bloqueados mientras nuestro
                        equipo media para encontrar la mejor solución. Te contactaremos por email.
                      </p>
                    </div>
                  )}

                  {acuerdo.estado === "completado" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="h-5 w-5" />
                        <p className="font-medium">¡Transacción completada con éxito!</p>
                      </div>
                      <p className="text-sm">Fecha de completado: {acuerdo.fechaCompletado}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>TX Hash:</span>
                        <a
                          href={`https://scrollscan.com/tx/${acuerdo.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {acuerdo.txHash?.substring(0, 10)}...{acuerdo.txHash?.substring(acuerdo.txHash.length - 8)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {acuerdo.estado === "pendiente_aprobacion" && acuerdo.rol === "comprador" && (
                <>
                  <Button onClick={() => handleAction()}>Aceptar y Proceder con Seguridad</Button>
                  <Button variant="outline">Rechazar Acuerdo</Button>
                </>
              )}

              {acuerdo.estado === "pendiente_deposito" && acuerdo.rol === "comprador" && (
                <Dialog open={openDeposito} onOpenChange={setOpenDeposito}>
                  <DialogTrigger asChild>
                    <Button>Depositar Fondos Ahora</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirma tu Depósito en Escrow Seguro</DialogTitle>
                      <DialogDescription>
                        Estás depositando {acuerdo.precio} USDT. Este monto quedará protegido por el contrato
                        inteligente de ConfiaPago en la red Scroll. Solo se liberará al vendedor cuando confirmes haber
                        recibido todo correctamente.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-center">
                      <p className="mb-4 text-sm font-medium">
                        Aprueba la transacción en tu wallet. Es un paso crucial para tu seguridad.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenDeposito(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAction} disabled={loading}>
                        {loading ? "Procesando..." : "Proceder al Depósito Seguro"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {acuerdo.estado === "escrow_activo" && acuerdo.rol === "vendedor" && (
                <Dialog open={openPrueba} onOpenChange={setOpenPrueba}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Prueba de Envío/Entrega
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Documenta tu Envío para Mayor Confianza</DialogTitle>
                      <DialogDescription>
                        Sube una prueba visual clara (foto del paquete sellado con guía, video corto, etc.). Esto brinda
                        certeza a tu comprador y es clave para recibir tu pago sin demoras.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm font-medium">Arrastra y suelta o haz clic para seleccionar</p>
                          <p className="text-xs text-muted-foreground">Soporta JPG, PNG o videos cortos (max. 10MB)</p>
                        </div>
                      </div>
                      <Textarea placeholder="Notas adicionales o número de guía (opcional)" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenPrueba(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAction} disabled={loading}>
                        {loading ? "Subiendo..." : "Subir Prueba y Notificar al Comprador"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {acuerdo.estado === "prueba_subida" && acuerdo.rol === "comprador" && (
                <>
                  <Dialog open={openConfirmacion} onOpenChange={setOpenConfirmacion}>
                    <DialogTrigger asChild>
                      <Button>Confirmar Recepción y Liberar Pago</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Todo Recibido Correctamente? Confirma para Finalizar.</DialogTitle>
                        <DialogDescription>
                          <div className="mt-2 flex items-center gap-2 rounded-md bg-amber-50 p-3 text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">
                              ¡Atención! Al confirmar, autorizas la liberación inmediata e irreversible de{" "}
                              {acuerdo.precio} USDT al vendedor.
                            </span>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm">
                          Asegúrate de haber recibido y verificado '{acuerdo.titulo}' a tu entera satisfacción.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenConfirmacion(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAction} disabled={loading}>
                          {loading ? "Procesando..." : "Sí, Todo Correcto. Liberar Pago al Vendedor"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={openDisputa} onOpenChange={setOpenDisputa}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Reportar un Problema</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Iniciar Proceso de Disputa Segura</DialogTitle>
                        <DialogDescription>
                          Si algo no está bien, estamos aquí para ayudar. Describe el problema. Al iniciar la disputa,
                          los fondos se mantendrán bloqueados y nuestro equipo especializado intervendrá para mediar y
                          asegurar una resolución justa y transparente.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea placeholder="Describe detalladamente el inconveniente..." className="min-h-[120px]" />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDisputa(false)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleAction} disabled={loading}>
                          {loading ? "Enviando..." : "Enviar Disputa para Mediación"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Contraparte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  {acuerdo.rol === "comprador" ? "Vendedor" : "Comprador"}
                </h3>
                <p className="font-medium">{acuerdo.contraparte}</p>
                <p className="mt-1 text-xs text-muted-foreground break-all">{acuerdo.contraparteCompleta}</p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Rol en la transacción</h3>
                <Badge variant="outline">{acuerdo.rol === "comprador" ? "Eres Comprador" : "Eres Vendedor"}</Badge>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Información de Pago</h3>
                <div className="rounded-md bg-muted p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm">Precio:</span>
                    <span className="font-medium">{acuerdo.precio} USDT</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm">Comisión ConfiaPago:</span>
                    <span className="font-medium">{(acuerdo.precio * 0.02).toFixed(2)} USDT</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="font-bold">{(acuerdo.precio * 1.02).toFixed(2)} USDT</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium">Acuerdo Creado</p>
                    <p className="text-xs text-muted-foreground">{acuerdo.fechaCreacion}</p>
                  </div>
                </div>

                {acuerdo.estado !== "pendiente_aprobacion" && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Acuerdo Aceptado</p>
                      <p className="text-xs text-muted-foreground">{acuerdo.fechaCreacion}</p>
                    </div>
                  </div>
                )}

                {(acuerdo.estado === "escrow_activo" ||
                  acuerdo.estado === "prueba_subida" ||
                  acuerdo.estado === "completado" ||
                  acuerdo.estado === "disputa") && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Fondos Depositados</p>
                      <p className="text-xs text-muted-foreground">{acuerdo.fechaCreacion}</p>
                    </div>
                  </div>
                )}

                {(acuerdo.estado === "prueba_subida" ||
                  acuerdo.estado === "completado" ||
                  acuerdo.estado === "disputa") && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Prueba de Envío Subida</p>
                      <p className="text-xs text-muted-foreground">{acuerdo.fechaCreacion}</p>
                    </div>
                  </div>
                )}

                {acuerdo.estado === "completado" && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Pago Liberado</p>
                      <p className="text-xs text-muted-foreground">{acuerdo.fechaCompletado}</p>
                    </div>
                  </div>
                )}

                {acuerdo.estado === "disputa" && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-destructive" />
                    <div>
                      <p className="font-medium">Disputa Iniciada</p>
                      <p className="text-xs text-muted-foreground">{acuerdo.fechaDisputa}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
