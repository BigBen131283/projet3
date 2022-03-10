/*
    city.js

    Mar 05 2022   Initial
    Mar 09 2022   Remove stations from this class
    Mar 10 2022   Finalize reorg

*/

import map from './map.js';
export default class city {

  constructor (cityname = 'WORLD') {
      this.version = "city.js 1.10 Mar 10 2022 : "
      // Some of the cities managed by JCDecaux
      this.availablecities = [
        {name: 'LYON', coord:  [45.7569838, 4.8339838 ] },
        {name: 'TOULOUSE', coord:  [43.5935069290371, 1.42988070604336 ] },
        {name: 'BRUXELLES', coord:  [50.84177,4.38418] },
      ];
      this.selectedcity = this.checkRequestedCity(this.availablecities[0].name);
      this.themap = new map(this.selectedcity).createMap();
    }
  // ----------------------------------------------- Check city is in the supported list
  checkRequestedCity(city) {
    let thecity = { name: 'WORLD', coord: [0,0] };
    for(let i = 0; i < this.availablecities.length; ++i) {
      if(this.availablecities[i].name === city) {
        thecity=  this.availablecities[i];
        break;
      }
    }
    return thecity;
  }
  // ----------------------------------------------- Get cities list
  setPosition(cityname) {
    this.selectedcity = this.checkRequestedCity(cityname);
    return;
  }
  // ----------------------------------------------- Get cities list
  getPosition(cityname) {    
    return this.city.name;
  }
  // ----------------------------------------------- Get cities list
  getCityName() {
    return this.city.name;
  }
  // ----------------------------------------------- Get cities list
  getCities() {
    return this.availablecities;
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
