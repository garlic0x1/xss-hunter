import { navigateTo } from "../navigation.js";
import { buildElement } from "../builder.js";

export function login(_params) {
  document.title = "Login";
  return buildElement("div")
    .withClasses(["form__box", "center"])
    .withChild(loginForm())
    .withChild(signupForm())
    .withChild(toggleForm())
    .build();
}

function loginForm() {
  return buildElement("form")
    .withClass("form")
    .withChild(
      buildElement("h1")
        .withClass("form__title")
        .withText("Log in")
        .build()
    )
    .withChild(errorMessage())
    .withChildren([
      textField("text", "Username"),
      textField("password", "Password"),
      submitButton()
    ])
    .withEventListener("submit", e => {
      e.preventDefault();
      doLogin(e.target[0].value, e.target[1].value);
    })
    .build();
}

function signupForm() {
  return buildElement("form")
    .withClasses(["form", "form--hidden"])
    .withChild(
      buildElement("h1")
        .withClass("form__title")
        .withText("Sign up")
        .build()
    )
    .withChild(errorMessage())
    .withChildren([
      textField("text", "Username"),
      textField("password", "Password"),
      textField("password", "Confirm password"),
      submitButton()
    ])
    .withEventListener("submit", e => {
      e.preventDefault();
      let username = e.target[0].value;
      let password = e.target[1].value;
      if (password != e.target[2].value) {
        console.log("pass no match")
        setError("passwords dont match");
        return;
      }

      fetch("/auth/signup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password
        })
      }).then(resp => {
        switch (resp.status) {
          case 401:
            setError("user/pass in use");
            break;
          case 406:
            setError("user/pass not allowed");
            break;
          case 200:
            doLogin(username, password);
        }
      })
    })
    .build();
}

function toggleForm() {
  return buildElement("div")
    .withStyle("text-align", "center")
    .withHtml(`
        <a class="form__link form--toggle form--hidden">Not registered? Sign up</a>
        <a class="form__link form--toggle">Already have an account? Log in</a>
      `)
    .withEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll("form.form").forEach(el => {
        if (el.classList.contains("form--hidden"))
          el.classList.remove("form--hidden");
        else
          el.classList.add("form--hidden");
      });
      document.querySelectorAll("*.form--toggle").forEach(el => {
        if (el.classList.contains("form--hidden"))
          el.classList.remove("form--hidden");
        else
          el.classList.add("form--hidden");
      });
    })
    .build();
}

function submitButton() {
  return buildElement("button")
    .withClass("form__button")
    .withAttribute("type", "submit")
    .withText("Continue")
    .build();
}

function errorMessage() {
  return buildElement("div")
    .withClasses(["form__message", "form__message--error"])
    .withAttribute("id", "formErrorMessage")
    .build();
}

function setError(message) {
  document.querySelectorAll("#formErrorMessage").forEach(el => el.innerText = message);
}

function textField(type, placeholder) {
  return buildElement("div")
    .withClass("form__input-group")
    .withHtml(`
      <input type="${type}" class="form__input" autofocus placeholder="${placeholder}">
      <div class="form__input-error-message"></div>
    `)
    .build();
}

function doLogin(username, password) {
  fetch("/auth/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password
    })
  }).then((resp) => {
    if (resp.ok) {
      window.localStorage.setItem("authenticated", true);
      navigateTo("/pages");
    } else {
      setError("Invalid username/password combination");
    }
  });
}
