import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllProgress } from "../../services/progressService";
import { IoMdClose } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { RiMessage3Fill } from "react-icons/ri";

import EmojiPicker from "emoji-picker-react";
import { FaRegSmile } from "react-icons/fa";
import { TiWarningOutline } from "react-icons/ti";
import { IoIosSend } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

import profile from "../../images/profile.jpg";
import start from "../../images/start.gif";
import progressgif from "../../images/progress.gif";
import completed from "../../images/completed.gif";

function Progress() {
  const profileName = localStorage.getItem('name');
  const currentUserId = localStorage.getItem('userName');

  const [progressList, setProgressList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState("false");
  const [selectedProgress, setSelectedProgress] = useState([]);

  

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
    setSelectedProgress(post);
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
          commentedBy: profileName,
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

  const handleEmojiClick = (emojiData) => {
    setCommentInput((prev) => prev + emojiData.emoji);
  };

  const handleDeleteComment = async (progressId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/progress/${progressId}/comment/${commentId}`,
        {
          params: { commentedBy:profileName },
        }
      );

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setRefresh("true");
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("You are not allowed to delete this comment.");
    }
  };


  return (
    <div className="flex flex-col px-4">
      {progressList.length === 0 ? (
        <p className="text-center text-gray-500">No learning progress yet.</p>
      ) : (
        <div className="flex flex-col w-150 h-auto">
          {[...progressList]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((progress) => (
              <div
                key={progress.id}
                className="flex flex-col bg-white border-2 border-gray-300 rounded-xl mb-7 w-150 h-auto"
              >
                <div className="flex flex-row items-center m-0 p-3">
                  <div className="rounded-[50%] border-3 border-indigo-600">
                    <img src={profile} className="w-12 h-12 rounded-[50%]" />
                  </div>
                  <div className="flex flex-col ml-3">
                    <p className="font-bold text-md m-0">{progress.userId}</p>
                    <p className="text-[12px] text-gray-600 m-0">
                      Software Engineer | SLIIT
                    </p>
                    <span className="text-[11px] text-gray-600 m-0">
                      {progress.createdAt?.substring(0, 10)}
                    </span>
                  </div>
                </div>

                <div className="px-3 m-0">
                  {progress.templateType === "Start Learning" && (
                    <>
                      <p className="text-md text-gray-600">
                        I've just started my learning journey on this topic.
                        Excited to dive in and explore what's ahead! I Started
                        to learn{" "}
                        <span className="font-bold text-blue-400">{progress.title}</span>
                      </p>
                    </>
                  )}
                  {progress.templateType === "Progressing" && (
                    <>
                      <p className="text-md text-gray-600">
                        Making steady progress and gaining more insight every
                        day. Each step is a win! I am learning{" "}
                        <span className="font-bold text-blue-400">{progress.title}</span>
                      </p>
                    </>
                  )}
                  {progress.templateType === "Completed Learning" && (
                    <>
                      <p className="text-md text-gray-600">
                        "Thrilled to complete this learning milestone! Proud of
                        the journey and the knowledge gained." I have completed{" "}
                        <span className="font-bold text-blue-400">{progress.title}</span>
                      </p>
                    </>
                  )}
                  {!["Start Learning", "Progressing", "Completed Learning"].includes(
                    progress.templateType
                  ) && (
                    <>
                      <p className="text-md text-gray-600">
                        Learning update posted keep going strong! i have
                        completed{" "}
                        <span className="font-bold text-blue-400">{progress.title}</span>
                      </p>
                    </>
                  )}
                  <div className="">
                    <p className="text-gray-700 my-2">{progress.content}</p>
                  </div>
                </div>

                <div className="flex flex-col mt-2">
                  <div
                    className={`flex flex-col justify-center items-center w-[100%] h-60  ${
                      progress.templateType === "Start Learning"
                        ? "bg-blue-200 "
                        : progress.templateType === "Progressing"
                        ? "bg-yellow-200 "
                        : progress.templateType === "Completed Learning"
                        ? "bg-rose-200 "
                        : "bg-fuchsia-200 "
                    }`}
                  >
                    {progress.templateType === "Start Learning" && (
                      <>
                        <img src={start} className="w-60 h-auto" />
                      </>
                    )}
                    {progress.templateType === "Progressing" && (
                      <>
                        <img src={progressgif} className="w-60 h-auto" />
                      </>
                    )}
                    {progress.templateType === "Completed Learning" && (
                      <>
                        <img src={completed} className="w-60 h-auto" />
                      </>
                    )}
                    {!["Start Learning", "Progressing", "Completed Learning"].includes(
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

                  <div className="flex justify-between items-center py-3 px-3">
                    <span className="flex flex-row text-md text-gray-600">
                      <BiSolidLike className="text-xl mr-2" />
                      like{""} {progress.likeCount || 0}
                    </span>
                    <span className="text-md text-gray-600">
                      {progress.comments?.length || 0} {""}comments
                    </span>
                  </div>
                  <div className="flex flex-row justify-between py-2 px-3 border-t-2 border-gray-200">
                    <button
                      onClick={() => handleLike(progress.id)}
                      className={`flex flex-row text-sm px-3 py-2 hover:bg-gray-200 ${
                        progress.likedBy?.includes(currentUserId)
                          ? "text-blue-500"
                          : "text-gray-600"
                      }`}
                    >
                      <BiSolidLike className="text-xl mr-2" />
                      {progress.likedBy?.includes(currentUserId)
                        ? "Unlike"
                        : "Like"}
                    </button>
                    <button
                      className=" flex flex-row text-sm text-gray-600 px-3 py-2 hover:bg-gray-200"
                      onClick={() => openCommentModal(progress)}
                    >
                      <RiMessage3Fill className="mr-2 text-xl" />
                      Comment
                    </button>
                    <button
                      className=" flex flex-row text-sm text-gray-600 px-3 py-2 hover:bg-gray-200"
                      onClick={() => openCommentModal(progress)}
                    >
                      <TiWarningOutline className="mr-2 text-xl" />
                      Report
                    </button>
                    <button
                      className=" flex flex-row text-sm text-gray-600 px-3 py-2 hover:bg-gray-200"
                      onClick={() => openCommentModal(progress)}
                    >
                      <IoIosSend className="mr-2 text-xl" />
                      Share
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
            <p className="text-xl font-bold mb-3">Comments</p>
            <div className="max-h-60 overflow-y-auto mb-4">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                [...comments].reverse().map((cmt, idx) => (
                  <div key={idx} className="flex flex-row mb-3">
                    <div className="flex flex-col">
                      <img src={profile} className="w-13 h-13 rounded-[50%]" />
                    </div>
                    <div className="flex flex-col ml-5">
                      <div className="flex flex-col bg-gray-200 p-2 rounded-md">
                        <p className="text-sm font-medium m-0">{cmt.commentedBy}</p>
                        <p className="text-md text-gray-900 m-0">
                          {cmt.commentText}
                        </p>
                        {cmt.commentedBy === profileName && (
                          <button
                            onClick={() =>
                              handleDeleteComment(selectedProgress.id, cmt.id)
                            }
                            className="flex justify-end items-end"
                          >
                            <MdDeleteForever className="text-gray-400 hover:text-red-600 text-xl mt-2" />
                          </button>
                        )}
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
    </div>
  );
}

export default Progress;
