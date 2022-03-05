/*
    stations.js

    Mar 03 2022   Initial

*/
export default class stations {

  #urlbase = "https://api.jcdecaux.com/vls/v1/stations";
  #apikey = "0b872e25a940eeebc3e9a35346780b1074916a8f";

  constructor (stationcontract) {
      this.version = "stations.js 1.18 Mar 05 2022 : "
      this.stationcontract = stationcontract;
      this.citystations = {};
  }
  // ----------------------------------------------- 
  // Retrieve the json list of all stations for a 
  // given contract name
  // This method is internal
  // ----------------------------------------------- 
  async loadStations() {
    let url = this.#urlbase + "?contract=" + this.stationcontract + "&apiKey=" + this.#apikey;
    return fetch(url)
      .then( response => {
        return response.json();
      })
      .then( json =>  { 
        this.citystations = json;
        return "OK"
      })
      .catch (error => this.log(error))
  }
  // ----------------------------------------------- 
  getStations() {
    return this.citystations;
  }
  
  // ----------------------------------------------- 
  getVersion() {
    return this.version;
  }
  // ----------------------------------------------- 
  log(message) {
    console.log(this.version + message);
  }
}
