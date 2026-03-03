import React from "react";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router";
import CreatePage from "./pages/CreatePage";
import AppointmentDetailPage from "./pages/AppointmentDetailPage";
import WaitlistPage from "./pages/WaitlistPage";
import Dashboard from "./pages/Dashboard";


const App = () => {
  return (
    
      <div data-theme="corporate" className="min-h-screen">
       

       
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage/>}/>
      <Route path="/appointment/:id" element={<AppointmentDetailPage/>}/>
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
     </div>

      
    
  )
}

export default App
