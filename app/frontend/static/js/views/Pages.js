import AbstractView from "./AbstractView.js";
import CollectedPage from "../components/CollectedPage.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Collected Pages");
  }
  
  async doScript() {
    let list = document.getElementById("pageList");
    
    fetch("/api/pages").then( (resp) => {
      resp.json().then( (data) => {
        data.forEach( async (item) => {
          let li = document.createElement("li");
          let collectedPage = new CollectedPage(item.id, item.origin);
          let pageElement = await collectedPage.getElement();
          li.appendChild(pageElement);
          list.appendChild(li);
        });
      });
    });
  }
  
  async getHtml() {
    return `
      <h1> Collected Pages </h1>
      <p> Posts made to callback URL ('/callback/:username') </p> 
      <p>
        <ul id="pageList"></ul>
        <a href="/" data-link> View dashboard </a>
      </p> 
    `;
  }
}
