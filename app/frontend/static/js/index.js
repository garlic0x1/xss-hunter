import { welcome } from "./views/Welcome.js";
import { scripts } from "./views/Scripts.js";
import { payloads } from "./views/Payloads.js";
import { pages } from "./views/Pages.js";
import { pageDetails } from "./views/PageView.js";
import { login } from "./views/Login.js";
import { logout } from "./views/Logout.js";
import { navigateTo } from "./navigation.js";

const pathToRegex = path => new RegExp(
  "^" + path.replace(/\//g, "\\/")
    .replace(/:\w+/g, "(.+)") + "$"
);

const getParams = match => {
  // get path arg
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path
    .matchAll(/:(\w+)/g)).map(result => result[1]);
  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
};

export default async function router() {
  updateNavBar();

  // /posts/:id
  const routes = [
    { path: "/", view: welcome },
    { path: "/payloads", view: payloads },
    { path: "/pages", view: pages },
    { path: "/pages/:id", view: pageDetails },
    { path: "/settings", view: scripts },
    { path: "/login", view: login },
    { path: "/logout", view: logout },
  ];

  // test each route to match
  const potentialMatches = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      results: [location.pathname],
    };
  }

  let view = match.route.view;
  let app = document.querySelector("#app");
  app.innerHTML = "";
  app.appendChild(view(getParams(match)));
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});

function updateNavBar() {
  let authenticated = window.localStorage.getItem("authenticated");

  let reqAuth = Array.from(document.getElementsByClassName("req__auth"));
  let noAuth = Array.from(document.getElementsByClassName("no__auth"));

  if (authenticated === "true") {
    reqAuth.forEach((el) => {
      el.classList.remove("hidden");
    });
    noAuth.forEach((el) => {
      el.classList.add("hidden");
    });
  } else {
    reqAuth.forEach((el) => {
      el.classList.add("hidden");
    });
    noAuth.forEach((el) => {
      el.classList.remove("hidden");
    });
  }
}
