import AbstractComponent from "./AbstractComponent.js";
import navigateTo from "../index.js";

export default class extends AbstractComponent {
  constructor(preview, pageId) {
    super(null);
    this.preview = preview;
    this.pageId = pageId;
  }
  
  async getElement() {
    let el = document.createElement("div");
    let preview = document.createElement("span");
    preview.innerText = this.preview;
    el.appendChild(preview);
    el.addEventListener("click", async () => {
      navigateTo(`/pages/${this.pageId}`)
    });
    return el;
  }
}

