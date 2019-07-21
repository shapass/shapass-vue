import { Configs } from './config.js';
import API from './api.js';
import axios from 'axios';

// TODO: make each service a model, with methods to stringify and convert api<>localStorage
// TODO: make the list of services a model, with methods to stringify and convert api<>localStorage

const Store = {
  state: {
    service: null,
    outputLength: Configs.DEFAULT_LENGTH,
    suffix: null,
    prefix: null,
    master: null,
    generated: null,
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
      } else {
        this.state.outputLength = Configs.DEFAULT_LENGTH;
        this.state.suffix = null;
      }
      return this.state;
    } else {
      return null;
    }
  },

  // reloads the list of service names from localStorage to current state
  reloadStateServices () {
    var data = this.savedServices();
    this.state.services = this.savedServiceNames();
    this.state.servicesForSelect = Object.keys(data).map(function(key, index) {
      return { name: key, outputLength: data[key].outputLength, suffix: data[key].suffix, prefix: data[key].prefix };
    });
  },

  // reloads the services from the API, saves in localStorage and sets them in the current state
  reloadServices () {
    API.list((services) => {
      if (services !== null && services !== undefined) {
        var data = {};
        services.forEach((s) => {
          data[s.Name] = {
            service: s.Name,
            outputLength: s.Length,
            suffix: s.Suffix,
            prefix: s.Prefix
          };
        });
        localStorage.shapassData = JSON.stringify(data);
        console.log("updated localStorage to", localStorage.shapassData);
      } // TODO: else?
      this.reloadStateServices();
    });
  },

  // removes a service from the API then from localStorage
  removeService (callback) {
    var name = this.state.service;
    if (name !== null && name !== undefined) {
      this.remoteDelete(name, (r) => {
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
      this.remoteSave(this.state.service, this.state.outputLength, this.state.prefix, this.state.suffix, (r) => {
        console.log("remote save returned", r);
        if (r) {
          var data = this.savedServices();
          data[this.state.service] = {
            service: this.state.service,
            outputLength: this.state.outputLength,
            suffix: this.state.suffix,
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

  remoteSave (name, outputLength, prefix, suffix, callback) {
    console.log("on remote save");
    this.apiCreate(name, outputLength, prefix, suffix, (r) => {
      console.log("remote save returning", r);
      callback(r);
    });
  },
  apiCreate: function(name, length, prefix, suffix, callback) {
    var url =`${Configs.API_URL}/create?name=${name}`;
    if (length !== null && length !== undefined) {
      url = `${url}&length=${length}`;
    }
    if (prefix !== null && prefix !== undefined) {
      url = `${url}&prefix=${prefix}`;
    }
    if (suffix !== null && suffix !== undefined) {
      url = `${url}&suffix=${suffix}`;
    }
    axios
      .post(url)
      .then(response => {
        console.log('success:', response.data);
        if (response.data.Status === 'OK') {
          console.log("saved and returned OK");
          callback(true);
        } else {
          console.log("saved and returned ERROR");
          callback(false);
        }
      })
      .catch(error => {
        console.log("saved and returned exception", error);
        callback(false);
      });
  },

  remoteDelete (name, callback) {
    this.apiDelete(name, (r) => {
      callback(r);
    });
  },
  apiDelete: function(name, callback) {
    var url =`${Configs.API_URL}/delete?name=${name}`;
    axios
      .post(url)
      .then(response => {
        console.log('success:', response.data);
        if (response.data.Status === 'OK') {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        callback(false);
      });
  },
};

export default Store;
