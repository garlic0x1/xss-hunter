import AbstractView from "./AbstractView.js";
import DomStack from "../containers/DomStack.js";
import DeleteButton from "../components/DeleteButton.js";
import navigateTo from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.set_title("Chainload Scripts");
  }
  
  update() {
    let script_list = document.getElementById("customScripts");
    let submit_script = document.getElementById("submitForm");
    
    fetch("/api/scripts").then( resp => {
      if (resp.ok) {
        resp.json().then ( data => {
          let code_stack = new DomStack("custom scripts", true, true);
          
          Promise.all(data.map( async (item) => {
            let script = document.createElement("div");
            let text = document.createElement("span");
            text.style.display = "inline-block";
            let delete_button = new DeleteButton("delete", () => {
              fetch(`/api/scripts/${item.id}`, {
                method: "DELETE",
              }).then( resp => {
                navigateTo("/settings");
              });
            });
            text.classList.add("text__box");
            text.innerText = item.uri;
            script.appendChild(text);
            script.appendChild(delete_button.element());
            code_stack.push(script);
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
      <h1> Chainload Scripts </h1>

      <div id="customScripts"></div><br>

      <div class="element__box">
        <form class="form" id="submitForm">
          <div class="form__message form__message--error"></div>
          <div class="form__input-group">
            <input type="text" class="form__input" autofocus placeholder="script uri">
            <div class="form__input-error-message"></div>
          </div>
          <button class="form__button" type="submit">Add script URI</button>
        </form>
      </div>
    `;
  }
}
