import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import SalesDashboard from './pages/SalesDashboard'
import AdminReport from './components/AdminReport';
import AddLeadForm from './components/AddLeadForm';
import SalesPersonReport from './components/SalesPersonReport';

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/sales/dashboard" element={<SalesDashboard />} />
      <Route path="/addlead" element={<AddLeadForm />} />
      <Route path="/viewreport" element={<AdminReport />} />
      <Route path="/salespersonreport" element={<SalesPersonReport />} />
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  )
}

export default App
