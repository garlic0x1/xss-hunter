import AbstractView from "./AbstractView.js";
import CodeStack from "../containers/CodeStack.js";
import Button from "../components/Button.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.set_title("Settings");
  }
  
  update() {
    let script_list = document.getElementById("customScripts");
    let submit_script = document.getElementById("submitForm");
    
    fetch("/api/scripts").then( resp => {
      if (resp.ok) {
        resp.json().then ( data => {
          let code_stack = new CodeStack("custom scripts", true, true);
          
          Promise.all(data.map( async (uri) => {
            // let script_item = new Button(uri, () => {
            //   window.open(uri, '_blank');
            // });
            // code_stack.push(script_item.element());
            let script_item = document.createElement("span");
            script_item.classList.add("text__box");
            script_item.innerText = uri;
            code_stack.push(script_item);
          }));
          
          script_list.appendChild(code_stack.element());
        });
      } else {
        window.localStorage.setItem("authenticated", false);
        navigateTo("/login");
      }
    });
    
    submit_script.addEventListener("submit", e => {
      e.preventDefault();
      let uri = e.target[0].value;
      
      fetch("/api/scripts", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uri })
      }).then( resp => {
        navigateTo("/settings");
        // handle errors possibly
      });
    });
  }
  
  html() {
    return `
      <h1> Settings </h1>

      <div id="customScripts"></div><br>

      <div class="element__box">
        <form class="form" id="submitForm">
          <div class="form__message form__message--error"></div>
          <div class="form__input-group">
            <input type="text" class="form__input" autofocus placeholder="script uri">
            <div class="form__input-error-message"></div>
          </div>
          <button class="form__button" type="submit">Add script source</button>
        </form>
      </div>
    `;
  }
}
