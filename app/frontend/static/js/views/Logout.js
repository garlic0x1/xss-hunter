import AbstractView from "./AbstractView.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Dashboard");
  }
  
  async doScript() {
    loadLogoutScript();
  }
  
  async getHtml() {
    return `
      <link rel="stylesheet" href="/static/css/login.css">
      <h1> Are you sure you want to log out? </h1>
      <form class="form" id="logout">
        <button class="form__button" type="submit">Log out</button>
      </form> 
    `;
  }
}

function loadLogoutScript() {
  const logoutForm = document.querySelector("#logout");
  
  logoutForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch("/auth/logout").then( (resp) => {
      window.localStorage.setItem("authenticated", false);
      navigateTo("/login");
    });
  });
}
