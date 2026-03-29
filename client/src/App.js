import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Tareas from "./pages/Tareas";
import Total from "./pages/Total";
import Update from "./pages/Update";
import Add from './pages/Add';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import './style.scss';
import Registros from "./pages/Registros";
import Contactos from "./pages/Contactos";
import EditContactos from "./Components/EditContactos";
import Bootlegs from "./pages/Bootlegs";
import Audios from "./pages/Audios";
import Form from "./pages/Form";
import FAQ from "./pages/FAQ";
import Pie from "./pages/Pie";
import Map from "./pages/Map";
import Medicamentos from "./pages/Medicamentos";

import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";

const Layout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Tareas /> },
      { path: "/registros", element: <Registros /> },
      { path: "/register", element: <Register /> },
      { path: "/contactos", element: <Contactos /> },
      { path: "/contactos/:id/edit", element: <EditContactos /> },
      { path: "/total", element: <Total /> },
      { path: "/Bootlegs", element: <Bootlegs /> },
      { path: "/Medicamentos", element: <Medicamentos /> },
      { path: "/pie", element: <Pie /> },
      { path: "/map", element: <Map /> },
      { path: "/audios", element: <Audios /> },
      { path: "/form", element: <Form /> },
      { path: "/faq", element: <FAQ /> },
    ],
  },
  { path: "/update/:id", element: <Update /> },
  { path: "/add", element: <Add /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`app ${theme.palette.mode}`}>
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
