import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Settings");
  }
  
  async getHtml() {
    return `
       <h1> Settings html </h1>
       <p> lorem ipsum </p> 
       <p>
        manage settings
      </p> 
    `;
  }
}
