/*
    vehicle.js

    Mar 12 2022 Initial

*/

import { getDateTime  } from '../utilities/datetime.js';

export default class vehicle {


   #version = " [ vehicle.js 1.00 Mar 12 2022 ] "
  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  constructor(color, weight, maxspeed, price) {
    this.color = color;
    this.weight = weight;
    this.maxspeed = maxspeed;
    this.price = price;
    this.log("Vehicle constructor called");
  }
  // -----------------------------------------------------------------
  //  Getters
  // -----------------------------------------------------------------
  getWeight() { return this.weight}
  getColor() { return this.color}
  getMaxpeed() { return this.maxspeed}
  getPrice() { return this.price}
  getVersion() { return this.#version}
  // -----------------------------------------------------------------
  //  Log
  // -----------------------------------------------------------------
  log(message) {
    console.log(getDateTime() + this.#version + message);
  } 
}