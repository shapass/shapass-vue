import { Configs } from './config.js';
import API from './api.js';
import Utils from './utils.js';

// TODO: make each service a model

const Store2 = {
  // the current data, the inputs filled by the user
  state: {
    service: null,
    outputLength: Configs.DEFAULT_LENGTH,
    suffix: null,
    prefix: null,
    master: null,
    generated: null,
    algorithm: Configs.DEFAULT_ALGORITHM,
    servicesForSelect: []
  },

  // the data stored in the localStorage
  stored: {
    encryptToken: null,
    services: []
  },

  getState () {
    return this.state;
  },

  // service changed in the interface, reload the current state with all info
  onServiceChanged (name) {
    if (name !== null && name !== undefined) {
      var services = this.stored.services;
      this.state.service = name;
      if (services[name] !== null && services[name] !== undefined) {
        // TODO: service model with attrs
        this.state.outputLength = services[name].outputLength;
        this.state.suffix = services[name].suffix;
        this.state.algorithm = services[name].algorithm;
      } else {
        this.state.outputLength = Configs.DEFAULT_LENGTH;
        this.state.suffix = null;
      }
    }
  },

  clearState () {
    this.state.outputLength = Configs.DEFAULT_LENGTH;
    this.state.suffix = null;
    this.state.prefix = null;
    this.state.master = null;
    this.state.service = null;
    this.state.generated = null;
    this.state.algorithm = Configs.DEFAULT_ALGORITHM;
  },

  clearStateAndStorage () {
    this.clearState();
    this._clearLocalStorage();
    this.reloadFromLocalStorage();
  },

  // reloads the data from the API, saves in localStorage and sets them in the current state
  fetchDataFromAPI (callback=null) {
    if (this.stored.encryptToken !== null &&
        this.stored.encryptToken !== undefined) {
      API.load(this.stored.encryptToken, (r, encrypted, decrypted) => {
        var invalid = decrypted === null || decrypted === undefined ||
            (typeof decrypted === 'string' && decrypted === '') ||
            (Array.isArray(decrypted) && decrypted.length === 0);
        if (r) {
          if (!invalid) {
            this.stored.services = decrypted;
            this._afterFetchData(callback, !invalid);
          } else {
            API.list((services) => {
              if (services !== null && services !== undefined) {
                this.stored.services = {};
                // TODO: service obj, parsing from old api
                services.forEach((i) => {
                  this.stored.services[i.Name] = {
                    name: i.Name,
                    outputLength: i.Length,
                    prefix: i.Prefix,
                    suffix: i.Suffix,
                    algorithm: i.Algorithm,
                  };
                });
              } else {
                this.stored.services = {};
              }
              this._afterFetchData(callback, true);
            });
          }
        } else {
          this.stored.services = {};
          this._afterFetchData(callback, !invalid);
        }
      });
    } else {
      callback(false);
    }
  },

  _afterFetchData (callback, success) {
    this._saveToLocalStorage();
    this._onServicesUpdated();
    callback(success);
  },

  // saves the current state in the API
  saveCurrentState (callback) {
    if (this.state.service !== null && this.state.service !== undefined) {

      // add the current state to the service list
      // TODO: service model
      this.stored.services[this.state.service] = {
        service: this.state.service,
        outputLength: this.state.outputLength,
        suffix: this.state.suffix,
        algorithm: this.state.algorithm,
        prefix: null
      };
      this._onServicesUpdated();

      // save locally, then remotely
      this._saveToLocalStorage();
      this._saveToAPI((r) => {
        callback(r, this.stored.services[this.state.service]);
      });

    } else {
      callback(false);
    }
  },

  // removes a service
  removeService (callback) {
    var name = this.state.service;
    var services = this.stored.services;
    if (name !== null && name !== undefined &&
        services[name] !== null && services[name] !== undefined) {

      // remove the service from the list
      delete services[name];
      this._onServicesUpdated();

      // save locally, then remotely
      this._saveToLocalStorage();
      this._saveToAPI((r) => {
        callback(r, name);
      });
    } else {
      callback(false, null);
    }
  },

  // generate the encryption token using the user's master password
  // and the login password (the one shapassed)
  generateEncryptToken (master, password) {
    var pw = Utils.shapass(`${master}${password}`, 'sha256-bin');
    this.stored.encryptToken = pw;
    this._saveToLocalStorage();
  },

  // reloads the data saved in localStorage (encrypt token and services)
  reloadFromLocalStorage () {
    this._loadLocalStorage();
  },

  // save the `services` on the API
  _saveToAPI (callback) {
    API.save(this.stored.encryptToken, this.stored.services, (r) => {
      callback(r);
    });
  },

  // remove everything stored in local storage
  _clearLocalStorage () {
    return localStorage.shapassData = null;
  },

  // reads the data saved in localStorage into `stored`
  _loadLocalStorage () {
    this.stored = JSON.parse(localStorage.shapassData || null) || {};
  },

  // save into local storage the info in this object
  _saveToLocalStorage () {
    localStorage.shapassData = JSON.stringify(this.stored);
  },

  // actions to be done when the local list of services is updated
  _onServicesUpdated () {
    var services = this.stored.services;
    if (services === null || services === undefined) {
      this.state.servicesForSelect = [];
    } else {
      this.state.servicesForSelect = Object.keys(services).sort().map(function(key) {
        // TODO: service model with attrs
        return { name: key, outputLength: services[key].outputLength,
                 suffix: services[key].suffix, prefix: services[key].prefix };
      });
    }
  },
};

export default Store2;
