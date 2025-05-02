import React, { useState } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import PostService from '../services/postService';

const AddPost = () => {
  const [userName, setUserName] = useState('');
  const [headline, setHeadline] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare form data for backend submission
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('headline', headline);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('imageFile', image);

    await PostService.addPost(formData);
    navigate("/posts");
    alert('Post submitted!');
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
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label className="fw-bold">Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <div className="mt-3">
              <Image src={preview} alt="Preview" fluid rounded />
            </div>
          )}
        </Form.Group>
        <Button variant="success" type="submit">
          Add Post
        </Button>
      </Form>
    </Container>
  );
};

export default AddPost;