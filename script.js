document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");
    const studentTable = document.getElementById("studentTableBody");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let editIndex = -1;
    let deleteIndex = -1;

    function saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(students));
    }

    function renderTable() {
        studentTable.innerHTML = "";
        students.forEach((student, index) => {
            let row = `<tr>
                <td class='border p-2'>${student.id}</td>
                <td class='border p-2'>${student.name}</td>
                <td class='border p-2'>${student.contact}</td>
                <td class='border p-2'>${student.course}</td>
                <td class='border p-2'>
                    <button class='bg-blue-500 text-white px-2 py-1 rounded' data-index="${index}" onclick="openEditModal(${index})">Edit</button>
                    <button class='bg-red-500 text-white px-2 py-1 rounded' data-index="${index}" onclick="openDeleteModal(${index})">Delete</button>
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

        if (editIndex === -1) {
            students.push(student);
        } else {
            students[editIndex] = student;
            editIndex = -1;
        }

        saveToLocalStorage();
        renderTable();
        studentForm.reset();
    });

    window.openEditModal = (index) => {
        editIndex = index;
        const student = students[index];
        document.getElementById("editId").value = student.id;
        document.getElementById("editName").value = student.name;
        document.getElementById("editContact").value = student.contact;
        document.getElementById("editCourse").value = student.course;
        editModal.classList.remove("hidden");
    };

    window.updateStudent = () => {
        students[editIndex] = {
            id: document.getElementById("editId").value,
            name: document.getElementById("editName").value,
            contact: document.getElementById("editContact").value,
            course: document.getElementById("editCourse").value,
        };
        saveToLocalStorage();
        renderTable();
        closeEditModal();
    };

    window.closeEditModal = () => {
        editModal.classList.add("hidden");
    };

    window.openDeleteModal = (index) => {
        deleteIndex = index;
        deleteModal.classList.remove("hidden");
    };

    window.confirmDelete = () => {
        students.splice(deleteIndex, 1);
        saveToLocalStorage();
        renderTable();
        closeDeleteModal();
    };

    window.closeDeleteModal = () => {
        deleteModal.classList.add("hidden");
    };

    renderTable();
});
