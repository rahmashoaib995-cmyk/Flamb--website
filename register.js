let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let registerBtn = document.querySelector("#registerBtn");

registerBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (firstName.value === "" || lastName.value === "" || email.value === "" || password.value === "") {
        alert("Please fill in all required fields!");
    } else {
        localStorage.setItem("firstName", firstName.value);
        localStorage.setItem("lastName", lastName.value);
        localStorage.setItem("email", email.value);
        localStorage.setItem("password", password.value);

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1000);
    }
});