import React from 'react';
import { Button, Card, Row, Col, Typography, Statistic, Carousel, Avatar, Space } from 'antd';
import { 
  TeamOutlined, 
  BookOutlined, 
  TrophyOutlined, 
  ArrowRightOutlined,
  UserOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Skill Sharing',
      description: 'Share your expertise and learn from others in a collaborative environment.',
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
    },
    {
      title: 'Learning Paths',
      description: 'Follow structured learning paths to master new skills and advance your career.',
      icon: <BookOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
    },
    {
      title: 'Achievements',
      description: 'Earn badges and certificates as you progress through your learning journey.',
      icon: <TrophyOutlined style={{ fontSize: '32px', color: '#faad14' }} />
    }
  ];

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Software Developer',
      content: 'This platform has transformed my learning experience. The community is amazing!',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    {
      name: 'Jane Smith',
      role: 'Data Scientist',
      content: 'The skill sharing features helped me learn new technologies quickly and effectively.',
      avatar: 'https://joeschmoe.io/api/v1/random'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Learn, Share, and Grow Together
          </Title>
          <Paragraph className="hero-description">
            Join our community of learners and experts. Share your knowledge, learn new skills,
            and advance your career in a collaborative environment.
          </Paragraph>
          <Space>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Space>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-row">
          <div className="stat-box stat-learners">
            <span className="stat-icon"><UserOutlined /></span>
            <span className="stat-title">Active Learners</span>
            <span className="stat-value">10,000</span>
          </div>
          <div className="stat-box stat-courses">
            <span className="stat-icon"><BookOutlined /></span>
            <span className="stat-title">Courses Available</span>
            <span className="stat-value">500</span>
          </div>
          <div className="stat-box stat-hours">
            <span className="stat-icon"><ClockCircleOutlined /></span>
            <span className="stat-title">Hours of Learning</span>
            <span className="stat-value">10,000</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Title level={2} className="section-title">Why Choose Our Platform</Title>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => {
            let cardClass = "feature-card";
            if (feature.title === "Skill Sharing") cardClass += " skill-sharing";
            if (feature.title === "Learning Paths") cardClass += " learning-paths";
            if (feature.title === "Achievements") cardClass += " achievements";
            return (
              <Col xs={24} sm={8} key={index}>
                <Card className={cardClass}>
                  {feature.icon}
                  <Title level={3}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>

      {/* Popular Courses Section */}
      <section className="courses-section">
        <Title level={2} className="section-title">Popular Learning Paths</Title>
        <Row gutter={[32, 32]}>
          {[
            {
              title: "Web Development Fundamentals",
              description: "Master the basics of web development",
              img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "Cooking Materials",
              description: "Explore essential cooking techniques and recipes",
              img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "Basic Photography Sessions",
              description: "Learn the fundamentals of photography and camera handling",
              img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
            }
          ].map((course, idx) => (
            <Col xs={24} sm={8} key={idx}>
              <Card
                hoverable
                cover={
                  <img
                    alt="course"
                    src={course.img}
                  />
                }
              >
                <Meta
                  title={course.title}
                  description={course.description}
                />
                <div className="course-meta">
                  <span><StarOutlined /> 4.8</span>
                  <span><UserOutlined /> 1.2k students</span>
                </div>
                <Button type="link" className="course-link">
                  Learn More <ArrowRightOutlined />
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Title level={2} className="section-title">What Our Users Say</Title>
        <Carousel autoplay>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-slide">
              <Card className="testimonial-card">
                <Avatar size={64} src={testimonial.avatar} />
                <Paragraph className="testimonial-content">
                  "{testimonial.content}"
                </Paragraph>
                <Title level={4}>{testimonial.name}</Title>
                <Paragraph type="secondary">{testimonial.role}</Paragraph>
              </Card>
            </div>
          ))}
        </Carousel>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Title level={2}>Ready to Start Your Learning Journey?</Title>
        <Paragraph>
          Join thousands of learners who are already advancing their careers with our platform.
        </Paragraph>
        <Button 
          type="primary" 
          size="large"
          onClick={() => navigate('/register')}
        >
          Join Now
        </Button>
      </section>
    </div>
  );
};

export default HomePage; 