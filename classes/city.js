/*
    city.js

    Mar 05 2022   Initial
    Mar 09 2022   Remove stations from this class
    Mar 10 2022   Finalize reorg
    Mar 12 2022   Add Hossegor ;-)
    Mar 15 2022   Work on input form to reserve a bike

*/

import map from './map.js';
export default class city {

  constructor (cityname = 'WORLD') {
      this.version = "city.js 1.15 Mar 15 2022 : "
      // Some of the cities managed by JCDecaux
      this.availablecities = [
        {name: 'LYON', coord:  [45.7569838, 4.8339838 ] },
        {name: 'TOULOUSE', coord:  [43.5935069290371, 1.42988070604336 ] },
        {name: 'BRUXELLES', coord:  [50.84177,4.38418] },
        {name: 'NANTES', coord:  [47.202127, -1.5787] },
        {name: 'MARSEILLE', coord:  [43.25850879475187, 5.398913930872] },
        {name: 'SEVILLE', coord:  [37.372322, -5.963171] },
        {name: 'HOSSEGOR', coord:  [43.6649007, -1.4347417] },
      ];
      this.selectedcity = this.checkRequestedCity(this.availablecities[0].name);
      this.themap = new map(this.selectedcity);
      this.themap.createMap();
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
  // ----------------------------------------------- Another city is selected
  setPosition(cityname) {
    this.selectedcity = this.checkRequestedCity(cityname);
    this.themap.changeMap(this.selectedcity);
    return;
  }
  // ----------------------------------------------- 
  reserveBike() {
    this.themap.reserveBike();
  }
  // ----------------------------------------------- 
  getBikesStatus() {
    return this.themap.getBikesStatus();
  }
  // ----------------------------------------------- 
  getPosition(cityname) {    
    return this.city.name;
  }
  // ----------------------------------------------- 
  getCityName() {
    return this.city.name;
  }
  // ----------------------------------------------- 
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
