import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { acceptApplicaion, createJob, deleteJobs, getAllApplication, getAllJobs, getMyApplication, jobApply, rejectApplication, updateJob } from "../controllers/jobController.js";
import upload from "../middleware/upload.js";

const jobRouter=express.Router();

jobRouter.post("/createJob",userMiddleware,createJob);
jobRouter.get("/getJob",userMiddleware,getAllJobs);
jobRouter.delete("/deleteJob/:jobId",userMiddleware,deleteJobs)
jobRouter.put("/updateJobs/:jobId",userMiddleware,updateJob);
jobRouter.post("/jobApply/:jobId",upload.single("resume"),userMiddleware,jobApply);
jobRouter.get("/getMyApplication",userMiddleware,getMyApplication);
jobRouter.get("/getAllApplication",userMiddleware,getAllApplication);
jobRouter.patch("/acceptApplication/:applicantId",userMiddleware,acceptApplicaion);
jobRouter.patch("/rejectApplication/:applicantId",userMiddleware,rejectApplication);



export default jobRouter;