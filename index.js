import supabase from "./supabase.js"; // Import Supabase

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent form submission
      console.log("Form submission prevented, script is running!");

      const identifier = document.getElementById("identifier").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();

      if (!identifier || !password) {
        alert("Please enter both Email or Username and Password.");
        return;
      }

      console.log("Attempting to log in with Identifier:", identifier);

      try {
        // Manual login for testing: Admin with password M123321
        if (identifier === "admin" && password === "M123321") {
          alert("Logged in successfully as Admin!");
          window.location.href = "profile.html"; // Redirect to profile page
          loadUserData({ full_name: "Admin" });
          return;
        }

        // Supabase Authentication login with Email or Username
        let { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.includes('@') ? identifier : `${identifier}@yourcompany.com`,
          password: password,
        });

        if (error) {
          if (!error.message.includes("Invalid login credentials")) {
            alert("Login failed: " + error.message);
            return;
          }

          // If email fails, try with username
          if (!identifier.includes('@')) {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("email")
              .eq("username", identifier)
              .single();

            if (userError || !userData) {
              alert("Invalid Email or Username. Please try again.");
              return;
            }

            // Try logging in with the email associated with the username
            ({ data, error } = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: password,
            }));
          }

          if (error) {
            alert("Incorrect password. Please try again.");
            return;
          }
        }

        console.log("User logged in:", data);
        alert("Logged in successfully!");
        window.location.href = "profile.html"; // Redirect to profile page
        loadUserData();
      } catch (err) {
        alert("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
    }, { once: true }); // Prevent multiple event listeners (fix refresh issue)
  }
});

async function loadUserData(userData = null) {
  if (userData) {
    document.getElementById("username").innerText = userData.full_name;
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .select("full_name, role")
    .eq("email", supabase.auth.user().email)
    .single();

  if (error) {
    alert("Error loading user data: " + error.message);
  } else {
    console.log("User data:", data);
    document.getElementById("username").innerText = data.full_name;
  }
}
