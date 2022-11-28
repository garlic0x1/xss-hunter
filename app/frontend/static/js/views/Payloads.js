import AbstractView from "./AbstractView.js";
import CodeStack from "../components/CodeStack.js";
import ClipCode from "../components/ClipCode.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Example Payloads");
  }
  
  async doScript() {
    let list_div = document.getElementById("payloadList");
    
    const buildCategory = (item) => {
      let code_stack = new CodeStack(item["context"]);
      Promise.all(item["payloads"].map( async (payload) => {
        let clipCode = new ClipCode(payload);
        let el = clipCode.element();
        code_stack.pushEl(el)
      }));
      return code_stack.element();
    };
    
    fetch("/api/payloads").then( (resp) => {
      resp.json().then( (data) => {
        let code_stack = new CodeStack("main");
        data.forEach( (item) => {
          code_stack.pushEl(buildCategory(item));
        });
        list_div.appendChild(code_stack.element());
      });
    });
  }
  
  async getHtml() {
    return `
       <h1> Example Payloads </h1>
        <div id="payloadList"></div>
    `;
  }
}
