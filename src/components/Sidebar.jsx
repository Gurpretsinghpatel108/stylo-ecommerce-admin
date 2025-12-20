// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaTags,
  FaCog,
  FaChartLine,
  FaSignOutAlt,
  FaChevronDown,
  FaGlobe,
  FaQuestionCircle,
  FaPhone,
  FaFileAlt,
  FaLink,
  FaUser,
  FaLock,
  FaCreditCard,
  FaBell,
  FaSlidersH,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isPageOpen, setIsPageOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/products")) setIsProductOpen(true);
    if (location.pathname.startsWith("/dashboard/orders")) setIsOrderOpen(true);
    if (location.pathname.startsWith("/dashboard/country")) setIsCountryOpen(true);
    if (location.pathname.startsWith("/dashboard/customers")) setIsCustomerOpen(true);
    if (location.pathname.startsWith("/dashboard/pages")) setIsPageOpen(true);
    if (location.pathname.startsWith("/dashboard/settings")) setIsSettingsOpen(true);
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <h2 className="logo">ShopMaster</h2>
      <ul>
        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaTachometerAlt className="icon" /> Dashboard
          </NavLink>
        </li>

        {/* Country with submenu */}
        <li>
          <div
            className={`nav-link submenu-toggle ${
              location.pathname.startsWith("/dashboard/country") ? "active" : ""
            }`}
            onClick={() => setIsCountryOpen(!isCountryOpen)}
          >
            <FaGlobe className="icon" /> Manage Country
            <FaChevronDown className={`chevron ${isCountryOpen ? "rotate" : ""}`} />
          </div>
          {isCountryOpen && (
            <ul id="submenu">
              <li>
                <NavLink
                  to="/dashboard/country/state"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Country
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/country/manage-state/1"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Manage State
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/country/manage-city"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Manage City
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Products with submenu */}
        <li>
          <div
            className={`nav-link submenu-toggle ${
              location.pathname.startsWith("/dashboard/products") ? "active" : ""
            }`}
            onClick={() => setIsProductOpen(!isProductOpen)}
          >
            <FaBoxOpen className="icon" /> Products
            <FaChevronDown className={`chevron ${isProductOpen ? "rotate" : ""}`} />
          </div>
          {isProductOpen && (
            <ul id="submenu">
              <li>
                <NavLink
                  to="/dashboard/products/category"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Category
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/products/subcategory"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Subcategory
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/products/product"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Add Product
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/products/list"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active big-link" : "nav-link sub-link big-link"
                  }
                >
                  All Products
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Orders with submenu */}
        <li>
          <div
            className={`nav-link submenu-toggle ${
              location.pathname.startsWith("/dashboard/orders") ? "active" : ""
            }`}
            onClick={() => setIsOrderOpen(!isOrderOpen)}
          >
            <FaShoppingCart className="icon" /> Orders
            <FaChevronDown className={`chevron ${isOrderOpen ? "rotate" : ""}`} />
          </div>
          {isOrderOpen && (
            <ul id="submenu">
              <li>
                <NavLink
                  to="/dashboard/orders/all"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  All Orders
                </NavLink>
              </li>

              {/* YE 4 LINES COMMENT KAR DI — TU JO BOLA THA */}
              {/* <li>
                <NavLink
                  to="/dashboard/orders/pending"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Pending Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/orders/processing"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Processing Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/orders/completed"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Completed Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/orders/declined"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Declined Orders
                </NavLink>
              </li> */}
            </ul>
          )}
        </li>

        {/* Baaki sab same hai — kuch nahi chheda */}
        {/* Customers with submenu */}
        <li>
          <div
            className={`nav-link submenu-toggle ${
              location.pathname.startsWith("/dashboard/customers") ? "active" : ""
            }`}
            onClick={() => setIsCustomerOpen(!isCustomerOpen)}
          >
            <FaUsers className="icon" /> Customers
            <FaChevronDown className={`chevron ${isCustomerOpen ? "rotate" : ""}`} />
          </div>
          {isCustomerOpen && (
            <ul id="submenu">
              <li>
                <NavLink
                  to="/dashboard/customers/list"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Customer List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/customers/withdraws"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Withdrawals
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/customers/default-image"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  Default Image
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Pages menu */}
        <li>
          <div
            className={`nav-link submenu-toggle ${
              location.pathname.startsWith("/dashboard/pages") ? "active" : ""
            }`}
            onClick={() => setIsPageOpen(!isPageOpen)}
          >
            <FaTags className="icon" /> Menu Page Setting
            <FaChevronDown className={`chevron ${isPageOpen ? "rotate" : ""}`} />
          </div>
          {isPageOpen && (
            <ul id="submenu">
              <li>
                <NavLink
                  to="/dashboard/pages/faq"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaQuestionCircle className="icon" /> FAQ Page
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pages/contact-us"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaPhone className="icon" /> Contact Us Page
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pages/other"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaFileAlt className="icon" /> Other Pages
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pages/custom-links"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaLink className="icon" /> Customize Menu Links
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Coupons */}
        <li>
          <NavLink
            to="/dashboard/coupons"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <FaTags className="icon" /> Coupons
          </NavLink>
        </li>

        {/* Analytics */}
        <li>
          <NavLink
            to="/dashboard/analytics"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <FaChartLine className="icon" /> Analytics
          </NavLink>
        </li>

        {/* Settings with submenu */}
        <li>
          <div
            className={`nav-link submenu-toggle ${
              location.pathname.startsWith("/dashboard/settings") ? "active" : ""
            }`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <FaCog className="icon" /> Settings
            <FaChevronDown className={`chevron ${isSettingsOpen ? "rotate" : ""}`} />
          </div>
          {isSettingsOpen && (
            <ul id="submenu">
              <li>
                <NavLink
                  to="/dashboard/settings/profile"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaUser className="icon" /> Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/settings/security"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaLock className="icon" /> Security
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/settings/payment"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaCreditCard className="icon" /> Payment
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/settings/notifications"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaBell className="icon" /> Notifications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/settings/general"
                  className={({ isActive }) =>
                    isActive ? "nav-link sub-link active" : "nav-link sub-link"
                  }
                >
                  <FaSlidersH className="icon" /> General
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Logout */}
        <li>
          <NavLink to="/login" className="nav-link">
            <FaSignOutAlt className="icon" /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;