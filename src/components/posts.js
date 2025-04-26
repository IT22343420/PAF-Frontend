import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import SinglePost from "./singlePost";
import PostService from "../api/postService";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
          try {
            const response = await PostService.getPosts();
            console.log(response);
            if (response.status === 200) {
                if (response.data.length > 0) {
                    setPosts(response.data);
                }
            }
          } catch (error) {
            console.log(error);
          }
        };
        getPosts();
      }, []);
    return (
        <Container>
            <Row className="justify-content-between">
                <Col md={8} className="mb-4 mt-4">
                </Col>
                <Col md={4} className="mt-4 float-right">
                    <Card>
                        <Card.Body>
                            <Card.Title>All Posts</Card.Title>
                            <ul className="list-unstyled">
                                {posts.map((post, idx) => (
                                    <li key={idx}>
                                        <a href={`#post-${idx}`}>{post.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                {posts.map((post, idx) => (
                    <Col md={8} className="mb-4" key={idx}>
                        <SinglePost
                            image={post.filePath}
                            title={post.title}
                            text={post.description}
                            userName={post.userName}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Posts;