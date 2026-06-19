import { AxiosError } from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.message)) return data.message.join(", ");
      if (typeof data.error === "string") return data.error;
    }
    if (error.response?.status === 401)
      return "Email ou mot de passe incorrect.";
    if (error.response?.status === 422) return "Données invalides.";
    if (error.response?.status === 409)
      return "Un compte existe déjà avec cet email.";
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue. Réessayez.";
}
