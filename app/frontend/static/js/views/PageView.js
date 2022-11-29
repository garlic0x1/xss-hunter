import AbstractView from "./AbstractView.js";
import CodeStack from "../containers/CodeStack.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    console.log({ params });
    this.set_title("Collected Pages");
  }
  
  update() {
    let details = document.getElementById("pageDetails");
    let code_stack = new CodeStack("details", true);

    fetch(`/api/pages/${this.params.id}`).then( resp => {
      resp.json().then( data => {
        Object.entries(data).forEach( (tuple) => {
          let key = tuple[0];
          let val = tuple[1];
          
          let item = document.createElement("span");
          item.innerText = `${key}  :  ${val}`;
          code_stack.push(item);
        });
        
        details.appendChild(code_stack.element());
      });
    });
  }
  
  html() {
    return `
      <h1> Collected Page </h1>
      <div id="pageDetails"></div>
    `;
  }
}
