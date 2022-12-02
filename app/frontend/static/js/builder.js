export function buildElement(tag) {
  return new Builder(tag);
}

export default class Builder {
  element;

  constructor(html_tag) {
    this.element = document.createElement(html_tag);
  }

  withClass(css_class) {
    this.element.classList.add(css_class);
    return this;
  }

  withClasses(css_classes) {
    css_classes.forEach(css_class => {
      this.element.classList.add(css_class);
    });
    return this;
  }

  withAttribute(key, value) {
    this.element.setAttribute(key, value);
    return this;
  }

  withChild(element) {
    this.element.appendChild(element);
    return this;
  }

  withStyle(key, value) {
    this.element.style[key] = value;
    return this;
  }

  withChildren(elements) {
    elements.forEach(element => {
      this.element.appendChild(element);
    });
    return this;
  }

  withText(text) {
    this.element.innerText = text;
    return this;
  }

  withHtml(html) {
    this.element.innerHTML = html;
    return this;
  }

  withEventListener(event, fn) {
    this.element.addEventListener(event, fn);
    return this;
  }

  build() {
    return this.element;
  }
}
