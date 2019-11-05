import { Configs } from './config.js';
import API from './api.js';
import Utils from './utils.js';

const Store = {
  // the current data, the inputs filled by the user
  state: {
    service: null,
    outputLength: Configs.DEFAULT_LENGTH,
    suffix: null,
    prefix: null,
    master: null,
    generated: null,
    algorithm: Configs.DEFAULT_ALGORITHM,
    servicesForSelect: [],
    saving: false,
  },

  // the data stored in the localStorage
  stored: {
    encryptToken: null,
    services: [],
  },

  getState () {
    return this.state;
  },

  // service changed in the interface, reload the current state with all info
  onServiceChanged (name) {
    if (name !== null && name !== undefined) {
      var services = this.stored.services;
      this.state.service = name;
      Service.setStateFromService(this.state, name, services[name]);
    }
  },

  clearState () {
    Service.clearState(this.state);
    this.state.master = null;
    this.state.generated = null;
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
                services.forEach((i) => {
                  this.stored.services[i.Name] = Service.fromListAPI(i);
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

  // saves the current state in the API
  saveCurrentState (callback) {
    if (this.state.service !== null && this.state.service !== undefined) {

      // add the current state to the service list
      this.stored.services[this.state.service] = Service.fromState(this.state);
      this._onServicesUpdated();

      // save locally, then remotely
      this._saveToLocalStorage();
      callback(true, this.stored.services[this.state.service]);

      // assynchronously
      this._saveToAPI();
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
      callback(true, name);

      // assynchronously
      this._saveToAPI();
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

  // checks if the user has an encryptToken stored in localStorage
  // won't load the data, just check it
  hasEncryptToken (master, password) {
    var l = JSON.parse(localStorage.shapassData || null) || {};
    return (l.encryptToken !== undefined && l.encryptToken !== null);
  },

  // reloads the data saved in localStorage (encrypt token and services)
  reloadFromLocalStorage () {
    this._loadLocalStorage();
  },

  isCurrentServiceSaved () {
    if (this.state.service !== null && this.state.service !== undefined) {
      var saved = this.stored.services[this.state.service];
      return (saved !== undefined && saved !== null);
    } else {
      return false;
    }
  },


  // INTERNAL

  // save the `services` on the API
  _saveToAPI (callback=null) {
    this.state.saving = true;
    API.save(this.stored.encryptToken, this.stored.services, (r) => {
      this.state.saving = false;
      if (callback !== null) { callback(r); }
    });
  },

  // remove everything stored in local storage
  _clearLocalStorage () {
    return localStorage.shapassData = null;
  },

  // reads the data saved in localStorage into `stored`
  _loadLocalStorage () {
    var l = JSON.parse(localStorage.shapassData || null) || {};
    this.stored.encryptToken = l.encryptToken !== undefined ? l.encryptToken : '';
    this.stored.services = l.services !== undefined ? l.services : [];
    this._onServicesUpdated();
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
        return Service.attributes(services[key]);
      });
      console.log('-- setting services from', services);
      console.log('-- set services to', this.state.servicesForSelect);
    }
  },

  _afterFetchData (callback, success) {
    this._saveToLocalStorage();
    this._onServicesUpdated();
    callback(success);
  },
};

const Service = {
  setStateFromService (state, name, service) {
    if (service !== null && service !== undefined) {
      state.outputLength = service.outputLength;
      state.suffix = service.suffix;
      state.prefix = service.prefix;
      state.metadata = service.metadata;
      state.algorithm = service.algorithm;
    } else {
      this.clearState(state);
    }
    state.service = name;
  },

  clearState (state) {
    state.service = null;
    state.outputLength = Configs.DEFAULT_LENGTH;
    state.suffix = null;
    state.prefix = null;
    state.metadata = null;
    state.algorithm = Configs.DEFAULT_ALGORITHM;
  },

  fromListAPI (response) {
    return {
      name: response.Name,
      outputLength: response.Length,
      prefix: response.Prefix,
      suffix: response.Suffix,
      algorithm: response.Algorithm,
      metadata: response.Metadata,
    };
  },

  fromState (state) {
    return {
      name: state.service,
      outputLength: state.outputLength,
      suffix: state.suffix,
      algorithm: state.algorithm,
      prefix: state.prefix,
      metadata: state.metadata,
    };
  },

  attributes (service) {
    return {
      name: service.name || service.service, // some old configs still use .service
      outputLength: service.outputLength,
      suffix: service.suffix,
      prefix: service.prefix,
      metadata: service.metadata,
      algorithm: service.algorithm,
    };
  },
};

export default Store;
