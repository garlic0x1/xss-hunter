import { buildElement } from "../builder.js";
import AbstractComponent from "./AbstractComponent.js";

export function clipCode(code) {
  return buildElement("div")
    .withChild(
      buildElement("code")
        .withClass("clip__code")
        .withText(code)
        .build()
    )
    .withEventListener("click", () => navigator.clipboard.writeText(code))
    .build();
}
