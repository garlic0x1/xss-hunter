import { clipCode } from "../components/ClipCode.js";
import { gotoLogin } from "../auxiliary/navigation.js";
import { buildElement } from "../builder.js";
import { buildDomVec } from "../containers/dom_vec.js";

export function payloads(_params) {
  document.title = "Example Payloads";
  return buildElement("div")
    .withChild(buildElement("h1").withText("Example Payloads").build())
    .withChild(payloadList())
    .build();
};

function payloadList() {
  let vec = buildDomVec()
    .withTitle(buildElement("h3").withText("payloads").build())
    .withDivider(buildElement("br").build());

  fetch("/api/payloads").then(resp => {
    if (!resp.ok) gotoLogin();
    resp.json().then(data => {
      data.forEach((item) => {
        vec.push(buildCategory(item));
        vec.render();
      });
    });
  });

  return vec.getElement();
}

function buildCategory(item) {
  let vec = buildDomVec().withFoldingTitle(item["context"]);
  item["payloads"].forEach(payload => {
    vec.push(clipCode(payload));
  });
  return vec.getElement();
}

