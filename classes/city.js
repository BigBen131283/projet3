/*
    city.js

    Mar 05 2022   Initial

*/

import map from './map.js';
import stations from './stations.js';

export default class city {

  constructor (cityname = 'WORLD') {
      this.version = "city.js 1.06 Mar 05 2022 : "
      this.availablecities = [
        {name: 'LYON', coord:  [45.7569838, 4.8339838 ] },
        {name: 'TOULOUSE', coord:  [43.5935069290371, 1.42988070604336 ] },
        {name: 'BRUXELLES', coord:  [50.84177,4.38418] },
      ];
      this.selectedcity = this.checkRequestedCity(this.availablecities[0].name);
      this.themap = new map().createMap(this.selectedcity);
      this.citystations = new stations(this.selectedcity.name);
      (async () => {
        await this.citystations.loadStations().then(message => {
          this.themap.displayStations(this.citystations.getStations(), this.selectedcity);
        })
      })()
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
    this.themap.switchMap(this.selectedcity);
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
