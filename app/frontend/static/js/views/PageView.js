import AbstractView from "./AbstractView.js";
import DomStack from "../containers/DomStack.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.set_title("Collected Page");
  }
  
  update() {
    let el = document.getElementById("pageDetails");
    
    let headers = new DomStack("headers", true, true);
    let details = new DomStack("details", true, true);
    let image = new DomStack("screenshot", true, true);

    fetch(`/api/pages/${this.params.id}`).then( resp => {
      resp.json().then( data => {
        Object.entries(data).forEach( (tuple) => {
          let key = tuple[0];
          let val = tuple[1];
          
          if (key === "id") {
            fetch(`/api/images/${val}`).then( resp => {
              resp.text().then( text => {
                let img = document.createElement("img");
                img.setAttribute("src", text);
                image.push(img);
              });
            });
          } else if (key === "headers") {
            let parsed = JSON.parse(val);
            Object.entries(parsed).forEach( (tuple) => {
              let item = document.createElement("span");
              item.innerText = `${tuple[0]}  :  ${tuple[1]}`;
              headers.push(item);
            });
          } else {
            let item = document.createElement("span");
            item.innerText = `${key}  :  ${val}`;
            details.push(item);
          }
        });
        
        el.appendChild(image.element());
        el.appendChild(document.createElement("br"));
        el.appendChild(headers.element());
        el.appendChild(document.createElement("br"));
        el.appendChild(details.element());
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
