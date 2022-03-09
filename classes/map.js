/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Play with markers. 
    Mar 04 2022   Test MAPQUEST. 
    Mar 05 2022   Test MAPQUEST. 
    Mar 08 2022   Test MAPQUEST. Play with controls, zoom, etc...
    Mar 09 2022   Test MAPQUEST. Study the drag map event

*/

export default class map {

  #defaultzoom = 12;

  constructor () {
    this.version = "map.js 1.35 Mar 09 2022 : "
    this.map = null;
    this.mapquestkey = 'rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
    this.cityname = null;
    this.currentzoom = this.#defaultzoom;
    this.latLngBounds = {};
    this.center = [0,0];
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
    this.center = this.map.getCenter();
    L.control.layers({
      'Map': L.mapquest.tileLayer('map'),
      'Satellite': L.mapquest.tileLayer('satellite'),
    }).addTo(this.map);
    L.control.scale({"imperial": false}).addTo(this.map);
    // When setting these handlers, we pass the optional 2nd argument so that "this"
    // is accessible from within the handler
    this.map.on('click', this.click, this);               // Take some action on click
    this.map.on('zoomanim',this.zoomLevelChange, this);   // Handle zoom change
    this.map.on('moveend', this.move, this);              // Handle dragging map
    this.latLngBounds = this.map.getBounds();
    this.log('Map created for ' + selectedcity.name + ' on ' + selectedcity.coord);
    return this;
  }
  // ----------------------------------------------- 
  displayStations(stations, selectedcity) {
    this.cityname = selectedcity.name;
    const nstations = stations.length;
    L.marker(selectedcity.coord).addTo(this.map)
      .bindPopup(this.cityname +  '<br>' + nstations + ' available')
      .openPopup();
    this.map.setView(selectedcity.coord, this.zoom);
    this.#countEligibleStations(stations);
    this.log(`Now displaying ${this.cityname} stations (${nstations})`);
  }

  #countEligibleStations(stations) {
//    for(let i = 0; i < stations.length; ++i) {
  console.log(this.latLngBounds);
  console.log(this.latLngBounds._northEast + '/' + this.latLngBounds._southWest);
  const latSouth = this.latLngBounds._southWest.lat;
  const latNorth = this.latLngBounds._northEast.lat;
  const longEast = this.latLngBounds._northEast.lng;
  const longWest = this.latLngBounds._southWest.lng;
  console.log('Search for points between ' + longWest + ' and ' + longEast + ' longitude')
  console.log('Search for points between ' + latSouth + ' and ' + latNorth + ' latitude')
  for(let i = 0; i < 5; ++i) {
    console.log(stations[i].position)
  }
  }

  // ----------------------------------------------- 
  //  Some map event handlers
  // ----------------------------------------------- 
  click(clickevent) {
    this.map.setView(clickevent.latlng);
    this.latLngBounds = this.map.getBounds();
    this.center = this.map.getCenter();
  };
  // ----------------------------------------------- 
  zoomLevelChange(zoomevent) {
    this.currentzoom = zoomevent.zoom;
    this.latLngBounds = this.map.getBounds();
    this.center = this.map.getCenter();
  }
  // ----------------------------------------------- 
  move(moveevent) {
    this.latLngBounds = this.map.getBounds();
    this.center = this.map.getCenter();
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