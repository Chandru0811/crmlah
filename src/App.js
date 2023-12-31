import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import Topbar from "./components/common/Topbar";
import Home from "./pages/Home";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import SignIn from "./components/common/Signin";
import LogIn from "./components/common/LogIn";
import Forgot from "./components/common/Forgot";
import AdminHeader from "./components/common/AdminHeader";
import Leads from "./pages/Leads/Leads";
import LeadCreate from "./pages/Leads/Lead_Create";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin")) || false
  );

  useEffect(() => {
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);

  const handleLogin = (admin) => {
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <>
      <BrowserRouter>
        {isAdmin ? "" : <Topbar />}
        {isAdmin ? <AdminHeader handleLogout={handleLogout}/> : <Header />}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<Product />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<LogIn handleLogin={handleLogin}  />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="leads" element={<Leads />} />
          <Route path="createlead" element={<LeadCreate />} />
        </Routes>
        {isAdmin ? "" : <Footer />}
      </BrowserRouter>
    </>
  );
}

export default App;
