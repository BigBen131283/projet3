/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Play with markers. 
    Mar 04 2022   Test MAPQUEST. 
    Mar 05 2022   Test MAPQUEST. 

*/

import stations from './stations.js'
export default class map {

  constructor () {
    this.version = "map.js 1.17 Mar 05 2022 : "
    this.availablecities = [
      {name: 'LYON', coord:  [45.7569838, 4.8339838 ] },
      {name: 'TOULOUSE', coord:  [43.5935069290371, 1.42988070604336 ] },
      {name: 'BRUXELLES', coord:  [50.84177,4.38418] },
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
  // ----------------------------------------------- Get cities list
  getCityName() {
    return this.city.name;
  }
  // ----------------------------------------------- Open Layer map
  createMap(selectedcity = 'WORLD') {
    this.city = this.checkRequestedCity(selectedcity) ;
    L.mapquest.key = this.mapquestkey;
    this.map = L.mapquest.map('map', {
      center: this.city.coord,
      layers: L.mapquest.tileLayer('map'),
      zoom: this.zoom
    });
    L.marker(this.city.coord).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();    
    this.log('Map created for ' + this.city.name + ' on ' + this.city.coord);
  }
  // ----------------------------------------------- Switch the map when new city selected
  switchMap(selectedcity) {
    this.city = this.checkRequestedCity(selectedcity);
    this.map.setView(this.city.coord, this.zoom);
  }
  // ----------------------------------------------- 
  displayStations(stations) {
    const nstations = stations.length;
    this.log(`Now displaying ${this.city.name} stations (${nstations})`);
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