import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const FeedBack = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

 
  const validateForm = () => {
    if (!state || !state._id) {
      toast.error("Invalid submission data");
      return false;
    }

    if (!feedback.trim()) {
      toast.error("Feedback is required");
      return false;
    }

    if (!score) {
      toast.error("Score is required");
      return false;
    }

    if (isNaN(score)) {
      toast.error("Score must be a number");
      return false;
    }

    const numericScore = Number(score);

    if (numericScore < 0 || numericScore > 100) {
      toast.error("Score must be between 0 and 100");
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
 
    if (!validateForm()) return;

    try {
      let res = await fetch(
        `${API}/api/v1/assignment/instructorFeedBack/${state._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            feedback: feedback.trim(),
            score: Number(score),
          }),
        }
      );

      if (res.ok) {
        toast.success("Feedback submitted successfully");

        
        setFeedback("");
        setScore(""); 
        navigate("/access/courseManagement");
       
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Something went wrong");
    }
  };

  
  if (!state) {
    return <h1 className="text-center mt-10">No Data Found</h1>;
  }

  return (
    <div className="space-y-4 p-6">
      <h1>Title : {state?.courses?.title}</h1>
      <h1>Student : {state?.student?.fullName}</h1>
      <h1>Status : {state?.status}</h1>
      <h1>Comment : {state?.comment}</h1>

      <input
        type="text"
        value={feedback}
        className="border p-2 w-full"
        placeholder="Enter feedback"
        onChange={(e) => setFeedback(e.target.value)}
      />

      <input
        type="number"
        value={score}
        className="border p-2 w-full"
        placeholder="Enter score (0-100)"
        onChange={(e) => setScore(e.target.value)}
      />

      <button
        className="p-2 bg-blue-500 text-white rounded"
        onClick={onSubmit}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedBack;