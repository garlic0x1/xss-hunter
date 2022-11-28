import AbstractComponent from "./AbstractComponent.js";

// list view
export default class extends AbstractComponent {
  #element;

  constructor(name) {
    super(null);
    let el = document.createElement("div");
    el.classList.add("code__stack");
    let title = document.createElement("h3");
    title.innerText = name;
    el.appendChild(title);
    this.#element = el;
  }
  
  push(name, text) {
    const div = document.createElement("div");
    const title = document.createElement("span");
    const message = document.createElement("span");
    title.innerText = `${name}:  `;
    message.innerText = text;
    div.appendChild(title);
    div.appendChild(message);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    this.#element.appendChild(div);
  }
  
  pop() {
    let top = null;
    if (this.element.childElementCount > 1) {
      top = this.#element.lastChild;
      this.#element.remove(top);
    }
    return top;
  }

  element() {
    return this.#element;
  }
}

