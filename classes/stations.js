/*
    stations.js

    Mar 03 2022   Initial
    Mar 05 2022   Tests
    Mar 09 2022   Change stations management logic.
    Mar 10 2022   Finalize reorg

*/
export default class stations {

  #urlbase = "https://api.jcdecaux.com/vls/v1/stations";
  #apikey = "0b872e25a940eeebc3e9a35346780b1074916a8f";

  constructor (cityname) {
      this.version = "stations.js 1.23 Mar 10 2022 : "
      this.cityname = cityname;
  }
  // ----------------------------------------------- 
  // Retrieve the json list of all stations for a 
  // given contract name from JCDecaux open data
  // ----------------------------------------------- 
  loadStations() {
    let url = this.#urlbase + "?contract=" + this.cityname + "&apiKey=" + this.#apikey;
    return new Promise( (resolve, reject) => {
      let request =  fetch(url)
      .then( response => {
        return response.json();
      })
      .then( json =>  { 
        resolve(json);
      })
      .catch (error => {
          this.log(error)
          reject(error);
        }
      )
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
