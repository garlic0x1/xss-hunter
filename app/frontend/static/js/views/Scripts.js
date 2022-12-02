import { buildDomVec } from "../containers/dom_vec.js";
import { chainloadScript } from "../components/CollectedPage.js";
import { navigateTo, gotoLogin } from "../auxiliary/navigation.js";
import { buildElement } from "../builder.js";

export function scripts(_params) {
  document.title = "Chainload Scripts";
  return buildElement("div")
    .withHtml("<h1> Chainload Scripts </h1>")
    .withChild(list())
    .withChild(buildElement("br").build())
    .withChild(appendForm())
    .build();
}

function list() {
  let vec = buildDomVec().withFoldingTitle("scripts");

  fetch("/api/scripts").then(resp => {
    if (!resp.ok) gotoLogin();
    resp.json().then(data => {
      data.forEach(item => {
        vec.push(chainloadScript(item.id, item.uri));
        vec.render();
      });
    });
  });

  return vec.getElement();
}

function appendForm() {
  return buildElement("div")
    .withClass("element__box")
    .withChild(
      buildElement("form")
        .withClass("form")
        .withHtml(`
          <div class="form__message form__message--error"></div>
          <div class="form__input-group">
            <input type="text" class="form__input" autofocus placeholder="script uri">
            <div class="form__input-error-message"></div>
          </div>
        `)
        .withChild(
          buildElement("button")
            .withClass("form__button")
            .withAttribute("type", "submit")
            .withText("Add script URI")
            .build()
        )
        .withEventListener("submit", e => {
          e.preventDefault();
          let uri = e.target[0].value;
          fetch("/api/scripts", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uri })
          }).then(resp => {
            if (resp.ok)
              navigateTo("/settings");
            else
              gotoLogin();
          });
        })
        .build()
    )
    .build();
}
