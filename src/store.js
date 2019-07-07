import { Configs } from './config.js';

const Store = {
  state: {
    service: null,
    master: null,
    generated: null,
    length: Configs.DEFAULT_LENGTH,
    suffix: null,
    services: []
  },
  savedServices () {
    return JSON.parse(localStorage.shapassData || null) || {};
  },
  savedServiceNames () {
    var data = this.savedServices();
    return Object.keys(data);
  },
  updateStateServices () {
    this.state.services = this.savedServiceNames();
  },
  saveState () {
    if (this.state.service !== null) {
      var data = this.savedServices();
      data[this.state.service] = {
        length: this.state.length,
        suffix: this.state.suffix
      };
      localStorage.shapassData = JSON.stringify(data);
      this.updateStateServices();
    }
  },
  removeService () {
    if (this.state.service !== null) {
      var data = this.savedServices();
      delete data[this.state.service];
      localStorage.shapassData = JSON.stringify(data);
      this.updateStateServices();
    }
  }
};

export default Store;
