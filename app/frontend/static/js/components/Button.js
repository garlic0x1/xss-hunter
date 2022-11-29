import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
  constructor(text, action) {
    super(null);
    this.text = text;
    this.action = action;
  }

  element() {
    let el = document.createElement("div");
    let codeBlock = document.createElement("span");
    codeBlock.classList.add("button");
    codeBlock.classList.add("text__box");
    codeBlock.innerText = this.text;
    el.appendChild(codeBlock);
    el.addEventListener("click", async () => {
      await this.action();
    });
    return el;
  }
}

