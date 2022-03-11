/*
    map.js

    Mar 01 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Play with markers. 
    Mar 04 2022   Test MAPQUEST. 
    Mar 05 2022   Test MAPQUEST. 
    Mar 08 2022   Test MAPQUEST. Play with controls, zoom, etc...
    Mar 09 2022   Test MAPQUEST. Study the drag map event
                  Stations are now managed by this class
    Mar 10 2022   Finalize reorg
    Mar 11 2022   Station list is now managed by stations object

*/

import stations from './stations.js';
export default class map {

  #defaultzoom = 12;

  constructor (selectedcity) {
    this.version = "map.js 1.47 Mar 11 2022 : "
    this.mapquestkey = 'rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
    this.cityname = selectedcity.name;
    this.citycoordinates = selectedcity.coord;
    this.currentzoom = this.#defaultzoom;
    this.map = null;
    this.center = [0,0];
    this.latLngBounds = [];    
    this.thestations = new stations(this.cityname);
    this.thestations.loadStations()
      .then( (resp) => {
        this.displayStations();
      })
      .catch( (error) => {
        this.log(error);
      });
    // Just for fun, get user position
    // We could imagine to create the map directly on user position
    // But his location will probably not be in a JCDECAUX managed city
    navigator.geolocation.getCurrentPosition((position) => {
      this.myposition = [ position.coords.latitude, position.coords.longitude];
      this.log(`You are located on these coordinates : ${this.myposition}`);
    });
    

  }
  // ----------------------------------------------- Mapquest / leaflet map
  createMap() {
    L.mapquest.key = this.mapquestkey;
    this.map = L.mapquest.map('map', {
      center: this.citycoordinates,
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
    this.log('Map created for ' + this.cityname + ' on ' + this.citycoordinates);
  }
  // ----------------------------------------------- 
  changeMap(selectedcity) {
    this.map.setView(selectedcity.coord);
    this.cityname = selectedcity.name;
    this.citycoordinates = selectedcity.coord;
    this.currentzoom = this.#defaultzoom;
    this.latLngBounds = this.map.getBounds();   
    this.center = this.map.getCenter();
    this.thestations = new stations(this.cityname);
    this.thestations.loadStations()
      .then( (resp) => {
        this.displayStations();
      })
      .catch( (error) => {
        this.log(error);
      });
  }
  // ----------------------------------------------- 
  displayStations() {
    let stationslist = this.thestations.getStations();
    let citymarker = L.marker(this.citycoordinates, {
      icon: L.mapquest.icons.marker(),
      draggable: false
    })
    citymarker.bindPopup(this.cityname +  '<br>' + stationslist.length + ' available');
    citymarker.addTo(this.map);
    this.#countEligibleStations(stationslist);
  }

  #countEligibleStations(stationlist) {
    console.log(this.latLngBounds._northEast + '/' + this.latLngBounds._southWest);
    const latSouth = this.latLngBounds._southWest.lat;
    const latNorth = this.latLngBounds._northEast.lat;
    const longEast = this.latLngBounds._northEast.lng;
    const longWest = this.latLngBounds._southWest.lng;
    console.log('Search for points between ' + longWest + ' and ' + longEast + ' longitude')
    console.log('Search for points between ' + latSouth + ' and ' + latNorth + ' latitude')
    let elligiblestations = 0;
    for(let i = 0; i < stationlist.length; ++i) {
      if(stationlist[i].position.lat > latSouth
          && stationlist[i].position.lat < latNorth
          && stationlist[i].position.lng > longWest
          && stationlist[i].position.lng < longEast) {
            ++elligiblestations;
          }
    }
    this.log(`There are ${elligiblestations} within this map boundaries`);
  }

  // ----------------------------------------------- 
  //  Some map event handlers
  // ----------------------------------------------- 
  click(clickevent) {
    this.citycoordinates = clickevent.latlng;
    // We decided to center the map on the clicked position
    // That was not specified in the customer request
    this.map.setView(this.citycoordinates, this.zoom);
    this.latLngBounds = this.map.getBounds();
    this.center = this.map.getCenter();
    this.displayStations();
  };
  // ----------------------------------------------- 
  zoomLevelChange(zoomevent) {
    this.currentzoom = zoomevent.zoom;
    this.latLngBounds = this.map.getBounds();
    this.center = this.map.getCenter();
    this.displayStations();
  }
  // ----------------------------------------------- 
  move(moveevent) {
    this.latLngBounds = this.map.getBounds();
    this.center = this.map.getCenter();
    this.displayStations();
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