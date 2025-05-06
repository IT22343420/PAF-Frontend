import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import SinglePost from "./singlePost";
import PostService from "../../services/postService";
import StartPost from "./startPost";
import Loading from "../common/Loading";

const Posts = ({onSetNotification}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
          } finally {
            setLoading(false);
          }
        };
        getPosts();
      }, []);

    const handleDelete = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
        onSetNotification({
            message: 'Post deleted successfully!',
            type: 'success'
        });
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <Container>
            <StartPost />
            <Row className="justify-content-center">
                {posts.map((post, idx) => (
                    <Col md={10} className="mb-4" key={idx}>
                        <SinglePost
                            post={post}
                            onDelete={() => handleDelete(post.id)}
                            onSetNotification={onSetNotification}
                            profileImage={'/profileImages/1.jpeg'}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Posts;