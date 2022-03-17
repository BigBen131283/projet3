/*
    script.js

    Feb 26 2022 Initial
    Mar 02 2022 Work on lat / long coordinates when creating the map
    Mar 03 2022 Include Toggle Pause code from main branch
                Start work on API calls to JCDECAUX
    Mar 05 2022 Now start work on stations positionning to the selected map
    Mar 13 2022 Handle click on RESA button
    Mar 15 2022 Start work on user / password
    Mar 16 2022 Work on cardid, bike resa...
    Mar 17 2022 Work on cardid, bike resa...

*/
import city from './classes/city.js'
import users from './classes/users.js';

const version = "script.js 1.46 Mar 17 2022 : "

// -----------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------
const slide = ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"];
let numero = 0;
let isPaused = false
let thecity = new city();
let allcities =thecity.getCities();      // Get managed cities list
let activeuser = {};
let theusers = new users();              // Used to manage users
let formstatus = {                       // Used to manage the resa button status
    firstname: false,
    lastname: false,
    bikesavailable: false
}
let checkallinputs = () => { console.log(formstatus);
                            return ! (formstatus.firstname 
                                && formstatus.lastname 
                                && formstatus.bikesavailable); 
                        }

// Retrieve usefull DOM elements handlers
let boutonPause = document.getElementById("pause_button");
let cityselect = document.getElementById("cityselect");
let lastname = document.getElementById("last_name");
let firstname = document.getElementById("first_name");
let resabutton = document.getElementById("resa");
let cardid = document.getElementById("cardID");
let mobile = document.getElementById("mobile");
let mail = document.getElementById("mail");
let resastation = document.getElementById("station");
let resaclient = document.getElementById("client");
let resatime = document.getElementById("resatime");
let resatimer = document.getElementById("timer");
// Add necessary event handlers
boutonPause.addEventListener('click', togglePause);
document.getElementById("previous").addEventListener('click', () => changeSlide(-1));
document.getElementById("next").addEventListener('click', () => changeSlide(1));
// Change city listener
cityselect.addEventListener('change', () => switchCity());       
// Manage card ID input
cardid.addEventListener('keyup', () => delay(cardidinput));
// Manage user name and password inputs
lastname.addEventListener('keyup', () => delay(lastnameinput));
firstname.addEventListener('keyup', () => delay(firstnameinput));
// Reservation button monitor
resabutton.addEventListener('click', () => BookDebookBike());
resabutton.disabled = checkallinputs;

// Load the list box with supported cities
for(let i = 0; i < allcities.length; i++) {
    let option = document.createElement('option');
    option.value = option.innerHTML = allcities[i].name;
    cityselect.appendChild(option);
}
// For the automatic slider movement
setInterval(autoDefil, 5000);
// Install a window event handler used to synchronize the page content 
// after inner classes state modifications.
// event.data carries an object used to identify the class emiter and 
// the data it wants to communicate
window.addEventListener('message', (event) => {
    switch( event.data.origin ) {
        case 'MAPJS-BOOKDEBOOK': 
            formstatus.bikesavailable = event.data.stationobject.available_bikes === 0 ? false : true;     // Receives the whole station object
            resabutton.disabled = checkallinputs();
            break;
        case 'MAPJS-UPDATEUI': 
            formstatus.bikesavailable = event.data.availablebikes === 0 ? false : true;     // Receives station bike status
            resabutton.disabled = checkallinputs();
            break;
        case 'MAPJS-DISPLAY': 
            formstatus.bikesavailable = event.data.stationobject.available_bikes === 0 ? false : true;     // Receives station bike status
            resabutton.disabled = checkallinputs();
            break;
    }           
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
// CardID input handler
function cardidinput() {
    activeuser = theusers.searchUser(cardid.value.toUpperCase());
    lastname.value = activeuser.lname;
    firstname.value = activeuser.fname;
    mobile.value = activeuser.mobile;
    mail.value = activeuser.mail;
    cardid.value = cardid.value.toUpperCase();
    if(activeuser.status) {
        formstatus.lastname = formstatus.firstname = true;
    }
    else {
        formstatus.lastname = formstatus.firstname = false;
    }
    resabutton.disabled = checkallinputs();
}
// User input handlers
function lastnameinput() {
    if(lastname.value.length === 0) 
        { formstatus.lastname = false; }
    else { formstatus.lastname = true;}
    resabutton.disabled = checkallinputs();
}
function firstnameinput() {
    if(firstname.value.length === 0) 
        { formstatus.firstname  = false; }
    else { formstatus.firstname = true;}
    resabutton.disabled = checkallinputs();
}
// Resa  handler
// It is assumed than when coming here all controls are done
function BookDebookBike() {
    if(activeuser.activeresa) { 
        thecity.BookDebookBike(true);           // Book
        resabutton.innerText = "Libérer";
        activeuser.activeresa = true;
        activeuser.reservation = {
            "station": thecity.getSelectedStation(),    
            "resatime": new Date()
        };
        resastation.innerText = `${activeuser.reservation.station.name}`;
        resaclient.innerText = `${activeuser.fname} ${activeuser.lname}`;
        resatime.innerText = `${activeuser.reservation.resatime}`
    }
    else {
        thecity.BookDebookBike(false);          // Debook
        resabutton.innerText = "Réserver";
        activeuser.activeresa = false;
        activeuser.reservation = {  };
        resastation.innerText = resaclient.innerText =  resatime.innerText = "";
    }
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

