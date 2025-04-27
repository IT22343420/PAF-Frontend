import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './Navigation.css';

const { Header } = Layout;

const Navigation = () => {
  const navigate = useNavigate();
  const isAuthenticated = false; // TODO: Replace with actual authentication state

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => navigate('/login')}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header">
      <div className="logo">
        <Link to="/">SkillSphere</Link>
      </div>
      <Menu theme="dark" mode="horizontal" className="nav-menu">
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {!isAuthenticated ? (
          <>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/register">Register</Link>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item key="profile">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        )}
      </Menu>
      {isAuthenticated && (
        <div className="user-menu">
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="text" icon={<Avatar icon={<UserOutlined />} />} />
          </Dropdown>
        </div>
      )}
    </Header>
  );
};

export default Navigation; 