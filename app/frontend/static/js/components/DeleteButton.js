
import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
  constructor(text, action) {
    super(null);
    this.text = text;
    this.action = action;
  }

  element() {
    let el = document.createElement("span");
    el.classList.add("delete__button");
    el.classList.add("text__box");
    el.innerText = this.text;
    el.addEventListener("click", async () => {
      await this.action();
    });
    return el;
  }
}

