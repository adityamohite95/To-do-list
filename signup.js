document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const first = document.getElementById("first_name").value.trim();
    const last = document.getElementById("last_name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-pass").value.trim();
    const confirm = document.getElementById("signup-conf").value.trim();
    const errorMsg = document.getElementById("signup-error");
    errorMsg.textContent = "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

   // if (name === "") {
   //     errorMsg.textContent = "Name cannot be Empty";
   // }
     if (!emailPattern.test(email)) {
        errorMsg.textContent = "Invalid Email";
    } else if (!passwordPattern.test(password)) {
        errorMsg.textContent = "Password must 6+ character and include upper/lower case and special symbol";
    } else if (password !== confirm) {
        errorMsg.textContent = "Password does not match";
    } else {
        fetch("https://taskraft.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name:first,
                last_name:last,
                email: email,
                password: password
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Response:",data);
                if (data.success || data.message?.toLowerCase().includes("success")) {
                    alert("Signup successfully");
                    setTimeout(() => window.location.href = "login.html", 500);
                } else {
                    errorMsg.textContent = data.message || "Signup Failed. try Again";
                }
            })
            .catch((err) => {
                console.error(err);
                errorMsg.textContent = "Server error. Please try again";
            });
    }
});