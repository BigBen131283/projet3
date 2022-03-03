/*
    stations.js

    Mar 03 2022   Initial

*/
export default class stations {

  #urlbase = "https://api.jcdecaux.com/vls/v1/stations";
  #apikey = "0b872e25a940eeebc3e9a35346780b1074916a8f";

  constructor (stationcontract) {
      this.version = "stations.js 1.09 Mar 03 2022 : "
      this.stationcontract = stationcontract;
      this.citystations =  this.getStations(stationcontract)
                              .then ( response => {
                                this.log(response.length + ' stations found in ' +
                                  this.stationcontract);
                              })
                              .catch(error => {
                                this.log(error)
                              })      
  }
  // ----------------------------------------------- 
  // Retrieve the json list of all stations for a 
  // given contract name
  // ----------------------------------------------- 
  getStations(stationcontract) {
    let url = this.#urlbase + "?contract=" + stationcontract + "&apiKey=" + this.#apikey;
    return new Promise((resolve, reject) => {
        fetch(url)
          .then( response => {
            if(response.ok) {
              resolve(response.json());
            }
            else {
              reject('Error during station list fetch');
            }
          })
          .catch( error => {
            reject(error);
          })  
    })
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
