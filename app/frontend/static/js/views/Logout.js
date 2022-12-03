import { gotoLogin } from "../navigation.js";
import { buildElement } from "../builder.js";

export function logout(_params) {
  document.title = "Logout";
  return buildElement("div")
    .withClass("form__box")
    .withClass("center")
    .withHtml("<h1> Are you sure? </h1>")
    .withChild(logoutForm())
    .build();
}

function logoutForm() {
  return buildElement("form")
    .withHtml(`<button class="form__button" type="submit">Log out</button>`)
    .withEventListener("submit", e => {
      e.preventDefault();
      fetch("/auth/logout").then((resp) => {
        if (resp.ok) gotoLogin();
        else console.log("something went wrong...");
      });
    })
    .build();
}

