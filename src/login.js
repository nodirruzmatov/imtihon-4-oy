"use strict";

const elForm = document.querySelector(".form");
const elUsernameInput = document.querySelector(".username-input");
const elPassword = document.querySelector(".password-input");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const usernameInputValue = elUsernameInput.value;
  const passwordValue = elPassword.value;

  console.log(usernameInputValue, passwordValue);
  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: usernameInputValue,
      password: passwordValue,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.token) {
        window.localStorage.setItem("token", data.token);

        window.location.replace("index.html");
      } else {
        alert("nimadir hato");
      }
    });
});
