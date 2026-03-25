import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { acceptApplicaion, createJob, deleteJobs, getAllApplication, getAllJobs, getMyApplication, jobApply, rejectApplication, updateJob } from "../controllers/jobController.js";

const jobRouter=express.Router();

jobRouter.post("/createJob",userMiddleware,createJob);
jobRouter.get("/getJob",userMiddleware,getAllJobs);
jobRouter.put("/deleteJob/:jobId",userMiddleware,deleteJobs)
jobRouter.put("/updateJobs/:jobId",userMiddleware,updateJob);
jobRouter.post("/jobApply",userMiddleware,jobApply);
jobRouter.get("/getMyApplication",userMiddleware,getMyApplication);
jobRouter.get("/getAllApplication",userMiddleware,getAllApplication);
jobRouter.post("/acceptApplication",userMiddleware,acceptApplicaion);
jobRouter.post("/rejectApplication",userMiddleware,rejectApplication);



export default jobRouter;