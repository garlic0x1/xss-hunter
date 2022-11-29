export default class {
  constructor(params) {
    this.params = params;
  }
  
  set_title(title) {
    document.title = title;
  }
  
  update() {}
  
  html() {
    return '';
  }
}
