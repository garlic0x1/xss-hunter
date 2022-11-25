import AbstractView from "./AbstractView.js";
import ClipCode from "../components/ClipCode.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Example Payloads");
  }
  
  async doScript() {
    let list = document.getElementById("payloadList");
    
    const buildCategory = (item) => {
      let categoryDiv = document.createElement("div");
      let title = document.createElement("h3");
      title.innerText = item["context"];
      let payloadList = document.createElement("ul");
      item["payloads"].forEach( async (payload) => {
          console.log({ payload });
          let li = document.createElement("li");
          let clipCode = new ClipCode;
          let clipEl = await clipCode.getElement(payload);
          console.log({ clipEl });
          li.appendChild(clipEl);
          payloadList.appendChild(li);
      });
      
      categoryDiv.appendChild(title);
      categoryDiv.appendChild(payloadList);
      
      console.log({ categoryDiv });
      return categoryDiv;
    };
    
    fetch("/api/payloads").then( (resp) => {
      resp.json().then( (data) => {
        data.forEach( (item) => {
          let ctx = document.createElement("li");
          ctx.appendChild(buildCategory(item));
          list.appendChild(ctx);
        });
      });
    });
  }
  
  async getHtml() {
    return `
       <h1> Example Payloads </h1>
       <p> Example payloads for loading the probe </p> 
       <p> Click to copy to clipboard </p> 
       <p>
        <ul id="payloadList"></ul>
        <a href="/" data-link> View dashboard </a>
      </p> 
    `;
  }
}
