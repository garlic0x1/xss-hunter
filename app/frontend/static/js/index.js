import Welcome from "./views/Welcome.js";;
import Settings from "./views/Settings.js";
import Payloads from "./views/Payloads.js";
import Pages from "./views/Pages.js";
import PageView from "./views/PageView.js";
import Login from "./views/Login.js";
import Logout from "./views/Logout.js";

const pathToRegex = path => new RegExp(
  "^" + path.replace(/\//g, "\\/")
  .replace(/:\w+/g, "(.+)") + "$"
);

const getParams = match => {
  // get path arg
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path
    .matchAll(/:(\w+)/g)).map(result => result[1]);
  
  // console.log(Array.from(match.route.path
  //   .matchAll(/:(\w+)/g)));
  
  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
};

export default function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

async function router() {
  updateNavBar();
  
  // debug log authState
  let state = localStorage.getItem("authenticated");
  console.log({ state });
  
  // /posts/:id
  const routes = [
    { path: "/", view: Welcome },
    { path: "/payloads", view: Payloads },
    { path: "/pages", view: Pages },
    { path: "/pages/:id", view: PageView },
    { path: "/settings", view: Settings },
    { path: "/login", view: Login },
    { path: "/logout", view: Logout },
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
  
  const view = new match.route.view(getParams(match));
  
  document.querySelector("#app").innerHTML = await view.getHtml();
  
  // if the view needs actions after loading do them
  try {
    view.doScript();
  } catch {}
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
  console.log("updating navbar");
  let authenticated = window.localStorage.getItem("authenticated");
  
  let reqAuth = Array.from(document.getElementsByClassName("req__auth"));
  let noAuth = Array.from(document.getElementsByClassName("no__auth"));
  
  if (authenticated === "true") {
    reqAuth.forEach( (el) => {
      el.classList.remove("nav__link--hidden");
    });
    noAuth.forEach( (el) => {
      el.classList.add("nav__link--hidden");
    });
  } else {
    reqAuth.forEach( (el) => {
      el.classList.add("nav__link--hidden");
    });
    noAuth.forEach( (el) => {
      el.classList.remove("nav__link--hidden");
    });
  }
}
