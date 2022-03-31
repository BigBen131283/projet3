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
    Mar 12 2022   Change the click and zoom handlers code
    Mar 13 2022   Stations display is now dependent of the zoom factor
    Mar 14 2022   Some code optimization
    Mar 15 2022 Start work on user / password
    Mar 16 2022   Add method, suppress unused vars
    Mar 17 2022   Fix UI update problems ( resabutton )

*/

import stations from './stations.js';
export default class map {

  #defaultzoom = 12;
  #minzoom = 10;
  #maxzoom = 18;
  #primarycolor = '#2B29FF';           // Station circle display colors
  #secondarycolor = '#3B5998';
  #inactivecolor = '#EB1C41';
  #resacolor = "#30D620";
  #limitstations = 80;                 // Do not display more stations on the map
  // ----------------------------------------------- 
  //  Class constructor
  // ----------------------------------------------- 
  constructor (selectedcity) {
    this.version = "map.js 1.63 Mar 17 2022 : "
    this.mapquestkey = 'rQpw7O2I6ADzhQAAJLS4vZZ5PN7TLMX2';
    this.cityname = selectedcity.name;
    this.citycoordinates = selectedcity.coord;
    this.currentzoom = this.#defaultzoom;
    this.map = null;
    this.center = [0,0];
    this.latLngBounds = [];
    this.markergroup;               // Manage markers displayed on the map
    this.thestations = new stations(this.cityname);
    this.stationslist = [];
    // Load the associated stations
    this.thestations.loadStations().then( (resp) => {
      this.stationslist = resp;
        this.displayStations();
      })
      .catch( (error) => {
        this.log(error);
      });
    this.selectedstation = {};         // Currently selected station in the interface
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
      minZoom: this.#minzoom,  // No need to dezoom on the entire world
      maxZoom: this.#maxzoom,  // No need to zoom on a single street
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
    // Clear all station fields as the map changes
    window.postMessage({origin: 'MAPJS-CHANGECITY'} );
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
    // Get already loaded stations and search for those to be displayed
    this.stationslist = this.thestations.getStations();
    let nbstations = this.stationslist.length;
    this.log(`zoom : ${this.currentzoom}`);
    //---------------------------------------------
    // The display loop
    //---------------------------------------------
    this.markergroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });
    for(let i = 0; i < this.stationslist.length; ++i) {
      let thestation = this.stationslist[i];
      // Create the marker and bind its popup
      let citymarker = L.marker(thestation.position, 
          {
            icon: this.#createStationIcon(thestation),
            draggable: false,
            clickable: true,
            title: thestation.number,
          }).bindPopup(thestation.name);
      // Sorry, have to put handler code here as there is no access to "this"
      // if the code is located in external function
      citymarker.on('click',(e) => {
        this.selectedstation = {};
        // Should ALWAYS find the station as this function call
        // is triggered by a mouse event on the station !
        for(let i = 0; i < this.stationslist.length; ++i) {
          if(this.stationslist[i].number === e.sourceTarget.options.title) {
            this.selectedstation = this.stationslist[i];
            this.map.setView(this.selectedstation.position, this.zoom);   // Center the map on the clicked station
            // Refresh main page as a new station has been selected
            window.postMessage({origin: 'MAPJS-SELECTSTATION', stationobject: this.selectedstation} ); 
          }
        }
      });
      this.markergroup.addLayer(citymarker);
    }
    this.map.addLayer(this.markergroup);
  }
  // ----------------------------------------------- 
  BookBike() {
    this.selectedstation.available_bikes--;
    this.thestations.updateOneStation(this.selectedstation);
    this.markergroup.clearLayers();
    this.displayStations();
    window.postMessage({origin: 'MAPJS-BOOK', stationobject: this.selectedstation} ); 
  }
  // ----------------------------------------------- 
  DebookBike(station) {
    station.available_bikes++;
    this.thestations.updateOneStation(station);
    this.markergroup.clearLayers();
    this.displayStations();
    window.postMessage({origin: 'MAPJS-DEBOOK', stationobject: station} ); 
  }
  // ----------------------------------------------- 
  getSelectedStation() { 
    return this.selectedstation;
  }
  // ----------------------------------------------- 
  //  Some private functions
  // ----------------------------------------------- 
  #createStationIcon(station) {
    let primecolor = this.#primarycolor;    
    let secondcolor = this.#secondarycolor;
    if(station.available_bikes === 0 && !station.resabike) {
      primecolor = secondcolor = this.#inactivecolor;
    }
    else {
      if(station.resabike)   // If a reservation is made, 
        secondcolor = this.#resacolor;
    }

    return L.mapquest.icons.circle(
      {
        primaryColor: primecolor,       // Outer circle line ?
        secondaryColor: secondcolor,   // Circle color ?
        shadow: true,
        symbol: station.available_bikes
      })
  }
  // ----------------------------------------------- 
  //  Some map event handlers
  // ----------------------------------------------- 
  click(clickevent) {
    this.citycoordinates = clickevent.latlng;
    // We decided to center the map on the clicked position
    // That was not specified in the customer request
    // This action will trigger a mov event, so move() will be called
    this.map.setView(this.citycoordinates, this.zoom); 
  };
  // ----------------------------------------------- 
  zoomLevelChange(zoomevent) {
    this.currentzoom = zoomevent.zoom;
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