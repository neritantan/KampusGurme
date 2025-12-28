import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="nav-bar">
      <NavLink to="/home" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-house"></i>
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-calendar-days"></i>
      </NavLink>
      <NavLink to="/stats" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-trophy"></i>
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-chart-pie"></i>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-user"></i>
      </NavLink>
    </nav>
  );
};

export default BottomNav;