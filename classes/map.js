/*
    map.js

    Mar 01 2022   Initial

*/
export default class map {

  constructor (city) {
    this.version = "map.js 1.10 Mar 02 2022"
    this.availablecities = [
      {name: 'LYON', coord:  [4.8339838, 45.7569838] },
      {name: 'TOULOUSE', coord:  [1.42988070604336, 43.5935069290371, ] },
      {name: 'BRUXELLES', coord:  [4.38418,50.84177] },
    ];
    this.zoomfactor = 12; 

    this.city = this.checkRequestedCity(city);   // Which map are we going to build ? 
    console.log('Now get the map for ' + this.city.name);
    this.createMap();
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
  // ----------------------------------------------- Open Layer map
  createMap() {
    // If the city is WORLD (unfound city in the list), reduce zoom
    if(this.city.name === 'WORLD')
      this.zoomfactor = 2;
    let map = new ol.Map({
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
      console.log(map)
    console.log('Map created for ' + this.city.name + ' on ' + this.city.coord);
  }

  getVersion() {
    return this.version;
  }

}