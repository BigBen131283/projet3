/*
    stations.js

    Mar 11 2022 Initial

*/
import { getDateTime } from '../utilities/datetime.js';
export default class stations {

  #version = " [ stations.js 1.00 Mar 11 2022 ] "
  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor (mapname) {
      this.mapname = mapname;
      this.stations = [];
      this.log("Stations Constructor executed" );
  }
  // -----------------------------------------------------------------
  //  Getters
  // -----------------------------------------------------------------
  getVersion() {
    return this.#version;
  }
  // -----------------------------------------------------------------
  //  Setters
  // -----------------------------------------------------------------
  buildStationsList(nstations) {
    for(let i = 0; i < nstations; ++i) {
      this.stations.push( { "name": "station#-" + i, "coord": [ 2*i, 4*i] } );
    }
    console.log(this.stations)
    this.log(this.stations.length + " stations added to this map (" + this.mapname + ")")
  }
  // -----------------------------------------------------------------
  //  Log
  // -----------------------------------------------------------------
  log(message) {
    console.log(getDateTime() + this.#version + message);
  } 
}


