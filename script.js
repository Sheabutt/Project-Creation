document.addEventListener("DOMContentLoaded", () => {
    // Authentication check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const studentForm = document.getElementById("studentForm");
    const studentTable = document.getElementById("studentTableBody");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const closeEditModalBtn = document.getElementById("closeEditModal");
    const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    const updateStudentBtn = document.getElementById("updateStudent");

    let students = JSON.parse(localStorage.getItem("students")) || [];
    let editIndex = -1;
    let deleteIndex = -1;

    function saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(students));
    }

    function renderTable() {
        studentTable.innerHTML = "";
        
        if (students.length === 0) {
            let emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `<td colspan="5" class="p-4 text-gray-500">No students found. Add a student to get started.</td>`;
            studentTable.appendChild(emptyRow);
            return;
        }
        
        students.forEach((student, index) => {
            let row = document.createElement("tr");
            row.classList.add("border-b", "hover:bg-gray-50");

            row.innerHTML = `
                <td class='p-3'>${student.id}</td>
                <td class='p-3'>${student.name}</td>
                <td class='p-3'>${student.contact}</td>
                <td class='p-3'>${student.course}</td>
                <td class='p-3 space-x-2'>
                    <button class='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 edit-btn' data-index="${index}">Edit</button>
                    <button class='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 delete-btn' data-index="${index}">Delete</button>
                </td>
            `;

            studentTable.appendChild(row);
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (e) => openEditModal(e.target.getAttribute("data-index")));
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (e) => openDeleteModal(e.target.getAttribute("data-index")));
        });
    }

    studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const contact = document.getElementById("contact").value;
        const course = document.getElementById("course").value;

        // Check if ID already exists when adding a new student
        if (editIndex === -1 && students.some(student => student.id === id)) {
            alert("A student with this ID already exists. Please use a different ID.");
            return;
        }

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

    function openEditModal(index) {
        editIndex = index;
        const student = students[index];
        document.getElementById("editId").value = student.id;
        document.getElementById("editName").value = student.name;
        document.getElementById("editContact").value = student.contact;
        document.getElementById("editCourse").value = student.course;
        editModal.classList.remove("hidden");
    }

    updateStudentBtn.addEventListener("click", () => {
        if (editIndex !== -1) {
            const newId = document.getElementById("editId").value;
            
            // Check if new ID conflicts with any other student except the current one
            const idExists = students.some((student, idx) => 
                student.id === newId && idx !== editIndex
            );
            
            if (idExists) {
                alert("A student with this ID already exists. Please use a different ID.");
                return;
            }
            
            students[editIndex] = {
                id: newId,
                name: document.getElementById("editName").value,
                contact: document.getElementById("editContact").value,
                course: document.getElementById("editCourse").value,
            };
            saveToLocalStorage();
            renderTable();
            editModal.classList.add("hidden");
        }
    });

    closeEditModalBtn.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });

    function openDeleteModal(index) {
        deleteIndex = index;
        deleteModal.classList.remove("hidden");
    }

    confirmDeleteBtn.addEventListener("click", () => {
        if (deleteIndex !== -1) {
            students.splice(deleteIndex, 1);
            saveToLocalStorage();
            renderTable();
            deleteModal.classList.add("hidden");
        }
    });

    closeDeleteModalBtn.addEventListener("click", () => {
        deleteModal.classList.add("hidden");
    });

    renderTable();
});

document.addEventListener("DOMContentLoaded", function () {
    const idInput = document.getElementById("id");
    const contactInput = document.getElementById("contact");
    const editIdInput = document.getElementById("editId");
    const editContactInput = document.getElementById("editContact");

    function preventNonNumericInput(event) {
        if (event.key === "e" || event.key === "E" || event.key === "+" || event.key === "-") {
            event.preventDefault();
        }
    }

    if (idInput) idInput.addEventListener("keydown", preventNonNumericInput);
    if (contactInput) contactInput.addEventListener("keydown", preventNonNumericInput);
    if (editIdInput) editIdInput.addEventListener("keydown", preventNonNumericInput);
    if (editContactInput) editContactInput.addEventListener("keydown", preventNonNumericInput);
});

