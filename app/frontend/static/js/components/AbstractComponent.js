export default class {
  #element;
  
  constructor(params) {
    this.params = params;
  }
  
  async element() {
    return this.#element;
  }
}
