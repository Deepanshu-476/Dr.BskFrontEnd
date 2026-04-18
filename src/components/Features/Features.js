
import React from 'react';
import './Features.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate('/fever');
  // };

  const handleClick = (filterByPrescription = false) => {
    navigate('/fever', { state: { filterByPrescription } });
  };


  return (
    <div className="container-fluid featurs ">
      <div className="container py-5">
        <div className="featurs-row">
          {/* Feature Card */}
          <div
            className="featurs-item  rounded p-4"
            onClick={() => handleClick(false)}
            style={{ cursor: 'pointer' }}
          >
            <div className="featurs-icon">
              <img
                src="/medicine.png"
                alt="Order Medicine"
              />
            </div>
            <div className="featurs-content">
              <h5>Order Medicine</h5>
              <p className="mb-0">Order our generic medicines</p>
            </div>
          </div>

          {/* Feature Card */}
          <div className="featurs-item  rounded p-4" onClick={() => navigate('/fever')}
            style={{ cursor: 'pointer' }}>
            <div className="featurs-icon">
              <img src="/prescription.png" alt="No Prescription" />
            </div>
            <div className="featurs-content">
              <h5>No Prescription</h5>
              <p className="mb-0">Consult an experienced doctor for prescription</p>
            </div>
          </div>

          {/* Feature Card */}
          <div className="featurs-item  rounded p-4"
            style={{ cursor: 'pointer' }}>
            {/* <NavLink to='OrderPage' className='textDecorNone'>
              <div className="featurs_item1 text-center rounded p-4"
                style={{ cursor: 'pointer' }}>
                <div className="featurs-icon">
                  <img src="https://app.davaindia.com/images/QuickActions/PrevBought.gif" alt="Previously Bought" />
                </div>
                <div className="featurs-content">
                  <h5 >Previously Bought</h5>
                  <p className="mb-0 ">Check your previously bought items</p>
                </div>
              </div>
            </NavLink> */}

            <div onClick={() => navigate('/OrderPage')} className='textDecorNone'>
              <div className="featurs_item1 rounded "
                style={{ cursor: 'pointer' }}>
                <div className="featurs-icon">
                  <img src="/previouslybought.png" alt="Previously Bought" />
                </div>
                <div className="featurs-content">
                  <h5 >Previously Bought</h5>
                  <p className="mb-0 ">Check your previously bought items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card */}
          <div className="featurs-item  rounded p-4"
            style={{ cursor: 'pointer' }}>
            <div className="featurs-icon">
              <img src="/dealsforyou.png" alt="Deals For You" />
            </div>
            <div className="featurs-content">
              <h5>Deals For You</h5>
              <p className="mb-0">Check special deals for you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;