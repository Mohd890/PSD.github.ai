import supabase from "./supabase.js"; // Import Supabase

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("full_name, role")
      .eq("email", supabase.auth.user().email)
      .single();

    if (error) {
      alert("Error loading profile data: " + error.message);
      window.location.href = "index.html"; // Redirect back to login if error
    } else {
      console.log("Profile data:", data);
      document.getElementById("username").innerText = data.full_name || "User";
      document.getElementById("role").innerText = `Role: ${data.role || "User"}`;
    }
  } catch (err) {
    alert("An error occurred. Please try again.");
    console.error("Profile error:", err);
    window.location.href = "index.html"; // Redirect back to login if error
  }
});

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to login page
  } catch (err) {
    alert("Error logging out: " + err.message);
    console.error("Logout error:", err);
  }
}
