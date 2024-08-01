// document.getElementById("myform").addEventListener("submit", async (event) => {
//   event.preventDefault(); // Prevent the default form submission behavior

//   const username = document.getElementById("username").value;
//   const email = document.getElementById("email").value;

//   const url = "https://localhost:7259/api/Artist/Artistregister"; // Replace with your actual API endpoint

//   const requestData = {
//     Username: username,
//     Email: email,
//     // Add any other properties required by the `ArtistRegisterDTO` object
//   };

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   };

//   try {
//     const response = await fetch(url, requestOptions);
//     const data = await response.text();
//     console.log(data);
//     document.getElementById("username").value = "";
//     document.getElementById("email").value = "";
//     // Handle the response data
//   } catch (error) {
//     console.error("Error:", error);
//   }
// });

document.getElementById("myform").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData();
  formData.append("username", document.getElementById("username").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("image", document.getElementById("profileImage").files[0]);

  fetch("https://localhost:7259/api/Artist/Artistregister", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Assuming the response is a plain text message
    })
    .then((data) => {
      console.log("Success:", data);
      console.log(data);
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      document.getElementById("profileImage").value = "";
      // Handle success (e.g., show a success message or redirect to another page)
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    });
});
