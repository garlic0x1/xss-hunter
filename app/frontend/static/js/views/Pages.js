import AbstractView from "./AbstractView.js";
import CodeStack from "../containers/CodeStack.js";
import CollectedPage from "../components/CollectedPage.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Collected Pages");
  }
  
  async doScript() {
    let list_div = document.getElementById("pageList");
    
    fetch("/api/pages").then( (resp) => {
      if (resp.ok) {
        resp.json().then( (data) => {
          let code_stack = new CodeStack("Pages", true);
          Promise.all(data.map( async (item) => {
            let collectedPage = new CollectedPage(item.id, `${item.time}  :  ${item.uri}`);
            let pageElement = await collectedPage.element();
            code_stack.push(pageElement);
          }));
          list_div.appendChild(code_stack.element());
        });
      } else {
        window.localStorage.setItem("authenticated", false);
        navigateTo("/login");
      }
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
