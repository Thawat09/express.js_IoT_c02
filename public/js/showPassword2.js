const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("inputPassword");
togglePassword.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("bi-eye");
});

const form = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
});

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPassword = document.getElementById("inputConfirmPassword");
toggleConfirmPassword.addEventListener("click", function () {
    const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
    confirmPassword.setAttribute("type", type);
    this.classList.toggle("bi-eye");
});

const formConfirm = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
});