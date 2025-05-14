import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import "../App.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/users/login", values);
      message.success("Login successful!");

      // Store full user object in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/profile");
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="text-3xl mb-8 font-semibold text-center">Login</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} className="w-full">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
