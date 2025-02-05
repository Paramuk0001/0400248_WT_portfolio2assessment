// attendance/static/js/script.js

document.addEventListener("DOMContentLoaded", function () {
    // Fetch data when the page loads
    fetchStudents();
    fetchAttendance();

    // Ensure the event listeners are only attached once
    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', addStudent, { once: true });
    }

    const markAttendanceForm = document.getElementById('mark-attendance-form');
    if (markAttendanceForm) {
        markAttendanceForm.addEventListener('submit', markAttendance, { once: true });
    }
});

// Fetch and display the list of students
async function fetchStudents() {
    const response = await fetch('/api/students/');
    const data = await response.json();

    const studentList = document.getElementById('student-list');
    studentList.innerHTML = ''; // Clear existing list

    data.students.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `${student.name} (Roll: ${student.roll_number}, Email: ${student.email})`;
        studentList.appendChild(li);
    });
}

// Fetch and display the attendance records
async function fetchAttendance() {
    const response = await fetch('/api/attendance/');
    const data = await response.json();

    const attendanceList = document.getElementById('attendance-list');
    attendanceList.innerHTML = ''; // Clear existing list

    data.attendance.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `${record.student__name} - ${record.date} - ${record.status}`;
        attendanceList.appendChild(li);
    });
}

// Add a new student
async function addStudent(event) {
    event.preventDefault(); // Prevent default form submission

    const nameField = document.getElementById('student-name');
    const rollField = document.getElementById('student-roll');
    const emailField = document.getElementById('student-email');

    const name = nameField.value.trim();
    const rollNumber = rollField.value.trim();
    const email = emailField.value.trim();

    if (!name || !rollNumber || !email) {
        alert("All fields are required.");
        return;
    }

    const response = await fetch('/api/students/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, roll_number: rollNumber, email }),
    });

    const result = await response.json();

    if (response.ok) {
        alert('Student added successfully');
        fetchStudents(); // Refresh the student list

        // Clear input fields
        nameField.value = '';
        rollField.value = '';
        emailField.value = '';
    } else {
        alert(`Error: ${result.error}`);
    }
}

// Mark attendance for a student
async function markAttendance(event) {
    event.preventDefault();

    const rollNumber = document.getElementById('attendance-roll').value;
    const status = document.getElementById('attendance-status').value;

    const response = await fetch('/api/attendance/mark/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_number: rollNumber, status }),
    });

    if (response.ok) {
        alert('Attendance marked successfully');
        fetchAttendance(); // Refresh the attendance list
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
    }
}
