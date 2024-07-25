const form = document.getElementById("myform");

document
  .getElementById("myform")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    var Username = document.getElementById("username").value;
    var FirstName = document.getElementById("firstname").value;
    var LastName = document.getElementById("lasttname").value;
    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;

    const data = {
      Username,
      FirstName,
      LastName,
      Email,
      Password,
    };

    try {
      const response = await fetch("https://localhost:7259/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User registered successfully:", result);
        console.log(Username + " added successfully");
        document.getElementById("username").value = "";
        document.getElementById("firstname").value = "";
        document.getElementById("lasttname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      } else {
        document.getElementById("Error").textContent = "Error in registration.";
      }
    } catch (error) {
      console.error("An error occurred:", error);
      document.getElementById("Error").textContent = "An error occurred.";
    }
  });

// document.getElementById("myform").addEventListener("submit", async (event) => {
//   event.preventDefault(); // Prevent the default form submission behavior

//   const form = event.target;
//   const formData = new FormData(form);

//   // Convert form data to an object
//   const user = {};
//   formData.forEach((value, key) => {
//     user[key] = value;
//   });

//   try {
//     // Make an HTTP POST request to your API endpoint
//     const response = await fetch("https://localhost:7259/api/Auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(user),
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("User registered successfully:", data);
//     // Handle success (e.g., show a success message to the user)
//   } catch (error) {
//     console.error("Error registering user:", error);
//     // Handle error (e.g., show an error message to the user)
//   }
// });
