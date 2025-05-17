import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import "../App.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", values);
      message.success("Registration successful!");

      // Save user data to localStorage after registration (optional)
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/profile");
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="text-3xl mb-8 font-semibold text-center">Register</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }, { min: 6, message: 'Password must be at least 6 characters!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="City" name="city" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} className="w-full">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
