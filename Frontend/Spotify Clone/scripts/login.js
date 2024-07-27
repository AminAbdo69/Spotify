const loginform = document.getElementById("loginform");

document
  .getElementById("loginform")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const UserName = document.getElementById("loginusername").value;
    const Password = document.getElementById("loginpassword").value;
    const data = {
      UserName,
      Password,
    };

    try {
      // Make an HTTP POST request to your API endpoint
      const response = await fetch("https://localhost:7259/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const token = await response.text();
      console.log("Login successful. Token:", token);
      sessionStorage.setItem("username", UserName);
      location.href = "/index2.html";
      // Handle the token (e.g., store it in local storage or use it for subsequent requests)
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error (e.g., show an error message to the user)
    }
  });
