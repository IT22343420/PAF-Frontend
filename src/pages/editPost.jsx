import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Image, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import PostService from '../services/postService';
import Notification from '../components/common/Notification';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/');
        }
      }, [navigate]);
    
    const [userName, setUserName] = useState('');
    const [headline, setHeadline] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [existingFilePaths, setExistingFilePaths] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await PostService.findPostById(id);
                const post = response.data;
                setUserName(post.userName);
                setHeadline(post.headline);
                setTitle(post.title);
                setDescription(post.description);
                setTags(post.tags || []);
                setExistingFilePaths(post.filePaths || []);
            } catch (error) {
                console.error('Error fetching post:', error);
                setNotification({
                    message: 'Failed to load post. Please try again.',
                    type: 'danger'
                });
            }
        };

        fetchPost();
    }, [id]);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingFilePaths.length + mediaFiles.length > 3) {
            setNotification({
                message: 'You can only upload up to 3 files',
                type: 'danger'
            });
            return;
        }

        const newMediaFiles = [...mediaFiles];
        const newPreviews = [...previews];

        files.forEach(file => {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                newMediaFiles.push(file);
                if (file.type.startsWith('image/')) {
                    newPreviews.push({
                        type: 'image',
                        url: URL.createObjectURL(file)
                    });
                } else {
                    newPreviews.push({
                        type: 'video',
                        url: URL.createObjectURL(file)
                    });
                }
            }
        });

        setMediaFiles(newMediaFiles);
        setPreviews(newPreviews);
    };

    const handleRemoveExistingMedia = async (index) => {
        try {
            const newFilePaths = [...existingFilePaths];
            newFilePaths.splice(index, 1);
            setExistingFilePaths(newFilePaths);
        } catch (error) {
            console.error('Error removing media:', error);
            setNotification({
                message: 'Failed to remove media. Please try again.',
                type: 'danger'
            });
        }
    };

    const handleRemoveNewMedia = (index) => {
        const newMediaFiles = [...mediaFiles];
        const newPreviews = [...previews];
        
        newMediaFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setMediaFiles(newMediaFiles);
        setPreviews(newPreviews);
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('headline', headline);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);

        // Append new media files
        let index = 0;
        mediaFiles.forEach((file) => {
            formData.append(`mediaFile${index}`, file);
            index++;
        });

        try {
            // Append existing media files
            const existingFilesPromises = existingFilePaths.map(async (filePath, indexNo) => {
                const response = await fetch(filePath);
                const blob = await response.blob();
                const file = new File([blob], existingFilePaths[indexNo], { type: blob.type });
                formData.append(`mediaFile${index}`, file);
                index++;
            });
            // Wait for all existing files to be processed
            await Promise.all(existingFilesPromises);
            await PostService.updatePost(id, formData);
            setNotification({
                message: 'Post updated successfully!',
                type: 'success'
            });
            setTimeout(() => {
                navigate("/home");
            }, 1500);
        } catch (error) {
            console.error('Error updating post:', error);
            setNotification({
                message: 'Failed to update post. Please try again.',
                type: 'danger'
            });
        }
    };

    return (
        <Container style={{ maxWidth: 600, marginTop: 40 }}>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2 className="mb-4">Edit Post</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUserName" className="mb-3">
                    <Form.Label className="fw-bold">User Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={userName}
                        readOnly
                        plaintext
                        className="text-muted"
                    />
                </Form.Group>

                <Form.Group controlId="formHeadline" className="mb-3">
                    <Form.Label className="fw-bold">HeadLine</Form.Label>
                    <Form.Control
                        type="text"
                        value={headline}
                        onChange={e => setHeadline(e.target.value)}
                        required
                        placeholder="Enter your HeadLine"
                    />
                </Form.Group>

                <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label className="fw-bold">Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="Enter post title"
                    />
                </Form.Group>

                <Form.Group controlId="formDescription" className="mb-3">
                    <Form.Label className="fw-bold">Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        placeholder="Enter post description"
                    />
                </Form.Group>

                <Form.Group controlId="formTags" className="mb-3">
                    <Form.Label className="fw-bold">Tags</Form.Label>
                    <Form.Control
                        type="text"
                        value={currentTag}
                        onChange={e => setCurrentTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Type and press Enter to add tags"
                    />
                    <div className="mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="badge bg-primary me-2 mb-2"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRemoveTag(tag)}
                            >
                                {tag} ×
                            </span>
                        ))}
                    </div>
                </Form.Group>

                <Form.Group controlId="formMedia" className="mb-3">
                    <Form.Label className="fw-bold">Media Files (Up to 3)</Form.Label>
                    <div className="mt-3">
                        <Row>
                            {existingFilePaths.map((filePath, index) => (
                                <Col key={`existing-${index}`} xs={12} md={4} className="mb-3">
                                    <div className="position-relative">
                                        {filePath.toLowerCase().endsWith('.mp4') || 
                                         filePath.toLowerCase().endsWith('.webm') ||
                                         filePath.toLowerCase().endsWith('.ogg') ? (
                                            <video
                                                src={filePath}
                                                controls
                                                className="w-100 rounded"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        ) : (
                                            <Image src={filePath} alt={`Existing ${index + 1}`} fluid rounded />
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0 m-2"
                                            onClick={() => handleRemoveExistingMedia(index)}
                                        >
                                            X
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                            {previews.map((preview, index) => (
                                <Col key={`new-${index}`} xs={12} md={4} className="mb-3">
                                    <div className="position-relative">
                                        {preview.type === 'image' ? (
                                            <Image src={preview.url} alt={`New ${index + 1}`} fluid rounded />
                                        ) : (
                                            <video
                                                src={preview.url}
                                                controls
                                                className="w-100 rounded"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0 m-2"
                                            onClick={() => handleRemoveNewMedia(index)}
                                        >
                                            X
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        {existingFilePaths.length + mediaFiles.length < 3 && (
                            <Form.Control
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                                multiple
                                className="mt-2"
                            />
                        )}
                    </div>
                </Form.Group>

                <Button variant="success" type="submit">
                    Update Post
                </Button>
            </Form>
        </Container>
    );
};

export default EditPost;