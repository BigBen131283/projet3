/*
    main.js

    Mar 11 2022 Initial

*/
import onemap from './classes/city.js';

const version = " [ script.js 1.00 Mar 11 2022 ] "

// -----------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------
import { getDateTime  } from './utilities/datetime.js';

document.getElementById("thedate").textContent = getDateTime();

// Instantiate a onemap object
let cityobject = new onemap('PARIS');
log("The created city is : " + cityobject.getCityName());

// -----------------------------------------------------------------
//  Log
// -----------------------------------------------------------------
function log(message) {
  console.log(getDateTime() + version + message);
}





