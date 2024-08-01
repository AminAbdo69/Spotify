const loginform = document.getElementById("artistLoginForm");

document
  .getElementById("artistLoginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const Username = document.getElementById("loginusername").value;
    sessionStorage.setItem("username", Username);
    const Password = document.getElementById("loginpassword").value;
    const data = {
      Username,
      Password,
    };

    try {
      // Make an HTTP POST request to your API endpoint
      const response = await fetch(
        "https://localhost:7259/api/Artist/Artistlogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      if (result.isActive === false) {
        location.href = "/artist/changepassword.html";
      }
      location.href = "/artist/artistDashboard.html";
      document.getElementById("loginusername").value = "";
      document.getElementById("loginpassword").value = "";
      // Handle the token (e.g., store it in local storage or use it for subsequent requests)
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error (e.g., show an error message to the user)
    }
  });
