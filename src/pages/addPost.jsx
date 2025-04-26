import React, { useState } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import PostService from '../services/postService';

const AddPost = () => {
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
    formData.append('title', title);
    formData.append('description', description);
    formData.append('imageFile', image);

    // Example: send formData to backend
    // fetch('/api/posts', { method: 'POST', body: formData })
    await PostService.addPost(formData);
    navigate("/posts");
    alert('Post submitted!');
  };

  return (
    <Container style={{ maxWidth: 600, marginTop: 40 }}>
      <h2 className="mb-4">Add a New Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserName" className="mb-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </Form.Group>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Enter post description"
          />
        </Form.Group>
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label>Image</Form.Label>
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
        <Button variant="primary" type="submit">
          Add Post
        </Button>
      </Form>
    </Container>
  );
};

export default AddPost;