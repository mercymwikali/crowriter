import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, Drawer, Button } from 'antd';
import {
  FaArchive, FaCheckCircle, FaCircle, FaClock, FaDashcube, FaEdit,
  FaFolderOpen, FaHourglass, FaUsers
} from 'react-icons/fa';
import { GiProgression } from "react-icons/gi";
import { RiFolderWarningLine } from "react-icons/ri";
import { Bs0SquareFill, BsCashCoin, BsCreditCard, BsDashCircleFill, BsMenuApp } from "react-icons/bs";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Signout from '../Auth/Signout';
import NotificationBell from '../components/NotificationBell';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

const items = [
  {
    key: '/manager',
    icon: <FaDashcube />,
    label: 'Dashboard'
  },
  {
    key: 'create-order',
    icon: <FaEdit />,
    label: 'New Order',
  },
  {
    key: '/Manage-Jobs',
    icon: <FaFolderOpen />,
    label: 'Manage Jobs',
    children: [
      {
        key: 'manage-jobs/all-jobs',
        icon: <GiProgression />,
        label: 'Listed Jobs',
      },
      {
        key: 'manage-jobs/bids-list',
        icon: <FaCheckCircle />,
        label: 'Bids List',
      },
      {
        key: 'manage-jobs/assigned-jobs',
        icon: <FaHourglass />,
        label: 'Hired Freelancers',
      },
      {
        key: 'manage-jobs/submitted-jobs',
        icon: <FaArchive />,
        label: 'Submitted Jobs',
      },
      // {
      //   key: '/Manage-Jobs/Cancelled-Jobs',
      //   icon: <MdOutlineCancelPresentation />,
      //   label: 'Cancelled Jobs',
      // },
    ]
  },
  {
    key: '/Payments',
    icon: <BsCreditCard />,
    label: 'Payments',
    children: [
      {
        key: 'payments/paid-orders',
        icon: <BsCashCoin />,
        label: 'Paid Invoices',
      },
      {
        key: 'payments/unpaid-orders',
        icon: <BsDashCircleFill />,
        label: 'View Invoices',
      },
    ]
  },
  {
    key: '/Fines',
    icon: <RiFolderWarningLine />,
    label: 'Fined Orders',
    children: [
      // {
      //   key: '/Fines/New-Fine',
      //   icon: <FaClock />,
      //   label: 'New Fine',
      // },
      {
        key: 'fines/fined-orders',
        icon: <FaCircle />,
        label: 'Fined Orders',
      },
    ]
  },
  {
    key: '/Manage-Freelancers',
    icon: <FaUsers size={20} />,
    label: 'Manage Freelancers',
    children: [
      {
        key: 'manage-freelancers/freelancers-list',
        icon: <FaUsers size={20} />,
        label: 'All Freelancers',
      },
      {
        key: 'manage-freelancers/pending-freelancers',
        icon: <Bs0SquareFill />,
        label: 'Pending Freelancers',
      },
    ]
  },
];

const ManagerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setDrawerVisible(false); // Close the drawer when an item is clicked
  };

  // Determine the open keys based on the current path
  const openKeys = items
    .filter(item => item.children)
    .map(item => item.key);

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', zIndex: 1, width: '100%' }}>
        <Button className="menu-button" type="primary" onClick={() => setDrawerVisible(true)} ghost>
          <BsMenuApp />
        </Button>
        <div className="horizontal-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            // defaultOpenKeys={}
            style={{ minWidth: 0, display: 'flex', flexWrap: 'wrap' }}
            onClick={handleMenuClick}
          >
            {items.map(item => {
              if (item.children) {
                return (
                  <SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map(child => (
                      <Menu.Item key={child.key} icon={child.icon}>
                        {child.label}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                  </Menu.Item>
                );
              }
            })}
          </Menu>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '2px' }}>
          <div style={{ cursor: 'pointer', marginRight: '20px', color: '#fff', gap: '19px', display: 'flex', alignItems: 'center' }}>
            <NotificationBell />
          </div>
          <Signout />
        </div>
      </Header>

      <Drawer
        title="Menu"
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        className="drawer-menu"
      >
        <Menu mode="inline" selectedKeys={[location.pathname]} onClick={handleMenuClick}>
          {items.map(item => {
            if (item.children) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map(child => (
                    <Menu.Item key={child.key} icon={child.icon}>
                      {child.label}
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Drawer>

      <Content style={{ padding: '0 48px', marginTop: 64, zIndex: 0, overflow: 'auto', overflowY: 'scroll' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>Manager</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', minHeight: 'calc(100vh - 44px)', padding: 14 }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Crowriters ©{new Date().getFullYear()} Created by MayFair
      </Footer>
    </Layout>
  );
};

export default ManagerLayout;
