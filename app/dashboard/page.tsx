import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, ShoppingCart, Package, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Tu Centro de Control Seguro</h1>
          <p className="text-muted-foreground">Gestiona tus acuerdos y transacciones seguras con ConfiaPago.</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/acuerdos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Crear Acuerdo Protegido
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acuerdos Activos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acuerdos Completados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contrapartes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Asegurado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 USDT</div>
            <p className="text-xs text-muted-foreground">+320 USDT desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 text-xl font-semibold">Mis Acuerdos Activos y Pasados</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Badge>Comprador</Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning">
                Esperando tu Aprobación
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mb-2 text-lg">iPhone 13 Pro Max - 256GB</CardTitle>
            <CardDescription className="mb-4">Vendedor: 0x7890...1234</CardDescription>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precio:</span>
              <span className="font-medium">500 USDT</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard/acuerdos/1">
                Ver Detalles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Badge>Vendedor</Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Fondos en Escrow
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mb-2 text-lg">MacBook Pro M2 - 512GB</CardTitle>
            <CardDescription className="mb-4">Comprador: 0x4567...8901</CardDescription>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precio:</span>
              <span className="font-medium">1,200 USDT</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard/acuerdos/2">
                Ver Detalles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Badge>Vendedor</Badge>
              <Badge variant="outline" className="bg-success/10 text-success">
                Completado
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mb-2 text-lg">Monitor Samsung 27"</CardTitle>
            <CardDescription className="mb-4">Comprador: 0x1234...5678</CardDescription>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precio:</span>
              <span className="font-medium">250 USDT</span>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/acuerdos/3">
                Ver Detalles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
