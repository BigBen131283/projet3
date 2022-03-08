/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Play with markers. 
    Mar 04 2022   Test MAPQUEST. 
    Mar 05 2022   Test MAPQUEST. 
    Mar 08 2022   Test MAPQUEST. Play with controls, zoom, etc...

*/

export default class map {

  #defaultzoom = 12;

  constructor () {
    this.version = "map.js 1.32 Mar 08 2022 : "
    this.map = null;
    this.mapquestkey = 'rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
    this.cityname = null;
    this.currentzoom = this.#defaultzoom;
  }
  // ----------------------------------------------- Mapquest / leaflet map
  createMap(selectedcity) {
    this.cityname = selectedcity.name;
    L.mapquest.key = this.mapquestkey;
    this.map = L.mapquest.map('map', {
      center: selectedcity.coord,
      layers: L.mapquest.tileLayer('map'),
      zoom: this.currentzoom,     
                    // Zoom range from 1 to 18, the greater the more focused
      minZoom: 10,  // No need to dezoom on the entire world
      maxZoom: 16,  // No need to zoom on a single street
    });
    L.control.layers({
      'Map': L.mapquest.tileLayer('map'),
      'Satellite': L.mapquest.tileLayer('satellite'),
    }).addTo(this.map);
    L.control.scale({"imperial": false}).addTo(this.map);
    this.map.on('click', this.click);               // Take some action on click
    this.map.on('zoomanim',this.zoomLevelChange, this);   // Handle zoom change
    this.log('Map created for ' + selectedcity.name + ' on ' + selectedcity.coord);
    return this;
  }
  // ----------------------------------------------- 
  displayStations(stations, selectedcity) {
    this.cityname = selectedcity.name;
    const nstations = stations.length;
    L.marker(selectedcity.coord).addTo(this.map)
      .bindPopup(this.cityname +  '<br>' + nstations)
      .openPopup();
    this.map.setView(selectedcity.coord, this.zoom);
    this.log(`Now displaying ${this.cityname} stations (${nstations})`);
  }

  // ----------------------------------------------- 
  //  Some map event handlers
  // ----------------------------------------------- 
  click(clickevent) {
    console.log(clickevent.latlng); // clickevent is a MouseEvent object
  };
  // ----------------------------------------------- 
  zoomLevelChange(zoomevent) {
    console.log( zoomevent.zoom);
  }
   // ----------------------------------------------- 
  //  Misc
  // ----------------------------------------------- 
  getVersion() {
    return this.version;
  }
  // ----------------------------------------------- 
  log(message) {
    console.log(this.version + message);
  }
}