import supabase from "./supabase.js"; // Import Supabase

console.log("index.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and script is running!");

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    console.log("Login form found!");
    
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Login form submitted!");

      const identifier = document.getElementById("identifier").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();

      if (!identifier || !password) {
        alert("Please enter both Email or Username and Password.");
        return;
      }

      console.log("Attempting to log in with Identifier:", identifier);

      try {
        // Manual login for Admin
        if (identifier === "admin" && password === "M123321") {
          console.log("Admin login successful!");
          alert("Logged in successfully as Admin!");
          window.location.replace("profile.html"); // Redirect to profile page
          return;
        }

        // Supabase Authentication login
        let { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.includes('@') ? identifier : `${identifier}@yourcompany.com`,
          password: password,
        });

        console.log("Supabase login response:", data);
        console.error("Supabase login error:", error);

        if (error) {
          if (!error.message.includes("Invalid login credentials")) {
            alert("Login failed: " + error.message);
            return;
          }

          // Try logging in with username if email fails
          if (!identifier.includes('@')) {
            console.log("Trying login with username...");
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("email")
              .eq("username", identifier)
              .single();

            if (userError || !userData) {
              alert("Invalid Email or Username. Please try again.");
              return;
            }

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

        console.log("User logged in successfully!", data);
        alert("Logged in successfully!");

        // Get user session
        const { data: session, error: sessionError } = await supabase.auth.getUser();
        console.log("Session Data:", session);
        console.error("Session Error:", sessionError);

        if (sessionError) {
          alert("Error getting user session: " + sessionError.message);
          return;
        }

        // Redirect to profile
        console.log("Redirecting to profile...");
        setTimeout(() => {
          window.location.replace("profile.html");
        }, 2000);
        
      } catch (err) {
        alert("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
    });
  } else {
    console.log("Login form not found!");
  }
});
