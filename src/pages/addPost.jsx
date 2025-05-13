import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Image, Row, Col } from 'react-bootstrap';
import Notification from '../components/common/Notification';

import { useNavigate } from "react-router-dom";
import PostService from '../services/postService';

const AddPost = () => {
  const [userName, setUserName] = useState('');
  const [headline, setHeadline] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + mediaFiles.length > 3) {
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

  const handleRemoveMedia = (index) => {
    const newMediaFiles = [...mediaFiles];
    const newPreviews = [...previews];
    
    newMediaFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMediaFiles(newMediaFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('headline', headline);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    
    mediaFiles.forEach((file, index) => {
      formData.append(`mediaFile${index}`, file);
    });

    await PostService.addPost(formData);
    setNotification({
      message: 'Post submitted!',
      type: 'success'
    });
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault(); // Prevent form submission
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
      <h2 className="mb-4">Add a New Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserName" className="mb-3">
          <Form.Label className="fw-bold">User Name</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </Form.Group>
        <Form.Group controlId="formUserName" className="mb-3">
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
          <Form.Control
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            multiple
            required={mediaFiles.length === 0}
          />
          <div className="mt-3">
            <Row>
              {previews.map((preview, index) => (
                <Col key={index} xs={12} md={4} className="mb-3">
                  <div className="position-relative">
                    {preview.type === 'image' ? (
                      <Image src={preview.url} alt={`Preview ${index + 1}`} fluid rounded />
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
                      onClick={() => handleRemoveMedia(index)}
                    >
                      ×
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Form.Group>
        <Button variant="success" type="submit">
          Add Post
        </Button>
      </Form>
    </Container>
  );
};

export default AddPost;