import { Routes, Route } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import Home from "./Screens/Home.jsx"
import Units from "./Screens/Units/Units.jsx";
import MenuAdmin from "./Screens/Menu/MenuAdmin.jsx";
import AdminOrders from "./Screens/Orders/AdminOrders.jsx";
import AdminPlan from "./Screens/Plan/AdminPlan.jsx";
import CreateStaff from "./Screens/StaffCreate/CreateStaff.jsx";
import PayPlanQR from "./Screens/Plan/BusinessPayQR.jsx";
import InvoiceSettings from "./Screens/Invoice/InvoiceSettings.jsx";
import "./Dashboard.css";

const Dashboard = () => {
    const businessId = localStorage.getItem("businessId");
      const businessCode = localStorage.getItem("businessCode");
  return (
    <div className="dashboard-main" style={{margin:0, padding:0}}>
      <Sidebar />
      <div className="dashboard-content">
       
        <Routes>
     <Route index element={<Home businessCode={businessCode}/>} />
          <Route path="/units" element={<Units businessId={businessId} businessCode={businessCode}/>} />
<Route
  path="/menu"
  element={<MenuAdmin businessId={businessId}  businessCode={businessCode}/>}
/>
<Route
  path="/order"
  element={<AdminOrders businessId={businessId}  businessCode={businessCode}/>}
/>
<Route
  path="/staff"
  element={<CreateStaff businessCode={businessCode}/>}
/>
<Route
  path="/plan"
  element={<AdminPlan businessCode={businessCode}/>}
/>
<Route
  path="/planman"
  element={<PayPlanQR businessCode={businessCode}/>}
/>
<Route
  path="/invoice"
  element={<InvoiceSettings businessCode={businessCode}/>}
/>
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
