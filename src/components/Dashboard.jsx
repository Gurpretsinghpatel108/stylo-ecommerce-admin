

import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Sidebar from "./Sidebar";
import CategoryMenu from "./CategoryMenu";
import SubcategoryMenu from "./SubCategoryMenu";
import AddProduct from "./AddProduct";
import AllProduct from "./AllProduct";
import AllOrders from "./AllOrders";
import ManageState from "./ManageState";
import StateManagement from "./StateManagement";
import ManageCity from "./ManageCity";
import CustomerList from "./CustomerList";
import FAQPage from "./FAQPage";
import ContactUs from "./ContactUs";
import OtherPages from "./OtherPages";
import CustomizeMenuLinks from "./customizemenulink";
import Checkout from "./Checkout";
import Coupons from "./Coupons";
import Profile from "./Profile";
import Payment from "./Payment";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          {/* Dashboard home / default */}
          <Route path="/" element={<h2>Welcome to Dashboard</h2>} />

          {/* Category management */}
          <Route path="products/category" element={<CategoryMenu />} />
          <Route path="products/subcategory" element={<SubcategoryMenu />} />

          {/* Add Product */}
          <Route path="products/product" element={<AddProduct />} />
          <Route path="products/product/:id" element={<AddProduct />} />

          {/* All Products */}
          <Route path="products/list" element={<AllProduct />} />

          {/* Filtered product lists */}
          <Route path="products/tshirt" element={<AllProduct category="Tshirt" />} />
          <Route path="products/shirt" element={<AllProduct category="Shirt" />} />
          <Route path="products/casual-shirt" element={<AllProduct category="Casual-Shirt" />} />
          <Route path="products/pant" element={<AllProduct category="Pant" />} />
          <Route path="products/shoes" element={<AllProduct category="Shoes" />} />
          <Route path="products/mens-watch" element={<AllProduct category="Mens Watch" />} />

          {/* Orders */}
          <Route path="orders/all" element={<AllOrders />} />
          <Route path="orders/pending" element={<h2>Pending Orders</h2>} />
          <Route path="orders/processing" element={<h2>Processing Orders</h2>} />
          <Route path="orders/completed" element={<h2>Completed Orders</h2>} />
          <Route path="orders/declined" element={<h2>Declined Orders</h2>} />

          {/* Country / State / City */}
          <Route path="country/state" element={<StateManagement />} />
          <Route path="country/manage-state/:id" element={<ManageState />} />
          <Route path="country/manage-city" element={<ManageCity />} />

          {/* Customer */}
          <Route path="customers/list" element={<CustomerList />} />

          {/* Pages */}
          <Route path="pages/faq" element={<FAQPage />} />
          <Route path="pages/contact-us" element={<ContactUs />} />
          <Route path="pages/other" element={<OtherPages />} />
          <Route path="pages/custom-links" element={<CustomizeMenuLinks />} />

          {/* Coupons */}
          <Route path="coupons" element={<Coupons />} />

          {/* Settings */}
          <Route path="settings/profile" element={<Profile />} />

          {/* Payments */}
          <Route path="payments/checkout" element={<Checkout />} />
          <Route path="settings/payment" element={<Payment />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
