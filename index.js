import supabase from "./supabase.js";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Form submission prevented, script is running!");

      const identifier = document.getElementById("identifier").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();
      const loginMessage = document.getElementById("login-message");

      if (!identifier || !password) {
        loginMessage.innerText = "Please enter both Email or Username and Password.";
        return;
      }

      console.log("Attempting to log in with Identifier:", identifier);

      try {
        // Manual login for testing: Admin with password M123321
        if (identifier === "admin" && password === "M123321") {
          loginMessage.innerText = "Logged in successfully as Admin!";
          setTimeout(() => {
            window.location.href = "./profile.html";
          }, 1000); // Redirect after 1 second
          return;
        }

        // Supabase Authentication login with Email or Username
        let { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.includes("@") ? identifier : `${identifier}@yourcompany.com`,
          password: password,
        });

        if (error) {
          if (!error.message.includes("Invalid login credentials")) {
            loginMessage.innerText = "Login failed: " + error.message;
            return;
          }

          // If email fails, try with username
          if (!identifier.includes("@")) {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("email")
              .eq("username", identifier)
              .single();

            if (userError || !userData) {
              loginMessage.innerText = "Invalid Email or Username. Please try again.";
              return;
            }

            // Try logging in with the email associated with the username
            ({ data, error } = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: password,
            }));
          }

          if (error) {
            loginMessage.innerText = "Incorrect password. Please try again.";
            return;
          }
        }

        console.log("User logged in:", data);
        loginMessage.innerText = "Logged in successfully!";
        setTimeout(() => {
          window.location.href = "./profile.html";
        }, 1000); // Redirect after 1 second
        loadUserData();
      } catch (err) {
        loginMessage.innerText = "An error occurred. Please try again.";
        console.error("Login error:", err);
      }
    });
  }
});

async function loadUserData() {
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
