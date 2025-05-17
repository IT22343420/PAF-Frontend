import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, Select, Space, Modal, message, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, LogoutOutlined, UserOutlined, MailOutlined, HomeOutlined, BookOutlined, BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Profile.css';
import 'antd/dist/reset.css'; // for Ant Design v5 styling


const { Option } = Select;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) {
        navigate('/login');
        return;
      }
      try {
        const userObj = JSON.parse(userStr);
        const userId = userObj._id || userObj.id;
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data.user);
        setLoading(false);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userData);
  };

  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem('token');
      // Use id or _id, whichever exists
      const userId = userData._id || userData.id;
      const res = await axios.put(`http://localhost:5000/api/users/${userId}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.user);
      message.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  const handleDelete = () => {
  console.log("Delete button clicked");

  Modal.confirm({
    title: 'Delete Profile',
    content: 'Are you sure you want to delete your profile? This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      const token = localStorage.getItem('token');
      const userId = userData._id || userData.id;

      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.success('Profile deleted successfully!');
        navigate('/login');
      } catch (err) {
        console.error(err);
        message.error('Failed to delete profile.');
      }
    },
    onCancel() {
      console.log('Delete cancelled');
    },
  });
};
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Sidebar navigation handlers
  const goToLearningPlans = () => navigate('/learning-plans');
  const goToLearningProgress = () => navigate('/learning-progress');
  const goToBadges = () => navigate('/badges');

  if (loading || !userData) return <div className="profile-container"><Card>Loading...</Card></div>;

  return (
    <div className="profile-page-layout">
      {/* Left Sidebar */}
      <div className="profile-sidebar">
        <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
        <div className="profile-sidebar-name">{userData.name}</div>
        <div className="profile-sidebar-email">{userData.email}</div>
        <div className="profile-sidebar-links">
          <div className="profile-sidebar-link selected" onClick={goToLearningPlans}>
            <BookOutlined style={{ marginRight: 8 }} />
            My Learning Plans
          </div>
          <div className="profile-sidebar-link" onClick={goToLearningProgress}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            My Learning Progress
          </div>
          <div className="profile-sidebar-link" onClick={goToBadges}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            My Badges
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main-content">
        <Card
          title="Profile Information"
          extra={
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                disabled={isEditing}
              >
                Edit
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          }
        >
          {isEditing ? (
            <Form
              form={form}
              onFinish={handleSave}
              layout="vertical"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select your role!' }]}
              >
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <Input prefix={<HomeOutlined />} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <div className="profile-info">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
              <p><strong>City:</strong> {userData.city}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
