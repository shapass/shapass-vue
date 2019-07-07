import { Configs } from './config.js';

const Store = {
  state: {
    service: null,
    outputLength: Configs.DEFAULT_LENGTH,
    suffix: null,
    master: null,
    generated: null,
    services: []
  },
  savedServices () {
    return JSON.parse(localStorage.shapassData || null) || {};
  },
  savedServiceNames () {
    var data = this.savedServices();
    return Object.keys(data);
  },
  savedServicesAsArray () {
    var data = this.savedServices();
    return Object.keys(data).map(function(key, index) {
      return { name: key, outputLength: data[key].outputLength, suffix: data[key].suffix };
    });
  },
  reloadServices () {
    this.state.services = this.savedServiceNames();
  },
  removeService () {
    if (this.state.service !== null && this.state.service !== undefined) {
      var data = this.savedServices();
      delete data[this.state.service];
      localStorage.shapassData = JSON.stringify(data);
      this.reloadServices();
      return this.state;
    } else {
      return null;
    }
  },
  saveStateConfigs () {
    if (this.state.service !== null && this.state.service !== undefined) {
      var data = this.savedServices();
      data[this.state.service] = {
        service: this.state.service,
        outputLength: this.state.outputLength,
        suffix: this.state.suffix
      };
      localStorage.shapassData = JSON.stringify(data);
      this.reloadServices();
      return this.state;
    } else {
      return null;
    }
  },
  loadStateConfigs (service) {
    if (service !== null && service !== undefined) {
      var data = this.savedServices();
      this.state.service = service;
      if (data[service] !== null && data[service] !== undefined) {
        this.state.outputLength = data[service].outputLength;
        this.state.suffix = data[service].suffix;
      } else {
        this.state.outputLength = Configs.DEFAULT_LENGTH;
        this.state.suffix = null;
      }
      return this.state;
    } else {
      return null;
    }
  }
};

export default Store;
