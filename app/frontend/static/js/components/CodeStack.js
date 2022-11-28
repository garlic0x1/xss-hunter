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
  
  pushEl(el) {
    const div = document.createElement("div");
    div.appendChild(el);
    this.#element.appendChild(this.#divider());
    this.#element.appendChild(div);
  }
  
  push(name, text) {
    const div = document.createElement("div");
    const title = document.createElement("span");
    const message = document.createElement("span");
    title.innerText = `${name}:  `;
    message.innerText = text;
    div.appendChild(title);
    div.appendChild(message);
    this.#element.appendChild(this.#divider());
    this.#element.appendChild(div);
  }
  
  pop() {
    let top = null;
    if (this.element.childElementCount > 1) {
      top = this.#element.lastChild;
      this.#element.remove(this.#element.lastChild);
      this.#element.remove(this.#element.lastChild);
    }
    return top;
  }

  element() {
    return this.#element;
  }
  
  #divider() {
    return document.createElement("hr");
  }
}

