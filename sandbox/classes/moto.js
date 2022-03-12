/*
    moto.js

    Mar 11 2022 Initial

*/

import { getDateTime  } from '../utilities/datetime.js';
import vehicle from './vehicle.js'

export default class moto extends vehicle {


   #versionvelo = " [ moto.js 1.00 Mar 12 2022 ] "
  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor(color, weight, maxspeed, price, thetype, power, mark, markmodel) {
    super(color, weight, maxspeed, price);
    this.thetype = thetype;         // Road, Trial, Cross, Roadster, Racing...
    this.power = power;
    this.mark = mark;
    this.markmodel = markmodel;
  }
  // -----------------------------------------------------------------
  //  Getters
  // -----------------------------------------------------------------
  getType() { return this.thetype }
  getPower() { return this.power}
  getMark() { return this.mark}
  getModel() { return this.markmodel}
  // -----------------------------------------------------------------
  //  Log
  // -----------------------------------------------------------------
  log(message) {
    console.log(getDateTime() + this.getVersion() + message);
  } 
}