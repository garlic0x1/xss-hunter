import { collectedPage } from "../components/CollectedPage.js";
import { buildElement } from "../builder.js";
import { buildDomVec } from "../containers/dom_vec.js"
import { gotoLogin } from "../auxiliary/navigation.js";

export function pages(_params) {
  document.title = "Collected Pages";
  return buildElement("div")
    .withHtml("<h1>Collected Pages</h1>")
    .withChild((() => {
      let vec = buildDomVec()
        .withTitle(buildElement("h3").withText("pages").build());

      fetch("/api/pages").then(resp => {
        if (!resp.ok) gotoLogin();
        resp.json().then(data => {
          data.forEach(item => {
            vec.push(collectedPage(item.id, `${item.time}  :  ${item.uri}`));
            vec.render();
          })
        });
      });

      return vec.getElement();
    })())
    .build();
}
