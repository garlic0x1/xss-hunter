import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Example Payloads");
  }
  
  async doScript() {
    let list = document.getElementById("payloadList");
    
    fetch("/api/payloads").then( (resp) => {
      resp.json().then( (data) => {
        data.forEach( (item) => {
          let ctx = document.createElement("li");
          ctx.innerText = JSON.stringify(item);
          list.appendChild(ctx);
        });
      });
    });
  }
  
  async getHtml() {
    return `
       <h1> Example Payloads </h1>
       <p> Example payloads for loading the probe </p> 
       <p>
        <ul id="payloadList"></ul>
        <a href="/" data-link> View dashboard </a>
      </p> 
    `;
  }
}
