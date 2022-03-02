/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map

*/
export default class map {

  constructor () {
    this.version = "map.js 1.12 Mar 02 2022"
    this.availablecities = [
      {name: 'LYON', coord:  [4.8339838, 45.7569838] },
      {name: 'TOULOUSE', coord:  [1.42988070604336, 43.5935069290371, ] },
      {name: 'BRUXELLES', coord:  [4.38418,50.84177] },
    ];
    this.zoomfactor = 12; 
    this.city = null;
    this.map = null;
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
    // If the city is WORLD (unfound city in the list), reduce zoom
    if(this.city.name === 'WORLD')
      this.zoomfactor = 2;
    this.map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
              source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat(this.city.coord),
          zoom: this.zoomfactor,
        })
      });
    console.log('Map created for ' + this.city.name + ' on ' + this.city.coord);
  }

  getVersion() {
    return this.version;
  }

}