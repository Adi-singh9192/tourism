import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaUsers,
  FaUserFriends,
  FaHotel,
  FaBell,
  FaMapMarkerAlt,
  FaChartLine,
  FaSignOutAlt,
  FaQrcode,
  FaSimCard
} from "react-icons/fa";
import { RxDashboard } from 'react-icons/rx';
const Header = ({ isAdmin, onLogout }) => {
  const location = useLocation()

  const userNavItems = [
    { path: '/', label: 'Home', icon: <FaMapMarkerAlt /> },
    { path: '/footfall', label: 'Footfall', icon: <FaChartLine /> },
    {
      path: '/tickets',
      label: 'Tickets',
      icon: <FaQrcode />, // 🎟 Online Ticket + QR Check-in
    },
    { path: '/hotels', label: 'Hotels', icon: <FaHotel /> },
    { path: '/heatmap', label: 'Heatmap', icon: <FaMapMarkerAlt /> },
    {
      path: '/tourist-services',
      label: 'Services',
      icon: <FaSimCard />, // 📶 SIM + Help + Support
    },
  ]

  const adminNavItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <RxDashboard />, // 📊 Overview
    },
    {
      path: "/admin/footfall",
      label: "Footfall",
      icon: <FaUsers />, // 👥 Crowd / footfall
    },
    {
      path: "/admin/visitors",
      label: "Visitors",
      icon: <FaUserFriends />, // 🧍 Visitor analytics
    },
    {
      path: "/admin/hotels",
      label: "Hotels",
      icon: <FaHotel />, // 🏨 Hotels
    },
    {
      path: "/admin/alerts",
      label: "Alerts",
      icon: <FaBell />, // 🚨 Alerts
    },
  ];


  const navItems = isAdmin ? adminNavItems : userNavItems
  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* ================= HEADER (DESKTOP) ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-green-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-xl">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                  Rajasthan Tourism
                </h1>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Admin Portal' : 'Tourist Portal'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${isActive(item.path)
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>

                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Admin Logout */}
            {isAdmin && (
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition ring-1 ring-black"
              >
                <FaSignOutAlt />
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= FOOTER NAV (MOBILE) ================= */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 backdrop-blur-lg">
        <div className="flex justify-between items-center px-2 py-3">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex justify-center"
              >
                <div
                  className={`
            flex flex-col items-center justify-center gap-0.5
            px-3 py-2 rounded-xl
            transition-all duration-200
            ${active
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-500 hover:text-gray-900"
                    }
          `}
                >
                  <span
                    className={`text-2xl h-10 ${active ? "scale-110" : ""
                      } transition-transform`}
                  >
                    {item.icon}
                  </span>

                  <span className="text-[11px] font-medium leading-none">
                    {item.label}
                  </span>

                  {/* {active && (
                    <span className="mt-0.5 h-1 w-5 rounded-full bg-primary-600"></span>
                  )} */}
                </div>
              </Link>
            );
          })}
        </div>

      </footer>
    </>
  )
}

export default Header
