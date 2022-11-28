import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
  constructor(code) {
    super(null);
    this.code = code;
  }
  
  element() {
    let el = document.createElement("div");
    let codeBlock = document.createElement("code");
    codeBlock.classList.add("clip__code");
    codeBlock.innerText = this.code;
    el.appendChild(codeBlock);
    el.addEventListener("click", async () => {
      await navigator.clipboard.writeText(this.code);
    });
    return el;
  }
}

