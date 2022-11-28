import AbstractComponent from "./AbstractComponent.js";

// list view
export default class extends AbstractComponent {
  #element;

  constructor(name) {
    super(null);
    let el = document.createElement("div");
    el.classList.add("code__stack");
    let title = document.createElement("span");
    title.innerText = name;
    el.appendChild(title);
    this.#element = el;
  }
  
  push(text) {
    const div = document.createElement("div");
    const el = document.createElement("span");
    el.innerText = text;
    div.appendChild(el);
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

