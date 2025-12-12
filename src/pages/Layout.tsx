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
  Inbox,
  Settings,
  Bell,
  Search,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const getNavigationItems = (t: (key: string) => string) => [
  { to: "/designs", label: t("nav.designs"), icon: ImageIcon },
  { to: "/invitations", label: t("nav.invitations"), icon: Gift },
  { to: "/messages", label: t("nav.messages"), icon: MessageSquare },
  { to: "/events", label: t("nav.events"), icon: Calendar },
  { to: "/inbox", label: t("nav.inbox"), icon: Inbox },
  { to: "/organizations", label: t("nav.organizations"), icon: Building },
  { to: "/help", label: t("help"), icon: HelpCircle },
];

export default function LayoutWrapper() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const items = getNavigationItems(t);
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

  // Appliquer le thème
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background avec effet flottant */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
            theme === "dark"
              ? "bg-blue-900/10 blur-3xl"
              : "bg-blue-50/50 blur-3xl"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${
            theme === "dark"
              ? "bg-purple-900/10 blur-3xl"
              : "bg-purple-50/50 blur-3xl"
          }`}
        ></div>
      </div>

      <div className="flex">
        {/* Sidebar flottante */}
        <aside
          className={`h-screen fixed top-4 left-4 bottom-4 z-30 transform transition-all duration-300 ease-out rounded-2xl shadow-2xl ${
            collapsed ? "w-20" : "w-64"
          } hidden md:block backdrop-blur-xl ${
            theme === "dark"
              ? "bg-gray-800/80 border border-gray-700/50"
              : "bg-white/80 border border-gray-200/50"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="h-full flex flex-col">
            {/* Logo section avec contrôles de thème/langue */}
            <div
              className={`px-4 py-4 flex items-center justify-between ${
                theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              } border-b`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center ${
                    collapsed ? "w-8 h-8" : "w-9 h-9"
                  } bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md`}
                >
                  <span className="text-white font-bold text-lg">EB</span>
                </div>
                {!collapsed && (
                  <div className="flex flex-col">
                    <div className="font-bold text-lg tracking-tight text-foreground">
                      Everblue
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {t("subtitle")}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCollapsed((s) => !s)}
                aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"}
                className={`p-2 rounded-lg transition-all hover:scale-105 ${
                  theme === "dark"
                    ? "hover:bg-gray-700/50"
                    : "hover:bg-gray-100/50"
                }`}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Contrôles de thème et langue */}
            <div
              className={`px-3 py-3 ${
                theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              } border-b`}
            >
              <div
                className={`flex ${
                  collapsed
                    ? "flex-col items-center gap-2"
                    : "items-center justify-between gap-3"
                }`}
              >
                {!collapsed && (
                  <div className="text-xs font-medium text-muted-foreground">
                    {t("menu.settings")}
                  </div>
                )}
                <div
                  className={`flex ${collapsed ? "flex-col gap-2" : "gap-2"}`}
                >
                  <ThemeToggle />
                  <LanguageSelector />
                </div>
              </div>
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
                          `flex items-center gap-3 py-2.5 px-3 rounded-xl mx-1 transition-all duration-200 group
                          ${
                            isActive
                              ? theme === "dark"
                                ? "bg-blue-500/20 text-blue-400 shadow-inner shadow-blue-500/10"
                                : "bg-blue-50 text-blue-600 shadow-inner shadow-blue-100"
                              : theme === "dark"
                              ? "text-gray-300 hover:bg-gray-700/30 hover:text-white hover:shadow-sm"
                              : "text-gray-600 hover:bg-white/50 hover:text-gray-900 hover:shadow-sm"
                          } 
                          ${collapsed ? "justify-center px-2" : ""}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="relative">
                              <div
                                className={`absolute inset-0 rounded-lg ${
                                  isActive ? "bg-blue-500/10" : "bg-transparent"
                                }`}
                              ></div>
                              <Icon
                                className={`h-5 w-5 relative z-10 ${
                                  isActive
                                    ? "text-blue-500"
                                    : "text-muted-foreground group-hover:text-foreground"
                                }`}
                              />
                            </div>
                            {!collapsed && (
                              <span
                                className={`text-sm font-medium ${
                                  isActive
                                    ? "text-blue-500"
                                    : "text-gray-700 dark:text-gray-300 group-hover:text-foreground"
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

            {/* Bottom section - PROFIL SANS BOUTON DE DÉCONNEXION */}
            <div
              className={`px-3 py-4 ${
                theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              } border-t`}
            >
              <div className="flex items-center gap-2 px-1">
                <div className={`flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {t("user")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("account")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Header mobile flottant */}
        <div className="md:hidden w-full fixed top-0 left-0 z-40">
          <div
            className={`mx-4 mt-4 rounded-2xl shadow-2xl backdrop-blur-xl ${
              theme === "dark"
                ? "bg-gray-800/80 border border-gray-700/50"
                : "bg-white/80 border border-gray-200/50"
            }`}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">EB</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Everblue</div>
                  <div className="text-xs text-muted-foreground">
                    {t("subtitle")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => setOrganisationOpen(true)}
                  className={`p-2 rounded-lg transition-all ${
                    theme === "dark"
                      ? "hover:bg-gray-700/50"
                      : "hover:bg-gray-100/50"
                  }`}
                >
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer mobile flottant */}
        {OrganisationOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setOrganisationOpen(false)}
            />
            <div
              className={`absolute left-4 top-4 bottom-4 w-80 rounded-2xl shadow-2xl backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-gray-800/90 border border-gray-700/50"
                  : "bg-white/90 border border-gray-200/50"
              }`}
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                      <span className="text-white font-bold text-lg">EB</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-foreground">
                        Everblue
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("subtitle")}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setOrganisationOpen(false)}
                    className={`p-2 rounded-lg transition-all hover:scale-105 ${
                      theme === "dark"
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-100/50"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Contrôles */}
                <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {t("common.theme")}
                      </div>
                      <ThemeToggle />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {t("common.language")}
                      </div>
                      <LanguageSelector />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3 px-2 text-muted-foreground">
                    {t("menu.main")}
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
                          className={`flex items-center gap-3 w-full text-left py-3 px-3 rounded-xl transition-all ${
                            theme === "dark"
                              ? "text-gray-300 hover:bg-gray-700/30"
                              : "text-gray-700 hover:bg-white/50"
                          }`}
                        >
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{it.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Section profil mobile - SANS BOUTON DE DÉCONNEXION */}
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {t("user")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("account")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content area avec effet flottant et marge basse */}
        <div
          className={`flex-1 min-h-screen transition-all duration-300 ml-0 md:ml-0 ${
            collapsed ? "md:pl-28" : "md:pl-72"
          }`}
        >
          <div className="pt-20 md:pt-8 px-4 md:px-8 max-w-7xl mx-auto pb-8">
            <div
              className={`rounded-2xl p-4 md:p-6 shadow-sm ${
                theme === "dark"
                  ? "bg-gray-800/30 border border-gray-700/30"
                  : "bg-white/50 border border-gray-200/30"
              }`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
