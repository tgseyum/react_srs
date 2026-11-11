import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//==========================================USER SIGN UP and IN=============================
app.post("/api/signup", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)";
        const [result] = await pool.execute(sql, [email, passwordHash, role]);

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });

    } catch (error) {

        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT user_id, email, role FROM users");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve users", error: error.message });
    }
});

app.post("/api/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await pool.execute(sql, [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({ message: "Signin successful", userId: user.user_id, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Signin failed", error: error.message });
    }
});
//=======================================STUDENT WRITE and READ ========================================
app.post("/api/students", async (req, res) => {
    try {
        const { user_id, first_name, last_name, phone, address } = req.body;
        const sql = "INSERT INTO students (user_id, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?)";
        const [result] = await pool.execute(sql, [user_id, first_name, last_name, phone, address]);

        res.status(201).json({ message: "Student registered successfully", studentId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Student registration failed", error: error.message });
    }
});

app.get("/api/students", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM students");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve students", error: error.message });
    }
});

//=========================================COURESE WRITE and READ================================

app.post("/api/courses", async (req, res) => {
    try {
        const { course_code, course_name, description } = req.body;
        const sql = "INSERT INTO courses (course_code, course_name, description) VALUES (?, ?, ?)";
        const [result] = await pool.execute(sql, [course_code, course_name, description]);

        res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Course creation failed", error: error.message });
    }
});

app.get("/api/courses", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM courses");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve courses", error: error.message });
    }
});

//=========================================ENROLLEMNTS READ AND WRITE=======================================

app.post("/api/enrollments", async (req, res) => {
    try {
        const { student_id, course_id, enrollment_date } = req.body;
        const sql = "INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES (?, ?, ?)";
        const [result] = await pool.execute(sql, [student_id, course_id, enrollment_date]);

        res.status(201).json({ message: "Student enrolled successfully", enrollmentId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Enrollment failed", error: error.message });
    }
});

app.get("/api/enrollments", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM enrollments");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve enrollments", error: error.message });
    }
});

//====================================================================

app.get("/", (req, res) => {
    res.json({ message: "Student Registration System API is running!" });
});

// Handle incorrect URLs
app.use((req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});