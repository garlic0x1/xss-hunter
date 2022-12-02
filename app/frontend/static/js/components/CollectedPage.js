import { navigateTo }  from "../auxiliary/navigation.js";
import { deleteButton } from "./DeleteButton.js";
import { buildElement } from "../builder.js";

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
