import type React from "react"
import { Shield, Bell, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/dashboard-nav"
import { WalletStatus } from "@/components/wallet-status"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-2 py-4">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold text-primary">ConfiaPago</span>
                  </div>
                  <DashboardNav className="flex-1" />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">ConfiaPago</span>
            </Link>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">ConfiaPago</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificaciones</span>
            </Button>

            <WalletStatus />

            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar sesión</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-white lg:block">
          <div className="flex h-full flex-col">
            <DashboardNav className="flex-1 p-4" />
          </div>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
