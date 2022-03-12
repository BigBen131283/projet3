/*
    velo.js

    Mar 11 2022 Initial

*/

import { getDateTime  } from '../utilities/datetime.js';
import vehicle from './vehicle.js'

export default class velo extends vehicle {


   #versionvelo = " [ velo.js 1.00 Mar 12 2022 ] "
  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor(color, weight, maxspeed, price, thetype) {
    super(color, weight, maxspeed, price);
    this.thetype = thetype;         // VTT, Road,...
  }
  // -----------------------------------------------------------------
  //  Getters
  // -----------------------------------------------------------------
  getType() { return this.thetype }
  // -----------------------------------------------------------------
  //  Log
  // -----------------------------------------------------------------
  log(message) {
    console.log(getDateTime() + this.getVersion() + message);
  } 
}