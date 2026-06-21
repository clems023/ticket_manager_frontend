import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  Alert,
} from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

type AuthFormData = {
  email: string;
  password: string;
};

type Tab = "login" | "register";

export function LoginRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [apiError, setApiError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onTabChange = (newTab: Tab) => {
    setTab(newTab);
    setApiError(null);
    reset();
  };

  const onSubmit = async (data: AuthFormData) => {
    setApiError(null);
    try {
      if (tab === "login") {
        await login(data.email, data.password);
      } else {
        await register(data.email, data.password);
      }
      navigate("/");
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md dark:border-gray-700 dark:bg-gray-800">
        <CardHeader
          title="Ticket Manager"
          subtitle={tab === "login" ? "Connexion" : "Créer un compte"}
        />
        <CardContent className="space-y-4">
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-600 dark:bg-gray-700">
            <button
              type="button"
              onClick={() => onTabChange("login")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === "login"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => onTabChange("register")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === "register"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Inscription
            </button>
          </div>

          {apiError && (
            <Alert variant="error" title="Erreur">
              {apiError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              autoComplete="email"
              error={errors.email?.message}
              {...registerField("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email invalide",
                },
              })}
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              autoComplete={
                tab === "login" ? "current-password" : "new-password"
              }
              error={errors.password?.message}
              {...registerField("password", {
                required: "Le mot de passe est requis",
                minLength:
                  tab === "register"
                    ? {
                        value: 6,
                        message: "Au moins 6 caractères",
                      }
                    : undefined,
              })}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              {tab === "login" ? "Se connecter" : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
