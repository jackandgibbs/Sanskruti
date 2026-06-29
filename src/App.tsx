import { Routes, Route, useLocation, Navigate } from "react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Placeholder from "@/pages/Placeholder";
import { NAV_LINKS } from "@/data/site";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

import Category from "@/pages/Category";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import ProfileSettings from "@/pages/ProfileSettings";
import Addresses from "@/pages/Addresses";
import Lookbooks from "@/pages/Lookbooks";

import IntroLoader from "@/components/ui/IntroLoader";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCustomerProfile from "@/pages/admin/AdminCustomerProfile";
import AdminSettings from "@/pages/admin/AdminSettings";

import StylistChat from "@/components/ui/StylistChat";

export default function App() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal font-body">
      <IntroLoader />
      <ScrollToTop />
      <StylistChat />
      <Routes>
        {/* Admin Portal (Protected layout without public navbar/footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<AdminCustomerProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Storefront */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/orders" element={<Orders />} />
                  <Route path="/dashboard/security" element={<ProfileSettings />} />
                  <Route path="/dashboard/addresses" element={<Addresses />} />
                  <Route path="/dashboard/payments" element={<Placeholder title="Payment Options" />} />
                  <Route path="/dashboard/lookbooks" element={<Lookbooks />} />
                  <Route path="/dashboard/wishlist" element={<Navigate to="/dashboard/lookbooks" replace />} />
                  <Route path="/dashboard/membership" element={<Placeholder title="Sanskruti Elite" />} />
                  <Route path="/dashboard/gift-cards" element={<Placeholder title="Gift Cards & Vouchers" />} />
                  <Route path="/dashboard/messages" element={<Placeholder title="Your Messages" />} />
                  <Route path="/dashboard/history" element={<Placeholder title="Recently Viewed" />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  
                  {NAV_LINKS.filter((l) => !["/", "/about", "/contact"].includes(l.to)).map((l) => (
                    <Route key={l.to} path={l.to} element={<Category />} />
                  ))}
                  
                  <Route path="/about" element={<Placeholder title="About Us" />} />
                  <Route path="/contact" element={<Placeholder title="Contact Us" />} />
                  <Route path="*" element={<Placeholder title="Page Not Found" />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
      <Toaster position="bottom-right" theme="light" />
    </div>
  );
}
