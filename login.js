document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("emailid").value.trim();
  const password = document.getElementById("passwordid").value.trim();
  const errorMsg = document.getElementById("loginerror");

  errorMsg.textContent = ""; // clear old message

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    errorMsg.textContent = "Please enter a valid email address";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters";
    return;
  }

  fetch("https://taskraft.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email, 
      password: password
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Response:", data);

      if (data.user) {
        // ✅ Store user in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // ✅ Redirect only if the same email is returned
        if (data.user.email === email) {
          alert("Login successful!");
          window.location.href = "index.html";
        }
      } else {
        errorMsg.textContent = data.message || "Invalid credentials.";
      }
    })
    .catch(err => {
      console.error(err);
      errorMsg.textContent = "Something went wrong. Please try again.";
    });
});
