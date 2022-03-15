/*
    script.js

    Feb 26 2022 Initial
    Mar 02 2022 Work on lat / long coordinates when creating the map
    Mar 03 2022 Include Toggle Pause code from main branch
                Start work on API calls to JCDECAUX
    Mar 05 2022 Now start work on stations positionning to the selected map
    Mar 13 2022 Handle click on RESA button
    Mar 15 2022 Start work on user / password

*/
import city from './classes/city.js'

const version = "script.js 1.41 Mar 15 2022 : "

// -----------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------
log('Full reload');
const slide = ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"];
let numero = 0;
let isPaused = false
let thecity = new city();
let allcities =thecity.getCities();      // Get managed cities list
let formstatus = {                       // Used to manage the resa button status
    firstname: false,
    lastname: false,
    bikesavailable: false
}
let checkallinputs = () => { return ! (formstatus.firstname 
                                && formstatus.lastname 
                                && formstatus.bikesavailable); }

// Set some event in the web page
let boutonPause = document.getElementById("pause_button");
boutonPause.addEventListener('click', togglePause);
document.getElementById("previous").addEventListener('click', () => changeSlide(-1));
document.getElementById("next").addEventListener('click', () => changeSlide(1));
let cityselect = document.getElementById("cityselect");
// Change city listener
cityselect.addEventListener('change', () => switchCity());       
// Manage user name and password inputs
let lastname = document.getElementById("last_name");
let firstname = document.getElementById("first_name");
lastname.addEventListener('keyup', () => delay(lastnameinput));
firstname.addEventListener('keyup', () => delay(firstnameinput));
// Reservation button monitor
let resabutton = document.getElementById("resa")
resabutton.addEventListener('click', () => reserveBike());
resabutton.disabled = checkallinputs;

// Load the list box with supported cities
for(let i = 0; i < allcities.length; i++) {
    let option = document.createElement('option');
    option.value = option.innerHTML = allcities[i].name;
    cityselect.appendChild(option);
}
setInterval(autoDefil, 5000);
// Here we install a window event handler used by map.js
// to inform the main page that some update occured in the UI
// after choosing a bike station
window.addEventListener('message', (event) => {
    formstatus.bikesavailable = thecity.getBikesStatus();
    resabutton.disabled = checkallinputs();
    console.log(`Message reçu: ${event.data}`);
});
// -----------------------------------------------------------------
// Handling functions
// -----------------------------------------------------------------
// Input Delay utility
function WaitSomeTime(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};
const delay = WaitSomeTime(500);    // Wait 500 ms before processing user input
                                    // No need to work until the user has finished typing
// User input handlers
function lastnameinput() {
    formstatus.bikesavailable = thecity.getBikesStatus();
    if(lastname.value.length === 0) 
        { formstatus.lastname = false; }
    else { formstatus.lastname = true;}
    resabutton.disabled = checkallinputs();
    console.log(formstatus)
}
function firstnameinput() {
    formstatus.bikesavailable = thecity.getBikesStatus();
    if(firstname.value.length === 0) 
        { formstatus.firstname  = false; }
    else { formstatus.firstname = true;}
    resabutton.disabled = checkallinputs();
    console.log(formstatus)
}
// Resa  handler
function reserveBike() {
    thecity.reserveBike();
}

// For the image slider
function togglePause() {
    isPaused = !isPaused
    if (isPaused === true){
        boutonPause.classList.replace("fa-circle-pause", "fa-circle-play")
    }
    else {
        boutonPause.classList.replace("fa-circle-play", "fa-circle-pause")
    }
}
function autoDefil() {
    if (isPaused === false){
        changeSlide(1)
    }
}
function changeSlide(sens) {
    numero = numero + sens;
    if (numero < 0) {
        numero = slide.length -1;
    }
    if (numero > slide.length -1) {
        numero = 0;
    }
    document.getElementById("slide").src = slide[numero];
}
// Choose a city in the list box
function switchCity() {
    log('Switching to ' + cityselect.value);
    thecity.setPosition(cityselect.value);
    formstatus.bikesavailable = false;
    resabutton.disabled = checkallinputs;
}
// ----------------------------------------------- 
function log(message) {
    console.log(version + message);
}

