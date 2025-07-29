import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../helper/apiResponse.js";
import Student from "../models/students.model.js";

const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, course, age, std, division } = req.body;

    if (!name || !rollNumber || !course || !age || !std || !division) {
      return apiResponse({
        res,
        status: false,
        message: "All fields are required.",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return apiResponse({
        res,
        status: false,
        message: "Roll number already exists.",
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const student = new Student({ name, rollNumber, course, age, std, division });
    await student.save();

    return apiResponse({
      res,
      status: true,
      message: "Student created successfully.",
      data: student,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: false,
      message: "Failed to create student.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const getStudentsList = async (req, res) => {
  try {
    const { search, sortBy = "name", order = "asc", page = 1, limit = 10, course } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
      ];
    }
    if (course) {
      query.course = course;
    }

    const sortOrder = order === "dsc" ? -1 : 1;
    const allowedSortFields = ["name", "rollNumber"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";

    const pipeline = [
      { $match: query },
    ];

    if (sortField === "rollNumber") {
      pipeline.push({
        $addFields: {
          rollNumberInt: { $toInt: "$rollNumber" }
        }
      });
      pipeline.push({
        $sort: { rollNumberInt: sortOrder }
      });
    } else {
      pipeline.push({
        $sort: { [sortField]: sortOrder }
      });
    }

    pipeline.push(
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const total = await Student.countDocuments(query);
    const students = await Student.aggregate(pipeline);

    return apiResponse({
      res,
      status: true,
      message: "Students fetched successfully.",
      data: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        students,
      },
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: false,
      message: "Failed to fetch student list.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return apiResponse({
        res,
        status: false,
        message: "Student not found.",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return apiResponse({
      res,
      status: true,
      message: "Student fetched successfully.",
      data: student,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: false,
      message: "Failed to fetch student.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, course, age, std, division } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return apiResponse({
        res,
        status: false,
        message: "Student not found.",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (rollNumber && rollNumber !== student.rollNumber) {
      const duplicate = await Student.findOne({ rollNumber });
      if (duplicate) {
        return apiResponse({
          res,
          status: false,
          message: "Another student with this roll number already exists.",
          statusCode: StatusCodes.CONFLICT,
        });
      }
    }

    student.name = name ?? student.name;
    student.rollNumber = rollNumber ?? student.rollNumber;
    student.course = course ?? student.course;
    student.age = age ?? student.age;
    student.std = std ?? student.std;
    student.division = division ?? student.division;

    await student.save();

    return apiResponse({
      res,
      status: true,
      message: "Student updated successfully.",
      data: student,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: false,
      message: "Failed to update student.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return apiResponse({
        res,
        status: false,
        message: "Student not found.",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    await Student.deleteOne({ _id: id });

    return apiResponse({
      res,
      status: true,
      message: "Student deleted successfully.",
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: false,
      message: "Failed to delete student.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const checkDuplicateRoll = async (req, res) => {
  try {
    const { rollNumber } = req.query;

    if (!rollNumber) {
      return apiResponse({
        res,
        status: false,
        message: "Roll number is required.",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const student = await Student.findOne({ rollNumber });

    return apiResponse({
      res,
      status: true,
      message: student ? "Duplicate found" : "Roll number is available",
      data: { exists: !!student },
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    console.log(error);
    return apiResponse({
      res,
      status: false,
      message: "Error checking roll number.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export default {
  createStudent,
  getStudentsList,
  getStudentById,
  updateStudent,
  deleteStudent,
  checkDuplicateRoll,
};
