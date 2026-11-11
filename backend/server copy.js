import express from "express";

const app = express();
const PORT = 3000;

// In-memory array to store student records
const students = [];
let nextId = 1;

// ======================================
// 1. Built-in Middleware
// ======================================

// Parse incoming JSON data
app.use(express.json());

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// ======================================
// 2. Custom Middleware
// ======================================

// Log information about every incoming request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ======================================
// 3. Serve Static HTML, CSS and JS Files
// ======================================

app.use(express.static("public"));

// ======================================
// 4. POST API - Add a New Student
// ======================================

app.post("/api/students", (req, res) => {
    const { name, course } = req.body;

    // Validate input
    if (!name || !course || !name.trim() || !course.trim()) {
        return res.status(400).json({
            message: "Name and course are required."
        });
    }

    const newStudent = {
        id: nextId++,
        name: name.trim(),
        course: course.trim()
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully.",
        student: newStudent
    });
});

// ======================================
// 5. GET API - Retrieve All Students
// ======================================

app.get("/api/students", (req, res) => {

    if (students.length === 0) {
        return res.status(404).json({
            message: "No students found."
        });
    }

    res.status(200).json(students);
});

// ======================================
// 6. GET API - Retrieve One Student by ID
// ======================================

app.get("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Please provide a valid student ID."
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: `Student with ID ${id} was not found.`
        });
    }

    res.status(200).json(student);
});

// ======================================
// 7. Start the Express Server
// ======================================

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});