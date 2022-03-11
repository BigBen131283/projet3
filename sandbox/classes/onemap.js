/*
    onemap.js

    Mar 01 2022 Initial

*/

import { getDateTime } from '../utilities/datetime.js';
import stations from './stations.js';

export default class onemap {

   #version = " [ onemap.js 1.01 Mar 11 2022 ] "
   #defautnumberofstations = 10;

  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor (mapname) {
    this.mapname = mapname;
    this.stations = new stations(mapname);
    this.stations.buildStationsList(this.#defautnumberofstations);
    this.log("Map Constructor executed" );
  }
  // -----------------------------------------------------------------
  //  Getters
  // -----------------------------------------------------------------
  getMapName() {
    return this.mapname;
  }
  getVersion() {
    return this.#version;
  }
  // -----------------------------------------------------------------
  //  Log
  // -----------------------------------------------------------------
  log(message) {
    console.log(getDateTime() + this.#version + message);
  }

}


