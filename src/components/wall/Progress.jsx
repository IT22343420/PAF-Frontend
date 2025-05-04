import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllProgress } from "../../services/progressService";
import { IoMdClose } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { RiMessage3Fill } from "react-icons/ri";

import profile from "../../images/profile.jpg";

function Progress() {
  const [progressList, setProgressList] = useState([]);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState("false");

  const currentUserId = "poornima123";

  useEffect(() => {
    loadAllProgress();
  }, [refresh]);

  const loadAllProgress = () => {
    getAllProgress()
      .then((response) => {
        setProgressList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setComments(post.comments || []);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
    setCommentInput("");
    setRefresh("false");
  };

  //comment
  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    const response = await fetch(
      `http://localhost:8080/api/progress/${selectedPost.id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentedBy: "poornima123",
          commentText: commentInput,
        }),
      }
    );
    setRefresh("true");
    const updatedPost = await response.json();
    setComments(updatedPost.comments);
    setCommentInput("");
  };

  //like unlike
  const toggleLike = async (progressId, userId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/progress/${progressId}/like`,
        null,
        {
          params: { userId: userId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  const handleLike = async (progressId) => {
    try {
      const updatedProgress = await toggleLike(progressId, currentUserId);
      setProgressList((prevList) =>
        prevList.map((progress) =>
          progress.id === progressId ? updatedProgress : progress
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="flex flex-col px-4">
      {progressList.length === 0 ? (
        <p className="text-center text-gray-500">No learning progress yet.</p>
      ) : (
        <div className="flex flex-col">
          {[...progressList]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((progress) => (
              <div
                key={progress.id}
                className="flex flex-col transition-all duration-300 hover:scale-102 mb-7"
              >
                <div className="flex flex-row items-center">
                  <div className="rounded-[50%] border-3 border-indigo-600">
                    <img src={profile} className="w-10 h-10 rounded-[50%]" />
                  </div>
                  <p className="ml-3 font-bold">{progress.userId}</p>
                </div>
                <div className="flex flex-col w-150 h-auto p-5 rounded-md shadow-lg mt-2 bg-white">
                  <div
                    className={`flex flex-col justify-center items-center w-[100%] h-40 rounded-md  ${
                      progress.templateType === "Start Learning"
                        ? "bg-blue-200 "
                        : progress.templateType === "Progressing"
                        ? "bg-yellow-200 "
                        : "bg-green-200 "
                    }`}
                  >
                    {progress.templateType === "Start Learning" && (
                      <>
                        <p className="text-md font-bold">
                          I've just started my learning journey on this topic.
                        </p>
                        <p className="text-md font-bold">
                          Excited to dive in and explore what's ahead!
                        </p>
                      </>
                    )}
                    {progress.templateType === "Progressing" && (
                      <>
                        <p className="text-md font-bold">
                          Making steady progress and gaining more insight every
                          day.
                        </p>
                        <p className="text-md font-bold">Each step is a win!</p>
                      </>
                    )}
                    {progress.templateType === "Completed" && (
                      <>
                        <p className="text-md font-bold">
                          "Thrilled to complete this learning milestone!
                        </p>
                        <p className="text-md font-bold">
                          Proud of the journey and the knowledge gained."
                        </p>
                      </>
                    )}
                    {!["Start Learning", "Progressing", "Completed"].includes(
                      progress.templateType
                    ) && (
                      <>
                        <p className="text-md font-bold">
                          Learning update posted
                        </p>
                        <p className="text-md font-bold">keep going strong!</p>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mt-2">{progress.title}</h2>
                  <p className="text-gray-700 my-2">{progress.content}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-600">
                      {progress.templateType}
                    </span>
                    <span className="text-sm text-gray-400">
                      {progress.createdAt?.substring(0, 10)}
                    </span>
                  </div>
                  <div className="flex flex-row mt-2">
                    <button
                      onClick={() => handleLike(progress.id)}
                      className={`flex flex-row text-sm mr-4 ${
                        progress.likedBy?.includes(currentUserId)
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      <BiSolidLike className="text-xl mr-2" />
                      {progress.likedBy?.includes(currentUserId)
                        ? "Unlike"
                        : "Like"}{" "}
                      ({progress.likeCount || 0})
                    </button>
                    <button
                      className=" flex flex-row text-sm text-gray-600"
                      onClick={() => openCommentModal(progress)}
                    >
                      <RiMessage3Fill className="mr-2 text-xl" />
                      comment ({progress.comments?.length || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

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
                        <p className="text-sm font-medium">{cmt.commentedBy}</p>
                        <p className="text-md text-gray-900">
                          {cmt.commentText}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {cmt.commentedAt?.substring(0, 19).replace("T", " ")}
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
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;
