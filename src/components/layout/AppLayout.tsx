import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Ticket Manager
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <span className="hidden text-sm text-gray-600 dark:text-gray-400 sm:inline">
                {user.email}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
