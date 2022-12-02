import router from "../index.js";

export function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

export function gotoLogin() {
  window.localStorage.setItem("authenticated", false);
  navigateTo("/login");
}

