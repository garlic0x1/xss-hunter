import { buildElement } from "../builder.js";

export function deleteButton(text, fn) {
  return buildElement("span")
    .withClasses(["delete__button", "text__box"])
    .withText(text)
    .withEventListener("click", fn)
    .build();
}
