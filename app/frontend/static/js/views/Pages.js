import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Collected Pages");
  }
  
  async doScript() {
    let list = document.getElementById("pageList");
    
    fetch("/api/requests").then( (resp) => {
      resp.json().then( (data) => {
        data.forEach( (item) => {
          let li = document.createElement("li");
          li.innerText = JSON.stringify(item);
          list.appendChild(li);
        });
      });
    });
  }
  
  async getHtml() {
    return `
      <h1> Collected Pages </h1>
      <p> lorem ipsum stuff </p> 
      <p>
        <ul id="pageList"></ul>
        <a href="/" data-link> View dashboard </a>
      </p> 
    `;
  }
}
