/*
    map.js

    Mar 01 2022   Initial

*/

export default class map {

  constructor (city) {
    this.version = "map.js 1.03 Mar 01 2022"
    this.city = city;   // Which map are we going to build ? 
    console.log('Now get the map for ' + this.city);
  }
  createMap() {
    var map = new ol.Map({
      target: 'map',
      layers: [
      new ol.layer.Tile({
          source: new ol.source.OSM()
      })
      ],
      view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4
      })
  });

  }

  getVersion() {
    return this.version;
  }

}