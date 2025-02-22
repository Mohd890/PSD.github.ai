import supabase from "./supabase.js"; // Import Supabase

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      alert("Please log in to view your profile.");
      window.location.href = "index.html"; // Redirect to login if not authenticated
      return;
    }

    // Fetch user data from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("username, jobNumber, full_name, role")
      .eq("email", user.email)
      .single();

    if (error) {
      alert("Error loading profile data: " + error.message);
      window.location.href = "index.html"; // Redirect back to login if error
    } else {
      console.log("Profile user data:", data);
      document.getElementById("user-info").innerHTML = `
        <p>Username: ${data.username || "N/A"}</p>
        <p>Job Number: ${data.jobNumber || "N/A"}</p>
        <p>Full Name: ${data.full_name || "User"}</p>
        <p>Role: ${data.role || "User"}</p>
      `;

      // Fetch report statistics from localStorage or Supabase
      const reportStats = getReportStatistics();
      displayReportStats(reportStats);
    }
  } catch (err) {
    alert("An error occurred. Please try again.");
    console.error("Profile error:", err);
    window.location.href = "index.html"; // Redirect back to login if error
  }
});

function getReportStatistics() {
  const stats = {
    RM: 0, PM: 0, CM: 0, Req: 0, E: 0, IP: 0
  };

  // Check localStorage for report counts (based on reportNumber)
  for (let key in localStorage) {
    if (key.startsWith('lastReportNumber_')) {
      const [reportType, sector] = key.split('_').slice(1);
      stats[reportType]++;
    }
  }

  return stats;
}

function displayReportStats(stats) {
  const statsDiv = document.getElementById("report-stats");
  statsDiv.innerHTML = `
    <p>Routine Maintenance (RM): ${stats.RM}</p>
    <p>Preventive Maintenance (PM): ${stats.PM}</p>
    <p>Corrective Maintenance (CM): ${stats.CM}</p>
    <p>Requests (Req): ${stats.Req}</p>
    <p>Emergency (E): ${stats.E}</p>
    <p>Inspection (IP): ${stats.IP}</p>
  `;
}

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

function goToReports() {
  window.location.href = "report.html"; // Redirect to report page
}
