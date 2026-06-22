import { NavLink, Outlet } from "react-router-dom"
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Scissors,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/clienti", label: "Clienti", icon: Users },
  { to: "/servizi", label: "Servizi", icon: Scissors },
  { to: "/magazzino", label: "Magazzino", icon: Package },
  { to: "/scontrini", label: "Scontrini", icon: Receipt },
  { to: "/cassa", label: "Cassa", icon: Wallet },
]

function initials(nome: string, cognome: string) {
  return `${nome[0] ?? ""}${cognome[0] ?? ""}`.toUpperCase()
}

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen w-screen bg-background">
      <aside className="flex w-60 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">ReserveME Admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            <Avatar>
              <AvatarFallback className="text-xs">
                {user ? initials(user.nome, user.cognome) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {user?.nome} {user?.cognome}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user?.nomeNegozio}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Esci">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
