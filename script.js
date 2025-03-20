document.addEventListener("DOMContentLoaded", () => {
    // Authentication check
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const studentForm = document.getElementById("studentForm");
    const studentTable = document.getElementById("studentTableBody");
    const numberOfStudents = document.getElementById("numberofstudents");

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
        } else {
            students.forEach((student, index) => {
                let row = document.createElement("tr");
                row.classList.add("border-b", "hover:bg-gray-50");

                row.innerHTML = `
                    <td class='p-3'>${student.id}</td>
                    <td class='p-3'>${student.name}</td>
                    <td class='p-3'>${student.contact}</td>
                    <td class='p-3'>${student.course}</td>
                    <td class='p-3 space-x-2'>
                        <button class='bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded edit-btn' data-index="${index}">Edit</button>
                        <button class='bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded  delete-btn' data-index="${index}">Delete</button>
                    </td>
                `;

                studentTable.appendChild(row);
            });

            document.querySelectorAll(".edit-btn").forEach((button) => {
                button.addEventListener("click", (e) => openEditModal(e.target.getAttribute("data-index")));
            });

            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", (e) => openDeleteModal(e.target.getAttribute("data-index")));
            });
        }

        // **Update the student count**
        updateStudentCount();
    }

    function updateStudentCount() {
        numberOfStudents.textContent = students.length;
    }

    studentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const contact = document.getElementById("contact").value;
        const course = document.getElementById("course").value;

        // Check if ID already exists when adding a new student
        if (editIndex === -1 && students.some((student) => student.id === id)) {
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
            const newId = document.getElementById("editId").value.trim();
            const newName = document.getElementById("editName").value.trim();
            const newContact = document.getElementById("editContact").value.trim();
            const newCourse = document.getElementById("editCourse").value.trim();
    
            if (!newId || !newName || !newContact || !newCourse) {
                alert("All fields are required!");
                return;
            }
    
            // Update the student information (without checking for duplicate ID)
            students[editIndex].id = newId;
            students[editIndex].name = newName;
            students[editIndex].contact = newContact;
            students[editIndex].course = newCourse;
    
            // Save and re-render
            saveToLocalStorage();
            renderTable();
    
            // Close modal
            editModal.classList.add("hidden");
    
            // Reset editIndex
            editIndex = -1;
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
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        console.error("Search input not found!");
        return;
    }

    searchInput.addEventListener("keyup", function () {
        let searchValue = this.value.toLowerCase();
        let studentRows = document.querySelectorAll("#studentTableBody tr");

        studentRows.forEach(row => {
            let studentName = row.children[1]?.textContent.toLowerCase(); // Check if element exists
            if (studentName && studentName.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});

function checkAuthAndLoad() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // If authenticated, display user info and continue loading
    document.getElementById('userDisplay').textContent = currentUser.fullName.split(' ')[0]; // Show first name
    hideLoader();
}

document.addEventListener("DOMContentLoaded", () => {
    let loader = document.getElementById('loader');
    let progressBar = document.getElementById('progressBar');

    // Reset loader visibility
    loader.style.display = 'flex'; // Ensure it's shown
    loader.style.opacity = '1';

    // Simulate progress bar animation
    let progress = 0;
    let interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 200); // Adjust timing for smooth effect

    // Keep loader visible for about 2 seconds before hiding
    setTimeout(() => {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0'; // Fade out effect

        setTimeout(() => {
            loader.style.display = 'none'; // Fully hide after fading
            document.getElementById('content').classList.remove('hidden');
            document.getElementById('tableSection').classList.remove('hidden');
        }, 500); // Matches fade-out duration
    }, 2000); // Loader stays visible for 2 seconds
});




// Profile Modal Events
document.getElementById('profileLink').addEventListener('click', function(e) {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('profileName').textContent = currentUser.fullName;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileModal').classList.remove('hidden');
});

document.getElementById('closeProfileModal').addEventListener('click', function() {
    document.getElementById('profileModal').classList.add('hidden');
});

// Logout Event
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});