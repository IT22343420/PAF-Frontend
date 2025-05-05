import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Badge, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PencilSquare, Trash, Heart, Chat } from "react-bootstrap-icons";
import PostService from "../../services/postService";
import ConfirmBox from "../common/ConfirmBox";

import { IoMdClose } from "react-icons/io";

import EmojiPicker from "emoji-picker-react";
import { FaRegSmile } from "react-icons/fa";

import profile from "../../images/profile.jpg";

const SinglePost = ({ post, profileImage, onDelete, onSetNotification }) => {
  const {
    id,
    userName,
    headline,
    title,
    description,
    filePaths,
    tags,
    createdAt,
  } = post;
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  //for like comment function
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [refreash, setRefreash] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  const profileName = "yuwani123";

  const handleLike = async (postId, userName) => {
    try {
      const res = await axios.post("http://localhost:8080/api/likes/toggle", {
        postId,
        userName,
      });
      console.log("Like response:", res.data);
      setUserLiked(res.data.liked);
      setRefreash(false);
      return res.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/comments/add",
        {
          postId: id,
          content: commentInput,
          userName: profileName,
        }
      );

      setComments((prev) => [...prev, response.data]);
      setCommentInput("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/likes/post/${id}`);
        const data = await res.json();
        setLikeCount(data.length);
        const likedByUser = data.some((like) => like.userName === profileName);
        setUserLiked(likedByUser);
      } catch (err) {
        console.error("Error fetching likes:", err);
      } finally {
        setRefreash(false);
      }
    };

    fetchLikes();
  }, [id, refreash]);

  const fetchComments = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/comments/post/${id}`
      );
      setComments(response.data || []);
      setCommentCount(response.data.length);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments(id);
    }
  }, [refreash, showCommentModal]);

  const openCommentModal = () => {
    setShowCommentModal(true);
    fetchComments(post.id);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
    setCommentInput("");
  };

  const handleEmojiClick = (emojiData) => {
    setCommentInput((prev) => prev + emojiData.emoji);
  };

  const handleEdit = () => {
    navigate(`/editPost/${id}`);
  };

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await PostService.deletePostById(id);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      onSetNotification({
        message: "Failed to delete post. Please try again.",
        type: "danger",
      });
    }
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <ConfirmBox
        show={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this post?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
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
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div className="fw-bold">{userName}</div>
                      <div className="text-muted small">{headline}</div>
                    </div>
                  </div>

                  {filePaths && filePaths.length > 0 && (
                    <Carousel className="mb-2">
                      {filePaths.map((filePath, index) => {
                        const isVideo =
                          filePath.toLowerCase().endsWith(".mp4") ||
                          filePath.toLowerCase().endsWith(".webm") ||
                          filePath.toLowerCase().endsWith(".ogg");

                        return (
                          <Carousel.Item key={index}>
                            {isVideo ? (
                              <video
                                controls
                                className="d-block w-100"
                                style={{
                                  maxHeight: "300px",
                                  objectFit: "cover",
                                }}
                              >
                                <source
                                  src={filePath}
                                  type={`video/${filePath.split(".").pop()}`}
                                />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img
                                src={filePath}
                                alt={`Media ${index + 1}`}
                                className="d-block w-100"
                                style={{
                                  maxHeight: "300px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </Carousel.Item>
                        );
                      })}
                    </Carousel>
                  )}

                  <div className="position-absolute bottom-0 start-0 w-100 d-flex gap-2 p-2">
                  <Button
                      variant={userLiked ? "danger" : "outline-danger"}
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={async () => {
                        await handleLike(id, profileName);
                        setRefreash(true);
                      }}
                    >
                      <Heart size={16} fill={userLiked ? "white" : "red"} />
                      <span>
                        {userLiked ? "Liked" : "Like"} ({likeCount})
                      </span>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => openCommentModal()}
                    >
                      <Chat size={16} />
                      <span>Comment ({commentCount})</span>
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
                      {tags &&
                        tags.map((tag, index) => (
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
                        style={{ cursor: "pointer" }}
                        onClick={handleEdit}
                      />
                      <Trash
                        size={20}
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={handleDelete}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <div className="flex flex-row w-[100%] justify-end">
              <button
                onClick={closeCommentModal}
                className="text-sm hover:text-red-500"
              >
                <IoMdClose className="text-2xl font-bold" />
              </button>
            </div>
            <h3 className="text-lg font-bold mb-4">Comments</h3>
            <div className="max-h-60 overflow-y-auto mb-4">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                [...comments].reverse().map((cmt, idx) => (
                  <div key={idx} className="flex flex-row mb-5">
                    <div className="flex flex-col">
                      <img src={profile} className="w-13 h-13 rounded-[50%]" />
                    </div>
                    <div className="flex flex-col ml-5">
                      <div className="flex flex-col bg-gray-200 p-3 rounded-md">
                        <p className="text-sm font-medium">{cmt.userName}</p>
                        <p className="text-md text-gray-900">{cmt.content}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {cmt.createdAt?.substring(0, 19).replace("T", " ")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-2 border-t-1 pt-2 border-gray-400">
              <input
                type="text"
                className="flex-grow bg-gray-100 p-2 rounded focus:outline-none focus:ring-0 "
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-xl text-gray-600 hover:text-blue-500"
              >
                <FaRegSmile />
              </button>
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-14 right-5 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .tag-badge {
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .tag-badge:hover {
          background-color: #0d6efd !important;
        }
      `}</style>
    </>
  );
};

export default SinglePost;
