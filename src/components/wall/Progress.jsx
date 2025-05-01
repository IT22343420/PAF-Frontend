import React, { useEffect, useState } from "react";
import { getAllProgress } from "../../services/progressService";

import profile from "../../images/profile.jpg";

function Progress() {
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    loadAllProgress();
  }, []);

  const loadAllProgress = () => {
    getAllProgress()
      .then((response) => {
        setProgressList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col pt-2">
      <p className="text-xl font-bold mb-4">community learnning</p>

      {progressList.length === 0 ? (
        <p className="text-center text-gray-500">No learning progress yet.</p>
      ) : (
        <div className="flex flex-col">
          {progressList.map((progress) => (
            <div
              key={progress.id}
              className="flex flex-col transition-all duration-300 hover:scale-102 mb-7"
            >
              <div className="flex flex-row items-center">
                <div className="rounded-[50%] border-3 border-indigo-600">
                  <img src={profile} className="w-10 h-10 rounded-[50%]" />
                </div>
                <p className="ml-3 font-bold">Poornima Thennakoon</p>
              </div>
              <div
                className={`flex flex-col w-150 h-auto p-5 rounded-md shadow-lg mt-2 bg-white ${
                  progress.templateType === "Start Learning"
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : progress.templateType === "Progressing"
                    ? "bg-yellow-100 border-l-4 border-yellow-500"
                    : "bg-green-100 border-l-4 border-green-500"
                }`}
              >
                <h2 className="text-xl font-bold">{progress.title}</h2>
                <p className="text-gray-700 my-2">{progress.content}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">
                    {progress.templateType}
                  </span>
                  <span className="text-sm text-gray-400">
                    {progress.createdAt?.substring(0, 10)}
                  </span>
                </div>
                <div>
                  <button>like</button>
                  <button>comment</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Progress;
