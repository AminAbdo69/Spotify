var username = sessionStorage.getItem("username");

document.getElementById("myform").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  const Username = username;
  const OldPassword = document.getElementById("oldpassword").value;
  const NewPassword = document.getElementById("newpassword").value;
  const ConfirmPassword = document.getElementById("confirmpassword").value;

  if (NewPassword !== ConfirmPassword) {
    console.error("New password does not match confirm password");
    return;
  }

  const url = "https://localhost:7259/api/Artist/ChangeData"; // Replace with your actual API endpoint

  const requestData = {
    Username: Username,
    OldPassword: OldPassword,
    NewPassword: NewPassword,
    ConfirmPassword: ConfirmPassword,
    // Add any other properties required by the `ChangedataDTO` object
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
    console.log(data); // Handle the response data
  } catch (error) {
    console.error("Error:", error);
  }
});
