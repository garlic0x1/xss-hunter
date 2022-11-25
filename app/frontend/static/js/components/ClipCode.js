import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
  constructor(params) {
    super(params);
  }
  
  async getElement(code) {
    let el = document.createElement("div");
    let codeBlock = document.createElement("code");
    codeBlock.innerText = code;
    el.appendChild(codeBlock);
    el.addEventListener("click", async () => {
      await navigator.clipboard.writeText("code");
    });
    return el;
  }
}

