import AbstractComponent from "./AbstractComponent.js";
import navigateTo from "../index.js";

export default class extends AbstractComponent {
  constructor(pageId, preview) {
    super(null);
    this.preview = preview;
    this.pageId = pageId;
  }
  
  async element() {
    let el = document.createElement("div");
    let preview = document.createElement("span");
    preview.classList.add("button");
    preview.classList.add("text__box");
    preview.innerText = this.preview;
    el.appendChild(preview);
    el.addEventListener("click", async () => {
      navigateTo(`/pages/${this.pageId}`)
    });
    return el;
  }
}

