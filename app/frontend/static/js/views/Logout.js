import { navigateTo } from "../auxiliary/navigation.js";
import { buildElement } from "../builder.js";

export function logout(_params) {
  document.title = "Logout";
  return buildElement("div")
    .withClass("center")
    .withChild(
      buildElement("div")
        .withClass("form__box")
        .withHtml("<h1> Are you sure? </h1>")
        .withChild(logoutForm())
        .build()
    )
    .build();
}

function logoutForm() {
  return buildElement("form")
    .withClass("form__button")
    .withHtml(`<button class="form__button" type="submit">Log out</button>`)
    .withEventListener("submit", e => {
      e.preventDefault();
      fetch("/auth/logout").then((resp) => {
        if (resp.ok) {
          window.localStorage.setItem("authenticated", false);
          navigateTo("/login");
        } else {
          console.log("something went wrong...");
        }
      });
    })
    .build();
}

