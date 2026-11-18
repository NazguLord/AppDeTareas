import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import Tareas from "./pages/Tareas";
import Total from "./pages/Total";
import Update from "./pages/Update";
import Add from './pages/Add';
import Login from "./pages/Login";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import './style.scss';
import './sweetalert.scss';
import Registros from "./pages/Registros";
import Contactos from "./pages/Contactos";
import EditContactos from "./Components/EditContactos";
import Bootlegs from "./pages/Bootlegs";
import Audios from "./pages/Audios";
import Videos from "./pages/Videos";
import Form from "./pages/Form";
import FAQ from "./pages/FAQ";
import Pie from "./pages/Pie";
import Map from "./pages/Map";
import Medicamentos from "./pages/Medicamentos";
import Finanzas from "./pages/Finanzas";

import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AlertProvider } from "./context/alertContext";

const Layout = () => {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido-principal" className="container app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const RequireSession = () => {
  const { currentUser, isCheckingSession, sessionError, refreshSession } = useContext(AuthContext);
  const location = useLocation();

  if (isCheckingSession) return <div className="auth"><p>Comprobando sesión...</p></div>;
  if (sessionError) return <div className="auth"><p>No se pudo conectar con el servidor.</p><button onClick={refreshSession}>Reintentar</button></div>;
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <RequireSession />,
    children: [
      { path: "/", element: <Layout />, children: [
      { path: "/", element: <Tareas /> },
      { path: "/registros", element: <Registros /> },
      { path: "/contactos", element: <Contactos /> },
      { path: "/contactos/:id/edit", element: <EditContactos /> },
      { path: "/total", element: <Total /> },
      { path: "/Bootlegs", element: <Bootlegs /> },
      { path: "/Medicamentos", element: <Medicamentos /> },
      { path: "/pie", element: <Pie /> },
      { path: "/map", element: <Map /> },
      { path: "/audios", element: <Audios /> },
      { path: "/videos", element: <Videos /> },
      { path: "/form", element: <Form /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/finanzas", element: <Finanzas /> },
      ] },
      { path: "/update/:id", element: <Update /> },
      { path: "/add", element: <Add /> },
    ],
  },
  { path: "/register", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`app ${theme.palette.mode}`}>
          <AlertProvider>
            <RouterProvider router={router} />
          </AlertProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
