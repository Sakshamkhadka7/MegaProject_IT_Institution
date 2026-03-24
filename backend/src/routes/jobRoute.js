import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createJob, deleteJobs, getAllJobs, updateJob } from "../controllers/jobController.js";

const jobRouter=express.Router();

jobRouter.post("/createJob",userMiddleware,createJob);
jobRouter.get("/getJob",userMiddleware,getAllJobs);
jobRouter.put("/deleteJob/:jobId",userMiddleware,deleteJobs)
jobRouter.put("/updateJobs/:jobId",userMiddleware,updateJob);


export default jobRouter;