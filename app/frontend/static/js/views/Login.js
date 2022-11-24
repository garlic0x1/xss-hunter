import AbstractView from "./AbstractView.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }
  
  async doScript() {
    loadLoginScript();
  }
  
  async getHtml() {
    
    return `
      <link rel="stylesheet" href="/static/css/login.css">
      <div class="container">
        <form class="form" id="login">
          <h1 class="form__title">Login</h1>
          <div class="form__message form__message--error"></div>
          <div class="form__input-group">
            <input type="text" class="form__input" autofocus placeholder="Username">
            <div class="form__input-error-message"></div>
          </div>
          <div class="form__input-group">
            <input type="password" class="form__input" autofocus placeholder="Password">
            <div class="form__input-error-message"></div>
          </div>
          <button class="form__button" type="submit">Continue</button>
          <p class="form__text">
            <a class="form__link" href="./" id="linkCreateAccount">Don't have an account? Sign up</a>
          </p>
        </form>
        <form class="form form--hidden" id="createAccount">
          <h1 class="form__title">Create Account</h1>
          <div class="form__message form__message--error"></div>
          <div class="form__input-group">
            <input type="text" id="signupUsername" class="form__input" autofocus placeholder="Username">
            <div class="form__input-error-message"></div>
          </div>
          <div class="form__input-group">
            <input type="password" class="form__input" autofocus placeholder="Password">
            <div class="form__input-error-message"></div>
          </div>
          <div class="form__input-group">
            <input type="password" class="form__input" autofocus placeholder="Confirm password">
            <div class="form__input-error-message"></div>
          </div>
          <button class="form__button" type="submit">Continue</button>
          <p class="form__text">
            <a class="form__link" href="./" id="linkLogin">Already have an account? Log in</a>
          </p>
        </form>
      </div>
    `;
  }
}

// private funcs

function setLoginFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setLoginInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearLoginInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

function loadLoginScript() {
  console.log(
    "loginscript Load"
  );
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login
        let username = e.target[0].value;
        let password = e.target[1].value;
        
        fetch("/auth/login", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        }).then( (resp) => {
          console.log({ resp });
          if (resp.ok) {
            window.localStorage.setItem("authenticated", true);
            navigateTo("/");
          } else {
            setLoginFormMessage(loginForm, "error", "Invalid username/password combination");
          }
        });
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login
        let username = e.target[0].value;
        let password = e.target[1].value;
        let check_password = e.target[2].value;
    
        if (password !== check_password) {
          setLoginFormMessage(createAccountForm, "error", "Passwords do not match");
          return;
        }
        
        fetch("/auth/signup", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        }).then( (resp) => {
          // const status = resp.headers.get("status");
          switch (resp.status) {
            case 406:
              // unacceptable username or password
              setLoginFormMessage(createAccountForm, "error", "Username or password not allowed");
              break;
            case 401:
              // username unavailable
              setLoginFormMessage(createAccountForm, "error", "Username already in use");
              break;
            case 200:
              // if successful account creation, try to log in
              fetch("/auth/login", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username,
                  password
                })
              }).then( (resp) => {
                console.log({ resp });
                if (resp.ok) {
                  window.localStorage.setItem("authenticated", true);
                  navigateTo("/");
                } else {
                  setLoginFormMessage(loginForm, "error", "Account created, login failed");
                }
              });
              break;
          }
        });
        
    

        setLoginFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            // if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
            //     setLoginInputError(inputElement, "Username must be at least 10 characters in length");
            // }
        });

        inputElement.addEventListener("input", e => {
            clearLoginInputError(inputElement);
        });
    }); 
}
