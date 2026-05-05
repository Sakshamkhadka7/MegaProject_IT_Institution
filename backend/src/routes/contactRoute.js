import express from "express";
import { createContact, getContact } from "../controllers/contactController.js";

const contactRouter=express.Router();

contactRouter.post("/createContact",createContact);
contactRouter.get("/getContact",getContact);

export default contactRouter;