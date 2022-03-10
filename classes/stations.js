/*
    stations.js

    Mar 03 2022   Initial
    Mar 05 2022   Tests
    Mar 09 2022   Change stations management logic.

*/
export default class stations {

  #urlbase = "https://api.jcdecaux.com/vls/v1/stations";
  #apikey = "0b872e25a940eeebc3e9a35346780b1074916a8f";

  constructor (cityname) {
      this.version = "stations.js 1.21 Mar 09 2022 : "
      this.cityname = cityname;
  }
  // ----------------------------------------------- 
  // Retrieve the json list of all stations for a 
  // given contract name from JCDecaux open data
  // ----------------------------------------------- 
  loadStations() {
    let url = this.#urlbase + "?contract=" + this.cityname + "&apiKey=" + this.#apikey;
    let request =  fetch(url)
      .then( response => {
        return response.json();
      })
      .then( json =>  { 
        return json;
      })
      .catch (error => this.log(error))
    Promise.all([request]).then( (result) => {
      return result[0];
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
