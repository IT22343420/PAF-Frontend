import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        headline: '',
        password: '',
    });
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setError('');
        setSuccess('');
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setError('');
        setSuccess('');
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(true);

        try {
            const response = await AuthService.registerUser(formData);
            console.log('Registration successful:', response.data);
            setSuccess('Registration successful! You can now login.');
            setFormData({
                firstName: '',
                lastName: '',
                userName: '',
                headline: '',
                password: '',
            });
            setValidated(false);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            const errorMessage = err.response && err.response.data ? err.response.data : 'Registration failed. Please try again.';
            console.error('Registration error:', errorMessage);
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Row>
                <Col md={12} lg={12} style={{width: '500px'}}>
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <h2 className="text-center mb-4">Register</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" controlId="formGridFirstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Enter first name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please enter your first name.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formGridLastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Enter last name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please enter your last name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3" controlId="formGridUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Choose a username"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formGridHeadline">
                                    <Form.Label>Headline</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., Software Engineer | Passionate Cook"
                                        name="headline"
                                        value={formData.headline}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formGridPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Create a password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please create a password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Register
                                </Button>
                            </Form>
                            <div className="mt-3 text-center">
                                Already have an account? <a href="/login">Login here</a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterForm; 