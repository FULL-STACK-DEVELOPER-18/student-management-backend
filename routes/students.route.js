import express from "express";
import studentsController from "../controllers/students.controller.js";
import studentsValidation from "../validations/students.validation.js";
import validate from "../middleware/validate.js";

const route = express.Router();

route.get("/check-roll", studentsController.checkDuplicateRoll);

route.get("/list", studentsController.getStudentsList);

route.get("/:id", studentsController.getStudentById);

route.post("/create", validate(studentsValidation.createStudent), studentsController.createStudent);

route.put("/update/:id", studentsController.updateStudent);
    
route.delete("/delete/:id", studentsController.deleteStudent);


export default route;
