import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { GithubOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Space size="large">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </Space>
        </div>
        <div className="footer-social">
          <Space size="middle">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <GithubOutlined />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined />
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedinOutlined />
            </Link>
          </Space>
        </div>
        <div className="footer-copyright">
          <Text type="secondary">
            © {currentYear} User Management System. All rights reserved.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 