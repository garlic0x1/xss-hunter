import AbstractView from "./AbstractView.js";
import DomStack from "../containers/DomStack.js";
import ClipCode from "../components/ClipCode.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.set_title("Example Payloads");
  }
  
  update() {
    let list_div = document.getElementById("payloadList");
    
    const buildCategory = (item) => {
      let code_stack = new DomStack(item["context"], true, true);
      Promise.all(item["payloads"].map( async (payload) => {
        let clipCode = new ClipCode(payload);
        let el = clipCode.element();
        code_stack.push(el)
      }));
      return code_stack.element();
    };
    
    fetch("/api/payloads").then( (resp) => {
      if (resp.ok) {
        resp.json().then( (data) => {
          let code_stack = new DomStack("context");
          data.forEach( (item) => {
            code_stack.push(buildCategory(item));
          });
          list_div.appendChild(code_stack.element());
        });
      } else {
        window.localStorage.setItem("authenticated", false);
        navigateTo("/login");
      }
    });
  }
  
  html() {
    return `
       <h1> Example Payloads </h1>
        <div id="payloadList"></div>
    `;
  }
}
