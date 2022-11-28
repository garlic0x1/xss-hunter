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
      item["payloads"].forEach( async (payload) => {
        console.log({ payload });
        let clipCode = new ClipCode(payload);
        console.log({ clipCode });
        let el = await clipCode.getElement();
        code_stack.pushEl(el)
      });
      return code_stack.element();
    };
    
    fetch("/api/payloads").then( (resp) => {
      resp.json().then( (data) => {
        let code_stack = new CodeStack("main");
        data.forEach( (item) => {
          // let ctx = document.createElement("li");
          // ctx.appendChild(buildCategory(item));
          code_stack.pushEl(buildCategory(item));
          list_div.appendChild(code_stack.element());
          // list.appendChild(ctx);
        });
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
