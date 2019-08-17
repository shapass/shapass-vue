import { Configs } from './config.js';
import API from './api.js';

// TODO: make each service a model, with methods to stringify and convert api<>localStorage
// TODO: make the list of services a model, with methods to stringify and convert api<>localStorage
// TODO: User inputs is one thing, configs loaded/generated are another
const Store = {
  state: {
    service: null,
    outputLength: Configs.DEFAULT_LENGTH,
    suffix: null,
    prefix: null,
    master: null,
    generated: null,
    algorithm: Configs.DEFAULT_ALGORITHM,
    services: [],
    servicesForSelect: []
  },
  savedServices () {
    return JSON.parse(localStorage.shapassData || null) || {};
  },
  savedServiceNames () {
    var data = this.savedServices();
    return Object.keys(data);
  },
  loadStateConfigs (name) {
    if (name !== null && name !== undefined) {
      var data = this.savedServices();
      this.state.service = name;
      if (data[name] !== null && data[name] !== undefined) {
        this.state.outputLength = data[name].outputLength;
        this.state.suffix = data[name].suffix;
        this.state.algorithm = data[name].algorithm;
      } else {
        this.state.outputLength = Configs.DEFAULT_LENGTH;
        this.state.suffix = null;
      }
      return this.state;
    } else {
      return null;
    }
  },
  clearEntries () {
    this.state.outputLength = Configs.DEFAULT_LENGTH;
    this.state.suffix = null;
    this.state.prefix = null;
    this.state.master = null;
    this.state.service = null;
    this.state.algorithm = Configs.DEFAULT_ALGORITHM;
  },

  // reloads the list of service names from localStorage to current state
  reloadStateServices () {
    var data = this.savedServices();
    this.state.services = this.savedServiceNames();
    this.state.servicesForSelect = Object.keys(data).map(function(key) {
      return { name: key, outputLength: data[key].outputLength, suffix: data[key].suffix, prefix: data[key].prefix };
    });
  },

  // reloads the services from the API, saves in localStorage and sets them in the current state
  reloadServices (callback=null) {
    API.list((services) => {
      if (services !== null && services !== undefined) {
        var data = {};
        services.forEach((s) => {
          data[s.Name] = {
            service: s.Name,
            outputLength: Configs.boundedOutputLength(s.Length),
            suffix: s.Suffix,
            prefix: s.Prefix,
            algorithm: s.Algorithm
          };
        });
        localStorage.shapassData = JSON.stringify(data);
        console.log("updated localStorage to", localStorage.shapassData);
      } // TODO: else?
      this.reloadStateServices();
      if (callback) { callback(); }
    });
  },

  // removes a service from the API then from localStorage
  removeService (callback) {
    var name = this.state.service;
    if (name !== null && name !== undefined) {
      API.delete(name, (r) => {
        if (r) {
          var data = this.savedServices();
          delete data[name];
          localStorage.shapassData = JSON.stringify(data);
          this.reloadStateServices();
          callback(true, name);
        } else {
          callback(false, null);
        }
      });
    } else {
      callback(false, null);
    }
  },

  // saves the current state in localStorage and in the API
  saveCurrentState (callback) {
    if (this.state.service !== null && this.state.service !== undefined) {
      API.create(this.state.service, this.state.outputLength, this.state.prefix, this.state.suffix, this.state.algorithm, (r) => {
        console.log("remote save returned", r);
        if (r) {
          var data = this.savedServices();
          data[this.state.service] = {
            service: this.state.service,
            outputLength: this.state.outputLength,
            suffix: this.state.suffix,
            algorithm: this.state.algorithm,
            prefix: null
          };
          localStorage.shapassData = JSON.stringify(data);
          this.reloadStateServices();
          console.log("saved locally and returning ok");
          callback(true, data[this.state.service]);
        } else {
          console.log("returning error locally");
          callback(false, null);
        }
      });
    } else {
      callback(false, null);
    }
  },
};

export default Store;
