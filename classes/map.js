/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Play with markers. 
    Mar 04 2022   Test MAPQUEST. 

*/
export default class map {

  constructor () {
    this.version = "map.js 1.16 Mar 04 2022"
    this.availablecities = [
      {name: 'LYON', coord:  [ 4.8339838, 45.7569838 ] },
      {name: 'TOULOUSE', coord:  [1.42988070604336, 43.5935069290371, ] },
      {name: 'BRUXELLES', coord:  [4.38418,50.84177] },
    ];
    this.zoom = 12; 
    this.city = null;
    this.map = null;
    this.mapquestkey = '	rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
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
  getCities() {
    return this.availablecities;
  }
  // ----------------------------------------------- Open Layer map
  createMap(selectedcity = 'WORLD') {
    this.city = this.checkRequestedCity(selectedcity) ;
    L.mapquest.key = this.mapquestkey;
    L.mapquest.map('map', {
      center: [37.7749, -122.4194],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });    console.log('Map created for ' + this.city.name + ' on ' + this.city.coord);
  }
  // ----------------------------------------------- Switch the map when new city selected
  switchMap(selectedcity) {
    this.city = this.checkRequestedCity(selectedcity) ;
  }
  // ----------------------------------------------- 
  getVersion() {
    return this.version;
  }

}