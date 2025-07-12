import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";

import Layout from "./pages/Layout";
import LandingPage from "./pages/LandingPage.jsx";
import Browse from "./pages/Browse.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Upload from "./pages/Upload.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditItem from "./pages/EditItem.jsx";
// import Signup from "./pages/Signup";
import AdminPage from "./pages/AdminPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <ToastContainer />
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-item/:id" 
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
