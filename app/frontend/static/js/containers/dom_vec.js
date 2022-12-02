import { buildElement } from "../builder.js";

export function buildDomVec() {
  return new DomVec();
}

export default class DomVec {
  stack = [];
  title = document.createElement("span");
  divider = document.createElement("hr");
  element = document.createElement("div");

  constructor() {
    this.element.classList.add("code__stack");
    this.element.classList.add("element__box");
  }

  fromArray(elements) {
    this.stack = elements;
  }

  withDivider(element) {
    this.divider = element;
    return this;
  }

  withTitle(element) {
    this.title = element;
    return this;
  }

  withFoldingTitle(text) {
    this.title = buildElement("span")
      .withText(text)
      .withClasses(["button", "text__box"])
      .withEventListener("click", () => {
        this.toggleFolded();
      })
      .build();

    return this;
  }

  enqueue(el) {
    this.stack.unshift(el);
  }

  push(el) {
    this.stack.push(el);
  }

  pop() {
    return this.stack.pop();
  }

  render() {
    // clear the last view
    this.element.innerHTML = "";

    this.element.appendChild(this.title)
    this.stack.forEach(item => {
      this.element.appendChild(this.divider.cloneNode());
      this.element.appendChild(item);
    });
  }

  toggleFolded() {
    Array.from(this.element.childNodes.entries())
      .filter(([i, _val]) => (i > 0))
      .forEach(([_i, val]) => {
        if (val.style.display === "none")
          val.style.display = "block";
        else
          val.style.display = "none";
      });
  }

  getElement() {
    this.render()
    return this.element;
  }
}

