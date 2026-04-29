import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const FeedBack = () => {
  const { state } = useLocation();
  console.log(state);

  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

  const onSubmit = async () => {
    try {
      let res = await fetch(
        `http://localhost:3001/api/v1/assignment/instructorFeedBack/${state._id}`,
        {
          method: "POST",
          headers:{
            "Content-Type":"application/json"
          },
          credentials: "include",
          body: JSON.stringify({ feedback: feedback, score: score }),
        },
      );

      if (res.ok) {
        alert("Feedback has been completed");
      }
    } catch (error) {
      console.log("Error has been occured at onSubmit of Feedback", error);
    }
  };

  return (
    <div className="space-y-3">
      <h1>Title : {state.courses.title}</h1>
      <h1>Student : {state.student.fullName}</h1>
      <h1>Status : {state.status}</h1>
      <h1>Comment : {state.comment}</h1>
      <input
        type="text"
        className="border p-2 w-100 focus:backdrop-blur-2xl"
        placeholder="Enter feedback for this assignment submission"
        onChange={(e) => setFeedback(e.target.value)}
      />{" "}
      <br />
      <input
        type="number"
        className="border p-2 w-100 focus:backdrop-blur-2xl"
        placeholder="Enter score for this assignemt submit"
        onChange={(e) => setScore(e.target.value)}
      />{" "}
      <br />
      <button
        className="p-2 border bg-blue-400 text-white"
        onClick={() => onSubmit()}
      >
        {" "}
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedBack;
