import { buildElement } from "./builder.js";
import { navigateTo }  from "./navigation.js";

export function chainloadScript(script_id, uri) {
  return buildElement("div")
    .withChild(
      buildElement("span")
        .withClasses(["button", "text__box"])
        .withText(uri)
        .withStyle("display", "inline-block")
        .build()
    )
    .withChild(
      deleteButton("delete", () => {
        fetch(`api/scripts/${script_id}`, {
          method: "DELETE",
        }).then(() => {
          navigateTo("/settings");
        });
      })
    )
    .build();
}

export function collectedPage(page_id, preview) {
  return buildElement("div")
    .withChild(
      buildElement("span")
        .withClasses(["button", "text__box"])
        .withText(preview)
        .withStyle("display", "inline-block")
        .withEventListener("click", async () => {
          navigateTo(`/pages/${page_id}`)
        })
        .build()
    )
    .withChild(
      deleteButton("delete", () => {
        fetch(`api/pages/${page_id}`, {
          method: "DELETE",
        }).then(() => {
          navigateTo("/pages");
        });
      }))
    .build();
}

export function button(text, action) {
  return buildElement("div")
    .withClasses(["button", "text__box"])
    .withText(text)
    .withEventListener("click", action)
    .build();
}

export function deleteButton(text, fn) {
  return buildElement("span")
    .withClasses(["delete__button", "text__box"])
    .withText(text)
    .withEventListener("click", fn)
    .build();
}

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
