import AbstractView from "./AbstractView.js";
import CodeStack from "../components/CodeStack.js";
import CollectedPage from "../components/CollectedPage.js";
import Button from "../components/Button.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Collected Pages");
  }
  
  async doScript() {
    let list_div = document.getElementById("pageList");
    
    fetch("/api/pages").then( (resp) => {
      resp.json().then( (data) => {
        let code_stack = new CodeStack("Pages");
        Promise.all(data.map( async (item) => {
          let collectedPage = new Button(`${item.time}  :  ${item.uri}`, () => {
            navigateTo(`/pages/${item.id}`);
          });
          let pageElement = collectedPage.element();
          code_stack.pushEl(pageElement);
        }));
        list_div.appendChild(code_stack.element());
      });
    });
  }
  
  async getHtml() {
    return `
      <h1> Collected Pages </h1>
      <p> Posts made to callback URL ('/callback/:username') </p> 
      <div id="pageList"></div>
    `;
  }
}
