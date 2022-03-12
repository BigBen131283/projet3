/*
    main.js

    Mar 11 2022 Initial
    Mar 12 2022 Additional work on inheritance

*/
import onemap from './classes/city.js';
import velo from './classes/velo.js';
import moto from './classes/moto.js';

const version = " [ script.js 1.02 Mar 12 2022 ] "

// -----------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------
import { getDateTime  } from './utilities/datetime.js';

document.getElementById("thedate").textContent = getDateTime();

// Instantiate a onemap object
let cityobject = new onemap('PARIS');
log("The created city is : " + cityobject.getCityName());
//
//  Some work on onheritance
//
let vttred = new velo('Red', 32, 40, 190, 'VTT');
let roadwhite = new velo('White', 8, 70, 2100, 'ROAD');
// Check some bycicle characteristics
log(`Red ${vttred.getType()} ${vttred.getColor()} costs ${vttred.getPrice()}€ and weights ${vttred.getWeight()} kilos`);
log(`White  ${roadwhite.getType()} ${roadwhite.getColor()} costs ${roadwhite.getPrice()}€ and  weights ${roadwhite.getWeight()} kilos`);
// Now create motor bikes
let triple1050 = new moto('white',
                            198,
                            220,
                            18000,
                            'Roadster',
                            150,
                            'Triumph',
                            'Triple 1050'
                          )
let triple1200 = new moto('Black',
                          185,
                          240,
                          20000,
                          'Roadster',
                          180,
                          'Triumph',
                          'Triple 1200'
                        )
log(`${triple1050.getMark()}/${triple1050.getModel()} Power: ${triple1050.getPower()} Weight: ${triple1050.getWeight()}`   )
log(`${triple1200.getMark()}/${triple1200.getModel()} Power: ${triple1200.getPower()} Weight: ${triple1200.getWeight()}`  )
// -----------------------------------------------------------------
//  Log
// -----------------------------------------------------------------
function log(message) {
  console.log(getDateTime() + version + message);
}





