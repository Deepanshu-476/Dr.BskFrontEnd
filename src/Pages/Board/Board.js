import React from 'react';
import './Board.css';
import Admin from '../../components/Admin/Admin';

const Board = () => {
  return (
    <>
    <Admin />
    <>
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>1,234</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>567</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>890</p>
        </div>
      </div>
    </div>
    </>
    </>
  );
};

export default Board;