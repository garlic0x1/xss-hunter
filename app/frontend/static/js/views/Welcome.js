import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Welcome");
  }
  
  async getHtml() {
    return `
       <h1> Blind XSS listener </h1>
       <p> [site info] </p>
    `;
  }
}
