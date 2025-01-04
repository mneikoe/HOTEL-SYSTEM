import { Routes, Route } from "react-router-dom";

import CommonDashboard from "./pages/CommonDashboard";
import AdminRegister from "./pages/Admin/AdminRegister";
import ManagerLogin from "./pages/Manager/ManagerLogin";
import ReceptionistLogin from "./pages/Receptionist/ReceptionistLogin";
import HomePage from "./pages/Home";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/common-dashboard" element={<CommonDashboard />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manager-login" element={<ManagerLogin />} />
      <Route path="/receptionist-login" element={<ReceptionistLogin />} />
    </Routes>
  );
}

export default App;
