/*
    template.js

    Mar 11 2022 Initial

*/

import { getDateTime  } from '../utilities/datetime.js';
export default class template {


   #version = " [ template.js 1.00 Mar 11 2022 ] "
  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor() {

  }
  // -----------------------------------------------------------------
  //  Log
  // -----------------------------------------------------------------
  log(message) {
    console.log(getDateTime() + this.#version + message);
  } 
}