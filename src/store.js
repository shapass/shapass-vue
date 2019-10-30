import { Configs } from './config.js';
import API from './api.js';

// TODO: make each service a model, with methods to stringify and convert api<>localStorage
// TODO: make the list of services a model, with methods to stringify and convert api<>localStorage

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
    encryptedData: null
  },

  getState () {
    return this.state;
  },

  // TODO: service model with attrs
  onServiceChanged (name) {
    if (name !== null && name !== undefined) {
      var data = this._parseStoredData();
      this.state.service = name;
      if (data[name] !== null && data[name] !== undefined) {
        this.state.outputLength = data[name].outputLength;
        this.state.suffix = data[name].suffix;
        this.state.algorithm = data[name].algorithm;
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

    this.stored.encryptToken = sha256.digest("123"); // TODO: temporary
  },
  clearStateAndStorage () {
    this.clearState();
    this._clearStorage();
    this._reloadStoredServices();
  },

  // reloads the data from the API, saves in localStorage and sets them in the current state
  fetchDataFromAPI (callback=null) {
    API.load(this.stored.encryptToken, (r, encrypted, decrypted) => {
      console.log("-- loaded", r);
      if (r && decrypted !== null && decrypted !== undefined) {
        this._updateEncryptedData(encrypted);
        callback(true);
      } else {
        callback(false);
      }
    });
  },

  // saves the current state in the API
  saveCurrentState (callback) {
    if (this.state.service !== null && this.state.service !== undefined) {

      // add the current state to the service list
      var services = _parseStoredData();
      // TODO: service model
      services[this.state.service] = {
        service: this.state.service,
        outputLength: this.state.outputLength,
        suffix: this.state.suffix,
        algorithm: this.state.algorithm,
        prefix: null
      };

      this._saveServicesOnAPI(services, (r) => {
        callback(r);
      });

    } else {
      callback(false);
    }
  },

  // removes a service
  removeService (callback) {
    var name = this.state.service;
    var services = _parseStoredData();
    if (name !== null && name !== undefined && services[name] !== null && services[name] !== undefined) {

      // remove the service from the list
      delete services[name];

      this._saveServicesOnAPI(services, (r) => {
        callback(r, name);
      });
    } else {
      callback(false, null);
    }
  },


  // save the `services` on the API
  _saveServicesOnAPI (services, callback) {
    console.log("--- saving", services);
    API.save(this.stored.encryptToken, services, (r, encrypted) => {
      console.log("--- save returned", r, encrypted);
      if (r) {
        this._updateEncryptedData(encrypted);
        callback(true);
      } else {
        callback(false);
      }
    });
  },

  // remove everything stored in local storage
  _clearStorage () {
    return localStorage.shapassData = null;
  },

  // reloads the list of service names from localStorage to current state
  _reloadStoredServices () {
    var data = this._parseStoredData();
    this.state.servicesForSelect = Object.keys(data).sort().map(function(key) {
      // TODO: service model with attrs
      return { name: key, outputLength: data[key].outputLength,
               suffix: data[key].suffix, prefix: data[key].prefix };
    });
  },

  // reads the services in the storage and returns an object with them
  _parseStoredData () {
    this.stored = JSON.parse(localStorage.shapassData || null) || {};
    console.log("reading stored data", stored);
    return shapassDecrypt(this.stored.encryptToken, this.stored.encryptedData);
  },

  // save into local storage the info in this object
  _saveStoredData () {
    localStorage.shapassData = this.stored;
    console.log("updated localStorage to", localStorage.shapassData);
  },

  // update the encrypted data and save/reload what needs to be
  _updateEncryptedData (encrypted) {
    this.stored.encryptedData = encrypted;
    this._saveStoredData();
    this._reloadStoredServices();
  },
};


// const Store = {
//   state: {
//     service: null,
//     outputLength: Configs.DEFAULT_LENGTH,
//     suffix: null,
//     prefix: null,
//     master: null,
//     generated: null,
//     algorithm: Configs.DEFAULT_ALGORITHM,
//     services: [],
//     servicesForSelect: []
//   },
//   savedServices () {
//     return JSON.parse(localStorage.shapassData || null) || {};
//   },
//   clearSavedServices () {
//     return localStorage.shapassData = null;
//   },
//   savedServiceNames () {
//     var data = this.savedServices();
//     return Object.keys(data);
//   },
//   loadStateConfigs (name) {
//     if (name !== null && name !== undefined) {
//       var data = this.savedServices();
//       this.state.service = name;
//       if (data[name] !== null && data[name] !== undefined) {
//         this.state.outputLength = data[name].outputLength;
//         this.state.suffix = data[name].suffix;
//         this.state.algorithm = data[name].algorithm;
//       } else {
//         this.state.outputLength = Configs.DEFAULT_LENGTH;
//         this.state.suffix = null;
//       }
//       return this.state;
//     } else {
//       return null;
//     }
//   },
//   clearEntries () {
//     this.state.outputLength = Configs.DEFAULT_LENGTH;
//     this.state.suffix = null;
//     this.state.prefix = null;
//     this.state.master = null;
//     this.state.service = null;
//     this.state.generated = null;
//     this.state.algorithm = Configs.DEFAULT_ALGORITHM;
//   },
//   clearEntriesAndServices () {
//     this.clearEntries();
//     this.clearSavedServices();
//     this.reloadStateServices();
//   },

//   // reloads the list of service names from localStorage to current state
//   reloadStateServices () {
//     var data = this.savedServices();
//     this.state.services = this.savedServiceNames();
//     this.state.servicesForSelect = Object.keys(data).sort().map(function(key) {
//       return { name: key, outputLength: data[key].outputLength, suffix: data[key].suffix, prefix: data[key].prefix };
//     });
//   },

//   // reloads the services from the API, saves in localStorage and sets them in the current state
//   reloadServices (callback=null) {
//     API.load((r) => {
//       console.log("-- loaded", r);
//     });
//     // TODO: load instead of list
//     API.list((services) => {
//       if (services !== null && services !== undefined) {
//         var data = {};
//         services.forEach((s) => {
//           data[s.Name] = {
//             service: s.Name,
//             outputLength: Configs.boundedOutputLength(s.Length),
//             suffix: s.Suffix,
//             prefix: s.Prefix,
//             algorithm: s.Algorithm
//           };
//         });
//         localStorage.shapassData = JSON.stringify(data);
//         console.log("updated localStorage to", localStorage.shapassData);
//       } // TODO: else?
//       this.reloadStateServices();
//       if (callback) { callback(); }
//     });
//   },

//   // removes a service from the API then from localStorage
//   removeService (callback) {
//     var name = this.state.service;
//     if (name !== null && name !== undefined) {
//       API.delete(name, (r) => {
//         if (r) {
//           var data = this.savedServices();
//           delete data[name];
//           localStorage.shapassData = JSON.stringify(data);
//           this.reloadStateServices();
//           callback(true, name);
//         } else {
//           callback(false, null);
//         }
//       });
//     } else {
//       callback(false, null);
//     }
//   },

//   // saves the current state in localStorage and in the API
//   saveCurrentState (callback) {
//     if (this.state.service !== null && this.state.service !== undefined) {
//       console.log("--- saving", this.state);
//       API.save(this.state, (r) => {
//         console.log("--- save returned", r);
//         callback(true, null);
//       });

//       // TODO: save the data encrypted in the localStorage?

//       // API.create(this.state.service, this.state.outputLength, this.state.prefix, this.state.suffix, this.state.algorithm, (r) => {
//       //   console.log("remote save returned", r);
//       //   if (r) {
//       //     var data = this.savedServices();
//       //     data[this.state.service] = {
//       //       service: this.state.service,
//       //       outputLength: this.state.outputLength,
//       //       suffix: this.state.suffix,
//       //       algorithm: this.state.algorithm,
//       //       prefix: null
//       //     };
//       //     localStorage.shapassData = JSON.stringify(data);
//       //     this.reloadStateServices();
//       //     console.log("saved locally and returning ok");
//       //     callback(true, data[this.state.service]);
//       //   } else {
//       //     console.log("returning error locally");
//       //     callback(false, null);
//       //   }
//       // });
//     } else {
//       callback(false, null);
//     }
//   },
// };

export default Store2;
