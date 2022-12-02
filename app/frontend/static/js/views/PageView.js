import { buildElement } from "../builder.js";
import { buildDomVec } from "../containers/dom_vec.js";

export function pageDetails(params) {
  document.title = "Collected Page";
  return buildElement("div")
    .withHtml("<h1> Collected Page </h1>")
    .withChildren(detailVecs(params))
    .build();
}

function detailVecs(params) {
  let headers = buildDomVec().withFoldingTitle("headers");
  let details = buildDomVec().withFoldingTitle("details");
  let image = buildDomVec().withFoldingTitle("screenshot");

  fetch(`/api/pages/${params.id}`).then(resp => {
    resp.json().then(data => {
      Object.entries(data).forEach(([key, val]) => {
        if (key === "id") {
          fetch(`/api/images/${val}`).then(resp => {
            resp.text().then(text => {
              let img = document.createElement("img");
              img.setAttribute("src", text);
              image.push(img);
              image.render();
            });
          });
        } else if (key === "headers") {
          Object.entries(JSON.parse(val)).forEach(([key, val]) => {
            headers.push(
              buildElement("span")
              .withText(`${key}  :  ${val}`)
              .build());
            headers.render();
          });
        } else {
          details.push(
            buildElement("span")
            .withText(`${key}  :  ${val}`)
            .build());
          details.render();
        }
      });
    });
  });

  return [image, headers, details]
    .flatMap(vec => [vec.getElement(), buildElement("br").build()]);
}
