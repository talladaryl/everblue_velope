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
  Image as ImageIcon,
  MessageSquare,
  Gift,
  Building,
  Plus,
  LayoutDashboard,
  Send,
  Inbox,
  Settings,
} from "lucide-react";

const items = [
  { to: "/designs", label: "Mes designs", icon: ImageIcon },
  { to: "/invitations", label: "Invitations", icon: Gift },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/events", label: "Événements", icon: Calendar },
  { to: "/inbox", label: "Invitations reçues", icon: Inbox },
  { to: "/organizations", label: "Organisations", icon: Building },
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
  const [OrganisationOpen, setOrganisationOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("eb_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Style moderne */}
        <aside
          className={`bg-white border-r border-gray-100 h-screen fixed top-0 left-0 z-30 transform transition-all duration-300 ease-in-out
            ${collapsed ? "w-20" : "w-64"} 
            hidden md:block shadow-sm`}
        >
          <div className="h-full flex flex-col">
            {/* Logo section */}
            <div className="px-4 py-5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center ${
                    collapsed ? "w-8 h-8" : "w-9 h-9"
                  } bg-blue-600 rounded-lg`}
                >
                  <span className="text-white font-bold text-lg">EB</span>
                </div>
                {!collapsed && (
                  <div className="flex flex-col">
                    <div className="font-bold text-gray-900 text-lg tracking-tight">
                      Everblue
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Design Studio
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCollapsed((s) => !s)}
                aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={collapsed ? "Ouvrir" : "Réduire"}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-auto px-2 py-4">
              <ul className="space-y-1">
                {items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <li key={it.to}>
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2.5 px-3 rounded-lg mx-1 transition-all duration-200
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          } 
                          ${collapsed ? "justify-center px-2" : ""}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`h-5 w-5 ${
                                isActive ? "text-blue-600" : "text-gray-500"
                              }`}
                            />
                            {!collapsed && (
                              <span
                                className={`text-sm font-medium ${
                                  isActive ? "text-blue-600" : "text-gray-700"
                                }`}
                              >
                                {it.label}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom section */}
            <div className="px-3 py-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/builder")}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm
                  ${collapsed ? "px-3" : "px-4"} mb-3`}
              >
                <Plus className="h-5 w-5" />
                {!collapsed && (
                  <span className="text-sm font-medium">Nouveau design</span>
                )}
              </button>

              <div className="flex items-center gap-2 px-1">
                <div className={`flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">
                      U
                    </span>
                  </div>
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      Utilisateur
                    </div>
                    <div className="text-xs text-gray-500">Compte</div>
                  </div>
                )}

                <button
                  onClick={() => navigate("/logout")}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${
                    collapsed ? "ml-0" : ""
                  }`}
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden w-full fixed top-0 left-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EB</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">Everblue</div>
                <div className="text-xs text-gray-500">Design Studio</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/builder")}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Nouveau design"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                onClick={() => setOrganisationOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {OrganisationOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setOrganisationOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">EB</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      Everblue
                    </div>
                    <div className="text-xs text-gray-500">Design Studio</div>
                  </div>
                </div>
                <button
                  onClick={() => setOrganisationOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="mb-6">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  MENU PRINCIPAL
                </div>
                <nav className="space-y-1">
                  {items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <button
                        key={it.to}
                        onClick={() => {
                          navigate(it.to);
                          setOrganisationOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <Icon className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{it.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-2 py-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">
                      U
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Utilisateur</div>
                    <div className="text-sm text-gray-500">
                      Compte personnel
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate("/logout");
                    setOrganisationOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-lg hover:bg-gray-50 text-gray-600 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content area */}
        <div
          className={`flex-1 min-h-screen transition-all duration-300 ml-0 md:ml-0 ${
            collapsed ? "md:pl-20" : "md:pl-64"
          }`}
        >
          <div className="pt-16 md:pt-6 px-4 md:px-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
