document.getElementById("myform").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;

  const url = "https://localhost:7259/api/Artist/Artistregister"; // Replace with your actual API endpoint

  const requestData = {
    Username: username,
    Email: email,
    // Add any other properties required by the `ArtistRegisterDTO` object
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.text();
    console.log(data);
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    // Handle the response data
  } catch (error) {
    console.error("Error:", error);
  }
});
