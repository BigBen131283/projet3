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
    this.version = "map.js 1.20 Mar 05 2022 : "
    this.zoom = 12; 
    this.map = null;
    this.mapquestkey = '	rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
    this.cityname = null;
  }
  // ----------------------------------------------- Open Layer map
  createMap(selectedcity) {
    this.cityname = selectedcity.name;
    L.mapquest.key = this.mapquestkey;
    this.map = L.mapquest.map('map', {
      center: selectedcity.coord,
      layers: L.mapquest.tileLayer('map'),
      zoom: this.zoom
    });
    L.marker(selectedcity.coord).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
    this.log('Map created for ' + selectedcity.name + ' on ' + selectedcity.coord);
    return this;
  }
  // ----------------------------------------------- Switch the map when new city selected
  switchMap(selectedcity) {
    this.map.setView(selectedcity.coord, this.zoom);
  }
  // ----------------------------------------------- 
  displayStations(stations) {
    const nstations = stations.length;
    this.log(`Now displaying ${this.cityname} stations (${nstations})`);
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