import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    console.log({ params });
    this.setTitle("Collected Pages");
  }
  
  async doScript() {
    let details = document.getElementById("pageDetails");
    
    fetch(`/api/pages/${this.params.id}`).then( (resp) => {
      resp.json().then( (data) => {
        details.innerText = JSON.stringify(data);
      });
    });
  }
  
  async getHtml() {
    return `
      <h1> Collected Pages </h1>
      <p> Page details </p> 
      <p>
        <div id="pageDetails"></div>
      </p> 
    `;
  }
}
