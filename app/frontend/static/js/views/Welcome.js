import { buildElement } from "../builder.js";

export function welcome(_params) {
  document.title = "Welcome";
  return buildElement("div")
    .innerText("main page")
    .build();
}
