import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import { getUserProgress } from "../../services/progressService";
import { createProgress } from "../../services/progressService";
import { updateProgress } from "../../services/progressService";
import { deleteProgress } from "../../services/progressService";

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
//created learning progress
function LearningProgress() {
  const [progressList, setProgressList] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "poornima123",
    title: "",
    content: "",
    templateType: "",
  });

  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);

  const handleOpenModal = () => {
    setPopupOpen(true);
  };

  const handleCloseModal = () => {
    setPopupOpen(false);
    setFormData({
      userId: "poornima123",
      title: "",
      content: "",
      templateType: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProgress(formData)
      .then(() => {
        toast.success("Learning Progress Posted Successfully!");
        handleCloseModal();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error posting progress!");
      });
  };

  useEffect(() => {
    loadUserProgress();
  }, [isPopupOpen]);

  const loadUserProgress = () => {
    getUserProgress("poornima123")
      .then((response) => {
        setProgressList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOpenUpdateModal = (progress) => {
    setSelectedProgress(progress);
    setIsUpdatePopupOpen(true);
  };
  const handleCloseUpdateModal = () => {
    setIsUpdatePopupOpen(false);
    setSelectedProgress(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgress) return;

    try {
      await updateProgress(selectedProgress.id, selectedProgress);
      toast.success("Progress updated successfully!");
      handleCloseUpdateModal();
      loadUserProgress();
    } catch (error) {
      toast.error("Failed to update progress.");
      console.error(error);
    }
  };

  const handleDeleteProgress = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This progress update will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteProgress(id);
        setProgressList((prevList) =>
          prevList.filter((item) => item.id !== id)
        );

        Swal.fire({
          title: "Deleted!",
          text: "The progress update has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting progress:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="mt-10 border-2 border-gray-300 p-3 rounded-xl bg-white">
      <div className="flex flex-row">
        <button
          className="flex p-2 bg-indigo-600 text-white font-bold hover:bg-indigo-500 rounded-md"
          onClick={handleOpenModal}
        >
          post your lerning progress
        </button>
      </div>
      <p className="text-xl font-bold mb-4 mt-3">My Learning Progress</p>

      {progressList.length === 0 ? (
        <p className="text-gray-500">No progress updates yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressList.map((progress) => (
            <div
              key={progress.id}
              className={`rounded-md p-3 shadow-md transition-all duration-300 bg-white ${
                progress.templateType === "Start Learning"
                  ? "hover:!bg-blue-100 border-l-4 border-blue-500"
                  : progress.templateType === "Progressing"
                  ? "hover:!bg-yellow-100 border-l-4 border-yellow-500"
                  : "hover:!bg-green-100 border-l-4 border-green-500"
              }`}
            >
              <p className="text-xl font-bold mb-2">{progress.title}</p>
              <p className="text-gray-700 mb-2">{progress.content}</p>
              <p className="text-sm text-gray-500">
                Template: {progress.templateType}
              </p>
              <p className="text-sm text-gray-400">
                Created at: {progress.createdAt?.substring(0, 10)}
              </p>
              <div className="flex flex-row">
                <div
                  onClick={() => handleOpenUpdateModal(progress)}
                  className="flex justify-center items-center text-indigo-600 w-[35px] h-[35px] bg-white font-bold rounded-md hover:!bg-blue-400 hover:text-white border-2 border-blue-400"
                >
                  <FaEdit className="text-md" />
                </div>
                <div
                  onClick={() => handleDeleteProgress(progress.id)}
                  className="flex justify-center items-center ml-4 text-sm text-red-600 w-[35px] h-[35px] bg-white font-bold rounded-md hover:!bg-red-400 hover:text-white border-2 border-red-400"
                >
                  <RiDeleteBin6Fill className="text-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col bg-white p-10 rounded-md w-150">
            <p className="text-2xl font-bold mb-4">Create Learning Progress</p>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                type="text"
                placeholder="Title"
                className="mb-3 p-2 bg-gray-200 rounded-md focus:outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Content"
                className="mb-3 p-2 bg-gray-200 rounded-md focus:outline-none"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              ></textarea>
              <div className="flex flex-col mb-3">
                <label className="font-semibold mb-2">
                  Select Template Type:
                </label>

                <div className="flex space-x-5">
                  {/* Start Learning */}
                  <label className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="Start Learning"
                      checked={formData.templateType === "Start Learning"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateType: e.target.value,
                        })
                      }
                      className="hidden"
                    />
                    <img
                      src="https://img.icons8.com/color/96/000000/book-reading.png"
                      alt="Start Learning"
                      className={`w-20 h-20 p-2 border-2 ${
                        formData.templateType === "Start Learning"
                          ? "border-indigo-600"
                          : "border-gray-300"
                      } rounded-lg`}
                    />
                    <span className="mt-2 text-sm font-semibold">
                      Start Learning
                    </span>
                  </label>

                  {/* Progressing */}
                  <label className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="Progressing"
                      checked={formData.templateType === "Progressing"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateType: e.target.value,
                        })
                      }
                      className="hidden"
                    />
                    <img
                      src="https://img.icons8.com/color/96/000000/learning.png"
                      alt="Progressing"
                      className={`w-20 h-20 p-2 border-2 ${
                        formData.templateType === "Progressing"
                          ? "border-indigo-600"
                          : "border-gray-300"
                      } rounded-lg`}
                    />
                    <span className="mt-2 text-sm font-semibold">
                      Progressing
                    </span>
                  </label>

                  {/* Completed Learning */}
                  <label className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="Completed Learning"
                      checked={formData.templateType === "Completed Learning"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateType: e.target.value,
                        })
                      }
                      className="hidden"
                    />
                    <img
                      src="https://img.icons8.com/color/96/000000/checked--v1.png"
                      alt="Completed Learning"
                      className={`w-20 h-20 p-2 border-2 ${
                        formData.templateType === "Completed Learning"
                          ? "border-indigo-600"
                          : "border-gray-300"
                      } rounded-lg`}
                    />
                    <span className="mt-2 text-sm font-semibold">
                      Completed
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mr-5"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save and post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdatePopupOpen && selectedProgress && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col bg-white p-10 rounded-md w-150">
            <p className="text-2xl font-bold mb-4">Update Learning Progress</p>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col">
              <input
                type="text"
                placeholder="Title"
                className="mb-3 p-2 bg-gray-200 rounded-md focus:outline-none"
                value={selectedProgress.title}
                onChange={(e) =>
                  setSelectedProgress({
                    ...selectedProgress,
                    title: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Content"
                className="mb-3 p-2 bg-gray-200 rounded-md focus:outline-none"
                value={selectedProgress.content}
                onChange={(e) =>
                  setSelectedProgress({
                    ...selectedProgress,
                    content: e.target.value,
                  })
                }
                required
              ></textarea>

              <div className="flex flex-col mb-3">
                <label className="font-semibold mb-2">
                  Select Template Type:
                </label>
                <div className="flex space-x-5">
                  {["Start Learning", "Progressing", "Completed Learning"].map(
                    (type) => (
                      <label
                        key={type}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="templateType"
                          value={type}
                          checked={selectedProgress.templateType === type}
                          onChange={(e) =>
                            setSelectedProgress({
                              ...selectedProgress,
                              templateType: e.target.value,
                            })
                          }
                          className="hidden"
                        />
                        <img
                          src={
                            type === "Start Learning"
                              ? "https://img.icons8.com/color/96/000000/book-reading.png"
                              : type === "Progressing"
                              ? "https://img.icons8.com/color/96/000000/learning.png"
                              : "https://img.icons8.com/color/96/000000/checked--v1.png"
                          }
                          alt={type}
                          className={`w-20 h-20 p-2 border-2 ${
                            selectedProgress.templateType === type
                              ? "border-indigo-600"
                              : "border-gray-300"
                          } rounded-lg`}
                        />
                        <span className="mt-2 text-sm font-semibold">
                          {type === "Completed Learning" ? "Completed" : type}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mr-5"
                  onClick={handleCloseUpdateModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default LearningProgress;
