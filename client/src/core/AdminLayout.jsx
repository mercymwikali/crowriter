import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import {
  FaArchive, FaCircle, FaClock, FaDashcube, FaEdit,
  FaFolderOpen, FaHourglass, FaUserPlus, FaUsers,
} from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { BsCashCoin, BsCreditCard, BsDashCircleFill, BsListColumns, Bs0SquareFill } from 'react-icons/bs';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Signout from '../Auth/Signout';
import NotificationBell from '../components/NotificationBell';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

const items = [
  {
    key: '/admin',
    icon: <FaDashcube />,
    label: 'Dashboard',
  },
  {
    key: '/create-order',
    icon: <FaEdit />,
    label: 'New Order',
  },
  {
    key: '/Manage-Jobs',
    icon: <FaFolderOpen />,
    label: 'Jobs',
    children: [
      {
        key: '/manage-jobs/all-jobs',
        icon: <GiProgression />,
        label: 'Listed Jobs',
      },
      {
        key: '/manage-jobs/assigned-jobs',
        icon: <FaHourglass />,
        label: 'Hired Freelancers',
      },
      {
        key: '/manage-jobs/submitted-jobs',
        icon: <FaArchive />,
        label: 'Submitted Jobs',
      },
      {
        key: '/Fines/New-Fine',
        icon: <FaClock />,
        label: 'New Fine',
      },
      {
        key: '/fines/fined-orders',
        icon: <FaCircle />,
        label: 'Fined Orders',
      },
    ],
  },
  {
    key: '/Payments',
    icon: <BsCreditCard />,
    label: 'Payments',
    children: [
      {
        key: '/admin/Payments/Paid-Orders',
        icon: <BsCashCoin />,
        label: 'Paid Invoices',
      },
      {
        key: '/admin/Payments/Unpaid-Orders',
        icon: <BsDashCircleFill />,
        label: 'View Invoices',
      },
    ],
  },
  {
    key: '/admin/Manage-Freelancers',
    icon: <FaUsers />,
    label: 'Freelancers',
    children: [
      {
        key: '/admin/Manage-Freelancers/Freelancers-list',
        icon: <FaUsers />,
        label: 'All Freelancers',
      },
      {
        key: '/admin/Manage-Freelancers/Pending-Freelancers',
        icon: <Bs0SquareFill />,
        label: 'Pending Freelancers',
      },
    ],
  },
  {
    key: '/admin/Manage-Users',
    icon: <FaUserPlus />,
    label: 'Managers',
    children: [
      {
        key: '/admin/Manage-Users/New-Manager',
        icon: <FaUserPlus />,
        label: 'New Manager',
      },
      {
        key: '/admin/Manage-Users/All-Users',
        icon: <BsListColumns />,
        label: 'Managers List',
      },
      {
        key: '/admin/Manage-Users/Pending-Users',
        icon: <FaUserPlus />,
        label: 'Pending Users',
      },
    ],
  },
];

const AdminLayout = () => {
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
          <Breadcrumb.Item>admin</Breadcrumb.Item>
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

export default AdminLayout;
