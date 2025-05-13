import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setError('');
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(true);

        try {
            const response = await AuthService.loginUser({ userName, password });
            console.log('Login successful:', response.data);
            // Store the token and user data
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userName', response.data.userName);
            localStorage.setItem('name', response.data.name);
            navigate('/home'); 
        } catch (err) {
            const errorMessage = err.response && err.response.data ? err.response.data : 'Login failed. Please check your credentials.';
            console.error('Login error:', errorMessage);
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Row>
                <Col md={12} lg={12} style={{width: '400px'}}>
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter username"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your username.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Login
                                </Button>
                            </Form>
                            <div className="mt-3 text-center">
                                Don't have an account? <a href="/register">Register here</a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm; 