"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart, Settings, FileCode, Lock, Search } from "lucide-react"

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Mis Acuerdos",
      href: "/dashboard/acuerdos",
      icon: ShoppingCart,
      badge: 3,
    },
    {
      title: "Productos",
      href: "/dashboard/productos",
      icon: Package,
    },
    {
      title: "Contratos",
      href: "/dashboard/contratos",
      icon: FileCode,
    },
    {
      title: "Prueba Escrow",
      href: "/dashboard/prueba-escrow",
      icon: Lock,
      badge: "Nuevo",
    },
    {
      title: "Verificar Transacción",
      href: "/dashboard/verificar-transaccion",
      icon: Search,
    },
    {
      title: "Clientes",
      href: "/dashboard/clientes",
      icon: Users,
    },
    {
      title: "Estadísticas",
      href: "/dashboard/estadisticas",
      icon: BarChart,
    },
    {
      title: "Configuración",
      href: "/dashboard/configuracion",
      icon: Settings,
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn("justify-start", isActive ? "bg-secondary font-medium" : "font-normal")}
            asChild
          >
            <Link href={item.href} className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              {item.title}
              {item.badge && (
                <span
                  className={cn(
                    "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full text-xs",
                    typeof item.badge === "string"
                      ? "bg-green-500 px-1.5 text-white"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
