import AbstractComponent from "./AbstractComponent.js";
import navigateTo from "../index.js";
import DeleteButton from "./DeleteButton.js";

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
    preview.style.display = "inline-block";
    el.appendChild(preview);
    el.addEventListener("click", async () => {
      navigateTo(`/pages/${this.pageId}`)
    });

    let del_button = new DeleteButton("delete", e => {
      fetch(`api/pages/${this.pageId}`, {
        method: "DELETE",
      }).then( () => {
        navigateTo("/pages");
      });
    });

    el.appendChild(del_button.element());
    return el;
  }
}

