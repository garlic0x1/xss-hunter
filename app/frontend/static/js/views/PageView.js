import AbstractView from "./AbstractView.js";
import CodeStack from "../components/CodeStack.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    console.log({ params });
    this.setTitle("Collected Pages");
  }
  
  async doScript() {
    let details = document.getElementById("pageDetails");
    
    let code_stack = new CodeStack("details");
    let resp = await fetch(`/api/pages/${this.params.id}`);
    let data = await resp.json();

    Object.entries(data).forEach( (tuple) => {
      let key = tuple[0];
      let val = tuple[1];
      code_stack.push(key, val);
    });
    
    console.log({ code_stack });
    
    details.appendChild(code_stack.element());
  }
  
  async getHtml() {

    return `
      <h1> Collected Page </h1>
      <div id="pageDetails"></div>
    `;
  }
}
