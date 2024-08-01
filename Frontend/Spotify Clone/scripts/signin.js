const form = document.getElementById("myform");

// document
//   .getElementById("myform")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault(); // Prevent form submission

//     var Username = document.getElementById("username").value;
//     var FirstName = document.getElementById("firstname").value;
//     var LastName = document.getElementById("lasttname").value;
//     var Email = document.getElementById("email").value;
//     var Password = document.getElementById("password").value;

//     const data = {
//       Username,
//       FirstName,
//       LastName,
//       Email,
//       Password,
//     };

//     try {
//       const response = await fetch("https://localhost:7259/api/Auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("User registered successfully:", result);
//         console.log(Username + " added successfully");
//         document.getElementById("username").value = "";
//         document.getElementById("firstname").value = "";
//         document.getElementById("lasttname").value = "";
//         document.getElementById("email").value = "";
//         document.getElementById("password").value = "";
//       } else {
//         document.getElementById("Error").textContent = "Error in registration.";
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//       document.getElementById("Error").textContent = "An error occurred.";
//     }
//   });

document.getElementById("myform").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData();
  formData.append("username", document.getElementById("username").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("password", document.getElementById("password").value);
  formData.append("firstName", document.getElementById("firstname").value);
  formData.append("lastName", document.getElementById("lasttname").value);
  formData.append("image", document.getElementById("profileImage").files[0]);

  fetch("https://localhost:7259/api/Auth/register", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User registered successfully:", data);
      document.getElementById("username").value = "";
      document.getElementById("firstname").value = "";
      document.getElementById("lasttname").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("profileImage").value = "";
      alert("User registered successfully");
      location.href = "/Login.html";
      // Handle success (e.g., redirect to login page)
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error
    });
});
