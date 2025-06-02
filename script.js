// Retrieve existing students or initialize empty array
let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

// Elements
const form = document.getElementById("studentForm");
const tbody = document.querySelector("#studentTable tbody");

// Validation helpers
function isValidName(name) {
  return /^[A-Za-z ]+$/.test(name);
}

function isValidNumber(num) {
  return /^\d+$/.test(num);
}

function isValidEmail(email) {
  return /^[^@]+@[^@]+\.[a-z]{2,}$/i.test(email);
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function clearTable() {
  tbody.innerHTML = "";
}

function renderTable() {
  clearTable();

  students.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td>
        <button class="action-btn edit-btn" data-index="${index}">Edit</button>
        <button class="action-btn delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetForm() {
  form.reset();
  editIndex = null;
  form.querySelector("button[type=submit]").textContent = "Submit";
}

// Initial render
renderTable();

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const studentId = form.studentId.value.trim();
  const email = form.email.value.trim();
  const contact = form.contact.value.trim();

  if (!name || !studentId || !email || !contact) {
    alert("Please fill in all fields.");
    return;
  }

  if (!isValidName(name)) {
    alert("Name should contain only letters and spaces.");
    return;
  }

  if (!isValidNumber(studentId)) {
    alert("Student ID should contain only numbers.");
    return;
  }

  if (studentId.length > 4) {
    alert("Student ID should be maximum 4 digits.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email.");
    return;
  }

  if (!isValidNumber(contact)) {
    alert("Contact should contain only numbers.");
    return;
  }

  if (contact.length !== 10) {
    alert("Contact number should be exactly 10 digits.");
    return;
  }

  // Check for duplicate student ID (except when editing the same record)
  const isDuplicateId = students.some((student, idx) => student.studentId === studentId && idx !== editIndex);

  if (isDuplicateId) {
    alert("Student ID already exists. Please enter a unique Student ID.");
    return;
  }

  const studentData = { name, studentId, email, contact };

  if (editIndex === null) {
    // Add new student
    students.push(studentData);
  } else {
    // Update existing student
    students[editIndex] = studentData;
  }

  saveStudents();
  renderTable();
  resetForm();
});

// Handle Edit/Delete button clicks with event delegation
tbody.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("edit-btn")) {
    // Edit student
    editIndex = Number(target.dataset.index);
    const student = students[editIndex];

    form.name.value = student.name;
    form.studentId.value = student.studentId;
    form.email.value = student.email;
    form.contact.value = student.contact;
    form.querySelector("button[type=submit]").textContent = "Update";
  } else if (target.classList.contains("delete-btn")) {
    // Delete student
    const delIndex = Number(target.dataset.index);
    if (confirm("Are you sure you want to delete this record?")) {
      students.splice(delIndex, 1);
      saveStudents();
      renderTable();
      if (editIndex === delIndex) resetForm();
    }
  }
});
