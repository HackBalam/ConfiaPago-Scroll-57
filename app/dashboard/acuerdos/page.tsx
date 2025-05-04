import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AcuerdosPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Mis Acuerdos</h1>
          <p className="text-muted-foreground">Gestiona todos tus acuerdos de compra y venta.</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/acuerdos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Crear Acuerdo Protegido
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar acuerdos..." className="pl-8" />
        </div>
        <Select defaultValue="todos">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los acuerdos</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="escrow">En Escrow</SelectItem>
            <SelectItem value="completados">Completados</SelectItem>
            <SelectItem value="disputa">En Disputa</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            <div className="mb-2 text-lg font-semibold">iPhone 13 Pro Max - 256GB</div>
            <div className="mb-4 text-sm text-muted-foreground">Vendedor: 0x7890...1234</div>
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
            <div className="mb-2 text-lg font-semibold">MacBook Pro M2 - 512GB</div>
            <div className="mb-4 text-sm text-muted-foreground">Comprador: 0x4567...8901</div>
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
            <div className="mb-2 text-lg font-semibold">Monitor Samsung 27"</div>
            <div className="mb-4 text-sm text-muted-foreground">Comprador: 0x1234...5678</div>
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

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Badge>Comprador</Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive">
                En Disputa
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-2 text-lg font-semibold">Cámara Sony Alpha A7 III</div>
            <div className="mb-4 text-sm text-muted-foreground">Vendedor: 0x2468...1357</div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precio:</span>
              <span className="font-medium">800 USDT</span>
            </div>
            <Button className="w-full" variant="destructive" asChild>
              <Link href="/dashboard/acuerdos/4">
                Ver Disputa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <Badge>Comprador</Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                Pendiente de Depósito
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-2 text-lg font-semibold">iPad Pro 11" - 128GB</div>
            <div className="mb-4 text-sm text-muted-foreground">Vendedor: 0x9876...5432</div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precio:</span>
              <span className="font-medium">450 USDT</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard/acuerdos/5">
                Realizar Depósito
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
