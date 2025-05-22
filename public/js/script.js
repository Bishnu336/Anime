// Signup logic
document.getElementById("signupForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  // Save to localStorage
  localStorage.setItem("animeUser", JSON.stringify({ username, password }));
  alert("Signup successful! Redirecting to login...");
  window.location.href = "login.html";
});

// Login logic
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const storedUser = JSON.parse(localStorage.getItem("animeUser"));

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    alert("Login successful!");
    window.location.href = "../index.html";
  } else {
    alert("Invalid username or password.");
  }
});
