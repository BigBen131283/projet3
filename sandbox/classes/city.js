/*
    city.js

    Mar 01 2022 Initial

*/

import { getDateTime  } from '../utilities/datetime.js';
import onemap from './onemap.js';

export default class city {

   #version = " [ city.js 1.00 Mar 11 2022 ] "

  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor (cityname) {
    this.cityname = cityname;
    this.map = new onemap(cityname + "-MAP");
    this.log("City Constructor executed" );
    this.log("An associated map has been created : " + this.map.getMapName());
  }
  // -----------------------------------------------------------------
  //  Getters
  // -----------------------------------------------------------------
  getCityName() {
    return this.cityname;
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