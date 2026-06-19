import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "../components/auth/ProtectedRoute";
import { LoginRegister } from "../pages/LoginRegister";
import { TicketDetailPage } from "../pages/TicketDetailPage";
import { TicketListPage } from "../pages/TicketListPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginRegister />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
