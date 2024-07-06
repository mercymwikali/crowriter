import React, { useState, useEffect } from 'react';
import Typography from 'antd/es/typography/Typography';
import useAuth from '../hooks/useAuth';
import { Card } from 'antd';
import { MdHome } from 'react-icons/md';
import { RiHome3Fill, RiMoneyEuroCircleLine } from 'react-icons/ri';
import { BsCheck2Circle } from 'react-icons/bs';
import MyPaidInv from './MyPaidInv';
import PaidInvoices from './PaidInvoices';

const ManagerDashboard = () => {
  const userInfo = useAuth().user;
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update currentDateTime every second
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures effect runs only on mount

  // Function to format date in "16th June 2024" format
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Function to format time in "hh:mm:ss AM/PM" format
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour12: true });
  };

  // Function to get the suffix for the day (e.g., 1st, 2nd, 3rd, 4th)
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  // Function to format date and time as required
  const formatDateTime = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString('default', { month: 'long' });
    const year = formattedDate.getFullYear();
    const suffix = getDaySuffix(day);
    const formattedTime = formatTime(date);

    return `${day}${suffix} ${month} ${year}, ${formattedTime}`;
  };

  const jobCount = 0;

  return (
    <>
      <Typography.Title level={3} className='text-start mt-3 px-3' style={{ color: '#001529' }}>
        Welcome Back: {userInfo.fname}
      </Typography.Title>
      <span className='text-start px-3 fw-medium'>{formatDateTime(currentDateTime)}</span>

      <div className="row">
        <div className="col-6 col-md-3">
          <Card className="m-3" style={{ width: '16rem', backgroundColor: '#e6f8d1' }} bordered={false}>
            <div className="d-flex flex-row align-items-start justify-content-between">
              <div className="d-flex flex-column">
                <RiMoneyEuroCircleLine size={30} style={{ color: '#7DA0FA' }} />
                <Typography.Text style={{ color: '#34b1AA', marginTop: '6px', marginBottom: '0' }}>Bids List</Typography.Text>
                <Typography.Title level={5} style={{ marginBottom: '0', color: '#34b1AA' }}>{jobCount}</Typography.Title>
              </div>
              <div className="ms-3">
                <Typography.Text
                  style={{
                    color: '#fff',
                    marginBottom: '0',
                    backgroundColor: '#9fcc2e',
                    padding: '9px',
                    borderRadius: '22px',
                    position: 'absolute',
                    top: '15px',
                    right: '10px'
                  }}
                >
                  Pending Bids 
                </Typography.Text>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="m-3" style={{ width: '16rem', backgroundColor: '#fef0da' }}>
            <div className="d-flex flex-row align-items-start justify-content-between">
              <div className="d-flex flex-column">
                <BsCheck2Circle size={30} style={{ color: '#9fcc2e' }} />
                <Typography.Text style={{ color: '#34b1AA', marginTop: '6px', marginBottom: '0' }}>Jobs</Typography.Text>
                <Typography.Title level={5} style={{ marginBottom: '0', color: '#34b1AA' }}>{jobCount}</Typography.Title>
              </div>
              <div className="ms-3">
                <Typography.Text
                  style={{
                    color: '#fff',
                    marginBottom: '0',
                    backgroundColor: '#FE9496',
                    padding: '9px',
                    borderRadius: '22px',
                    position: 'absolute',
                    top: '15px',
                    right: '10px'
                  }}
                >
                  Completed
                </Typography.Text>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-6 col-md-3">
            <Card className="m-3" style={{ width: '16rem', backgroundColor: '#d0e0fc' }}>
            <div className="d-flex flex-row align-items-start justify-content-between">
              <div className="d-flex flex-column">
                <RiHome3Fill size={30} style={{ color: '#9fcc2e' }} />
                <Typography.Text style={{ color: '#9fcc2e', marginTop: '6px', marginBottom: '0' }}>Jobs</Typography.Text>
                <Typography.Title level={5} style={{ marginBottom: '0', color: '#34b1AA' }}>{jobCount}</Typography.Title>
              </div>
              <div className="ms-3">
                <Typography.Text
                  style={{
                    color: '#fff',
                    marginBottom: '0',
                    backgroundColor: '#7DA0FA',
                    padding: '9px',
                    borderRadius: '22px',
                    position: 'absolute',
                    top: '15px',
                    right: '10px'
                  }}
                >
                  Active Jobs
                </Typography.Text>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-6 col-md-3">
           <Card className="m-3" style={{ width: '16rem', backgroundColor: '#feffdb' }} bordered={false}>
            <div className="d-flex flex-row align-items-start justify-content-between">
              <div className="d-flex flex-column">
                <RiMoneyEuroCircleLine size={30} style={{ color: '#FE9496' }} />
                <Typography.Text style={{ color: '#34b1AA', marginTop: '6px', marginBottom: '0' }}>Invoices</Typography.Text>
                <Typography.Title level={5} style={{ marginBottom: '0', color: '#34b1AA' }}>{jobCount}</Typography.Title>
              </div>
              <div className="ms-3">
                <Typography.Text
                  style={{
                    color: '#fff',
                    marginBottom: '0',
                    backgroundColor: '#fcf727',
                    padding: '9px',
                    borderRadius: '22px',
                    position: 'absolute',
                    top: '15px',
                    right: '10px'
                  }}
                >
                  Payment
                </Typography.Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-5 px-3">
        <PaidInvoices />
      </div>
    </>
  );
};

export default ManagerDashboard;
