import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import {
  FaArchive, FaCircle, FaClock, FaDashcube, FaEdit,
  FaFolderOpen, FaHourglass, FaUserPlus, FaUsers,
} from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { BsCashCoin, BsCreditCard, BsDashCircleFill } from 'react-icons/bs';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Signout from '../Auth/Signout';
import NotificationBell from '../components/NotificationBell';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

const items = [
  {
    key: '/freelancer',
    icon: <FaDashcube />,
    label: 'Dashboard',
  },
  {
    key: '/freelancer/Available-Jobs',
    icon: <FaFolderOpen />,
    label: 'Available Jobs',
  },
  {
    key: '/freelancer/My-Bids',
    icon: <GiProgression />,
    label: 'My Bids',
  },
  {
    key: '/freelancer/Jobs',
    icon: <FaFolderOpen />,
    label: 'Jobs',
    children: [
      {
        key: '/freelancer/Jobs/Assigned-Jobs',
        icon: <FaHourglass />,
        label: 'Assigned Jobs',
      },
      {
        key: '/freelancer/Jobs/Submitted-Jobs',
        icon: <FaArchive />,
        label: 'Completed Jobs',
      },
    ],
  },
  {
    key: '/freelancer/Fined-Orders',
    icon: <FaCircle />,
    label: 'Fined Orders',
  },
  {
    key: '/freelancer/Payments',
    icon: <BsCreditCard />,
    label: 'Payments',
    children: [
      {
        key: '/freelancer/Payments/Create-Invoice',
        icon: <FaEdit />,
        label: 'Create Invoice',
      },
      {
        key: '/freelancer/Payments/Paid-Orders',
        icon: <BsCashCoin />,
        label: 'Paid Invoices',
      },
      {
        key: '/freelancer/Payments/Unpaid-Orders',
        icon: <BsDashCircleFill />,
        label: 'Pending Invoices',
      },
    ],
  },
];

const FreelancerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // Determine the open keys based on the current path
  const openKeys = items
    .filter(item => item.children)
    .map(item => item.key);

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="horizontal-menu" style={{ flex: 1 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            // defaultOpenKeys={openKeys}
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
          <div style={{ cursor: 'pointer', marginRight: '15px', color: '#fff', gap: '19px', display: 'flex', alignItems: 'center' }}>
            <NotificationBell />
          </div>
          <Signout />
        </div>
      </Header>

      <Content style={{ padding: '0 48px', marginTop: 64, zIndex: 0, overflow: 'auto', overflowY: 'scroll' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>freelancer</Breadcrumb.Item>
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

export default FreelancerLayout;
