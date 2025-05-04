import React from 'react';
import { Card, Button, Row, Col, Badge, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PencilSquare, Trash, Heart, Chat } from 'react-bootstrap-icons';
import PostService from '../../services/postService';

const SinglePost = ({ post, profileImage, onDelete, onSetNotification }) => {
    const { id, userName, headline, title, description, filePaths, tags, createdAt } = post;
    const navigate = useNavigate();
    const handleLike = () => {
        console.log('Like button clicked');
    };

    const handleComment = () => {
        console.log('Comment button clicked');
    };

    const handleEdit = () => {
        navigate(`/editPost/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await PostService.deletePostById(id);
                if (onDelete) {
                    onDelete(id);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                onSetNotification({
                    message: 'Failed to delete post. Please try again.',
                    type: 'danger'
                });
            }
        }
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Row>
                            {/* Left Component */}
                            <Col md={4} className="position-relative">
                                <div className="d-flex align-items-center mb-2">
                                    <img 
                                        src={profileImage} 
                                        alt="Profile" 
                                        className="rounded-circle me-2"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div className="fw-bold">{userName}</div>
                                        <div className="text-muted small">{headline}</div>
                                    </div>
                                </div>
                                
                                {filePaths && filePaths.length > 0 && (
                                    <Carousel className="mb-2">
                                        {filePaths.map((filePath, index) => {
                                            const isVideo = filePath.toLowerCase().endsWith('.mp4') || 
                                                          filePath.toLowerCase().endsWith('.webm') ||
                                                          filePath.toLowerCase().endsWith('.ogg');
                                            
                                            return (
                                                <Carousel.Item key={index}>
                                                    {isVideo ? (
                                                        <video
                                                            controls
                                                            className="d-block w-100"
                                                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                                                        >
                                                            <source src={filePath} type={`video/${filePath.split('.').pop()}`} />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <img
                                                            src={filePath}
                                                            alt={`Media ${index + 1}`}
                                                            className="d-block w-100"
                                                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </Carousel.Item>
                                            );
                                        })}
                                    </Carousel>
                                )}

                                <div className="position-absolute bottom-0 start-0 w-100 d-flex gap-2 p-2">
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        className="d-flex align-items-center gap-1"
                                        onClick={handleLike}
                                    >
                                        <Heart size={16} />
                                        <span>Like</span>
                                    </Button>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="d-flex align-items-center gap-1"
                                        onClick={handleComment}
                                    >
                                        <Chat size={16} />
                                        <span>Comment</span>
                                    </Button>
                                </div>
                            </Col>

                            {/* Right Component */}
                            <Col md={8}>
                                <h3 className="mb-3">{title}</h3>
                                <p className="text-muted mb-4">{description}</p>
                                <p className="text-muted fst-italic fw-bold mb-4 text-end">
                                    Posted on {new Date(createdAt).toLocaleDateString()}
                                </p>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div className="d-flex flex-wrap gap-2">
                                        {tags && tags.map((tag, index) => (
                                            <Badge 
                                                key={index} 
                                                bg="secondary" 
                                                className="p-2 tag-badge"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-3">
                                        <PencilSquare 
                                            size={20} 
                                            className="text-primary" 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={handleEdit}
                                        />
                                        <Trash 
                                            size={20} 
                                            className="text-danger" 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={handleDelete}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
            <style jsx>{`
                .tag-badge {
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .tag-badge:hover {
                    background-color: #0d6efd !important;
                }
            `}</style>
        </Card>
    );
};

export default SinglePost;