document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");
    const studentTable = document.getElementById("studentTableBody");
    let students = JSON.parse(localStorage.getItem("students")) || [];

    function saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(students));
    }

    function renderTable() {
        studentTable.innerHTML = "";
        students.forEach((student, index) => {
            let row = `<tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.contact}</td>
                <td>${student.course}</td>
                <td>
                    <button onclick="editStudent(${index})">Edit</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>`;
            studentTable.innerHTML += row;
        });
    }

    studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const contact = document.getElementById("contact").value;
        const course = document.getElementById("course").value;
        
        const student = { id, name, contact, course };
        students.push(student);
        saveToLocalStorage();
        renderTable();
        studentForm.reset();
    });

    window.editStudent = (index) => {
        const student = students[index];
        document.getElementById("id").value = student.id;
        document.getElementById("name").value = student.name;
        document.getElementById("contact").value = student.contact;
        document.getElementById("course").value = student.course;
        students.splice(index, 1);
        saveToLocalStorage();
        renderTable();
    };

    window.deleteStudent = (index) => {
        students.splice(index, 1);
        saveToLocalStorage();
        renderTable();
    };

    renderTable();
});
