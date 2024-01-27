import express from "express";
import { contactUsController, getContactUsController } from "./contactUs.controller";

const contactUsRouter = express.Router();

contactUsRouter.post("/contactUs", contactUsController);
contactUsRouter.get("/get/visitor/contactDetails", getContactUsController);

export default contactUsRouter; 