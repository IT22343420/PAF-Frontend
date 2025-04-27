import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HomePage from './pages/HomePage';
import './App.css';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="layout">
        <Navigation />
        <Content className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Router>
  );
};

export default App;
