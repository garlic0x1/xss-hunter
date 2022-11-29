import AbstractView from "./AbstractView.js";
import CodeStack from "../containers/CodeStack.js";
import Button from "../components/Button.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Settings");
  }
  
  async doScript() {
    let script_list = document.getElementById("customScripts");
    let submit_script = document.getElementById("submitForm");
    
    fetch("/api/scripts").then( resp => {
      if (resp.ok) {
        resp.json().then ( data => {
          let code_stack = new CodeStack("custom scripts", true, true);
          
          Promise.all(data.map( async (uri) => {
            let script_item = new Button(uri, () => {
              window.open(uri, '_blank');
            });
            code_stack.push(script_item.element());
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
        // handle errors possibly
      });
    });
  }
  
  async getHtml() {
    return `
      <h1> Settings html </h1>
      <p> lorem ipsum </p> 
      <div id="customScripts"></div>

      <link rel="stylesheet" href="/static/css/login.css">
      <div class="container">
        <form class="form" id="submitForm">
          <h1 class="form__title">add script</h1>
          <div class="form__message form__message--error"></div>
          <div class="form__input-group">
            <input type="text" class="form__input" autofocus placeholder="script uri">
            <div class="form__input-error-message"></div>
          </div>
          <button class="form__button" type="submit">Continue</button>
        </form>
      </div>
    `;
  }
}
