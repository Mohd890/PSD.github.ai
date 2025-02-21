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
          return;
        }

        // Supabase Authentication login with Email or Username
        let { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.includes('@') ? identifier : `${identifier}@yourcompany.com`,
          password: password,
        });

        console.log("Supabase login response:", data, error);

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

        console.log("User logged in successfully!", data);
        alert("Logged in successfully!");

        // Get user session and load user data
        const { data: session, error: sessionError } = await supabase.auth.getUser();
        if (sessionError) {
          alert("Error getting user session: " + sessionError.message);
          return;
        }

        console.log("Session data:", session);

        // Redirect to profile
        console.log("Redirecting to profile...");
        window.location.href = "profile.html";
      } catch (err) {
        alert("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
    });
  }
});
