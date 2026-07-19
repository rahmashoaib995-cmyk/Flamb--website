let email = document.querySelector("#email");
let password = document.querySelector("#password");
let rememberMe = document.querySelector("#rememberMe");
let loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
        alert("Please fill in all required fields!");
        return;
    }

    let savedEmail = localStorage.getItem("email");
    let savedPassword = localStorage.getItem("password");
    let savedFirstName = localStorage.getItem("firstName");

    if (savedEmail && savedEmail.trim() === email.value && savedPassword === password.value) {

        if (rememberMe.checked) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUserName", savedFirstName);
        } else {
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("loggedInUserName", savedFirstName);
        }

        window.location.href = "index.html";

    } else {
        alert("Email or password is incorrect!");
    }
});