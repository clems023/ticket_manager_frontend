import { LoginRegister } from "./pages/LoginRegister";
import { Home } from "./pages/Home";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginRegister />;
  }

  return <Home />;
}

export default App;
