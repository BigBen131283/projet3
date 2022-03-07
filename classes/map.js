/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Play with markers. 
    Mar 04 2022   Test MAPQUEST. 
    Mar 05 2022   Test MAPQUEST. 

*/

export default class map {

  constructor () {
    this.version = "map.js 1.25 Mar 06 2022 : "
    this.map = null;
    this.mapquestkey = 'rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
    this.cityname = null;
  }
  // ----------------------------------------------- Open Layer map
  createMap(selectedcity) {
    this.cityname = selectedcity.name;
    L.mapquest.key = this.mapquestkey;
    this.map = L.mapquest.map('map', {
      center: selectedcity.coord,
      layers: L.mapquest.tileLayer('map'),
      zoom: 12,   // Zoom range from 1 to 18, the greater the more focused
      minZoom: 10,
      maxZoom: 16,
      zoomlevelschange: this.zoomLevelChange,
    });
    this.map.on('click', this.click);
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
  click(ev) {
    console.log(ev.latlng); // ev is an event object (MouseEvent in this case)
  };
  // ----------------------------------------------- 
  zoomLevelChange(event) {
    console.log('Zoom level changed to : ' + event)
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