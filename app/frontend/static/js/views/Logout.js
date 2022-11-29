import AbstractView from "./AbstractView.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.set_title("Dashboard");
  }
  
  update() {
    const logoutForm = document.querySelector("#logout");
    
    logoutForm.addEventListener("submit", e => {
      e.preventDefault();
      fetch("/auth/logout").then( (resp) => {
        if (resp.ok) {
          window.localStorage.setItem("authenticated", false);
          navigateTo("/login");
        } else {
          console.log("something went wrong...");
        }
      });
    });
  }
  
  html() {
    return `
    <div class="center">
    <div class="form__box">
      <h1 class="form__title"> Are you sure? </h1>
      <form class="form" id="logout">
        <button class="form__button" type="submit">Log out</button>
      </form> 
    </div>
    </div>
    `;
  }
}
