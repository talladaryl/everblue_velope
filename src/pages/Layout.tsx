import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Mail,
  HelpCircle,
  Smartphone,
  LogOut,
  Calendar,
  Users,
  Palette,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const items = [
  { to: "/designs", label: "Mes designs", icon: Home },
  { to: "/invitations", label: "Invitations", icon: Palette },
  { to: "/messages", label: "Messages", icon: Mail },
  { to: "/events", label: "Événements", icon: Calendar },
  { to: "/inbox", label: "Invitations reçues", icon: Users },
  { to: "/mobile", label: "Application mobile", icon: Smartphone },
  { to: "/help", label: "Centre d'aide", icon: HelpCircle },
];

export default function LayoutWrapper() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("eb_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("eb_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white/95 border-r border-gray-200/60 shadow-sm h-screen fixed top-0 left-0 z-30 transform transition-all duration-200
            ${collapsed ? "w-20" : "w-64"} 
            hidden md:block`}
        >
          <div className="h-full flex flex-col">
            <div className="px-3 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center rounded-md ${
                    collapsed ? "w-8 h-8" : "w-10 h-10"
                  } bg-gradient-to-r from-blue-600 to-purple-600`}
                >
                  <span className="text-white font-semibold">E</span>
                </div>
                {!collapsed && (
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      Everblue
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Créateur d'invitations
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCollapsed((s) => !s)}
                aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"}
                className="p-1 rounded hover:bg-muted"
                title={collapsed ? "Ouvrir" : "Réduire"}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>

            <nav className="mt-2 flex-1 overflow-auto px-1">
              <ul className="space-y-1">
                {items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <li key={it.to}>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2 px-3 rounded-md mx-2 transition-colors ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          } ${collapsed ? "justify-center" : ""}`
                        }
                      >
                        <Icon className="h-5 w-5" />
                        {!collapsed && (
                          <span className="text-sm">{it.label}</span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="px-3 py-4">
              <button
                onClick={() => navigate("/builder")}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow ${
                  collapsed ? "px-2 py-2" : "px-3 py-2"
                }`}
              >
                <PlusIcon />
                {!collapsed && <span className="text-sm">Nouveau</span>}
              </button>

              <div className="mt-3">
                <button
                  onClick={() => navigate("/logout")}
                  className={`w-full flex items-center gap-2 rounded-md py-2 px-3 text-sm text-red-600 hover:bg-red-50 ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Déconnexion</span>}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden w-full fixed top-0 left-0 z-40 bg-white/95 border-b border-gray-200/60">
          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="font-bold">Everblue</div>
            <div />
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white/95 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold">Everblue</div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded hover:bg-muted"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.to}
                      onClick={() => {
                        navigate(it.to);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left py-2 px-2 rounded hover:bg-gray-100"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{it.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Content area */}
        <div
          className={`flex-1 min-h-screen transition-all duration-200 ml-0 md:ml-0 ${
            collapsed ? "md:pl-20" : "md:pl-64"
          }`}
        >
          <div className="pt-14 md:pt-6 px-4 md:px-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

/* small helpers / inline icons used */
function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
