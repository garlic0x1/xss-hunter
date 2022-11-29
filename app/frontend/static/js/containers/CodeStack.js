import AbstractContainer from "./AbstractContainer.js";

// list view
export default class extends AbstractContainer {
  name;
  divided;
  #element;

  constructor(name, divided, foldable) {
    super();
    this.#element = document.createElement("div");
    this.divided = divided;
    this.name = name;
    this.foldable = foldable;

    this.#element.classList.add("code__stack");
    this.#element.classList.add("element__box");
    this.#element.appendChild(this.#title());
  }
  
  push(el) {
    const div = document.createElement("div");
    div.appendChild(el);
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
  
  #title() {
    let title = document.createElement("h3");
    title.innerText = this.name;

    if (this.foldable) {
      title.classList.add("button", "text__box");
      title.addEventListener("click", () => {
        Array.from(this.#element.childNodes.entries())
          .filter( ([i, val]) =>i > 0 )
          .forEach( ([i, val]) => {
            if (val.style.display === "none")
              val.style.display = "block";
            else
              val.style.display = "none";
        });
      });
    }
    
    return title;
  }
  
  #divider() {
    if (this.divided) {
      return document.createElement("hr");
    } else {
      return document.createElement("br");
    }
  }
}

