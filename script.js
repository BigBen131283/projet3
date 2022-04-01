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
                Reorg display action so that they all take place in script.js
    Mar 18 2022 Book / debook 
    Mar 20 2022 Book / debook, change screen mockup
    Mar 31 2022 Fix the null problem in reservation window when changing city
    Apr 01 2022 Memorize name of user when a reservation is done, and get it back 
                when the browser is reopened
                Start work on canvas signature

*/
import city from './classes/city.js'
import users from './classes/users.js';
import sign from './classes/sign.js';
import { getDateTime, getDate, getTime } from './utilities/datetime.js'

const version = "script.js 1.61, Apr 01 2022 : "

// -----------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------
const slide = ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"];
let persistentstorage = localStorage;
let numero = 0;
let isPaused = false
// Get some objects and activate them
let thecity = new city();
let allcities =thecity.getCities();     // Get managed cities list
let theusers = new users();             // Used to manage users and their actions
let activeuser = theusers.searchUser(); // A single identified user
let signature = new sign();


let formstatus = {                      // Used to manage the resa button status
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
let resabutton = document.getElementById("resa");
let address = document.getElementById("address");
let allplaces = document.getElementById("all_places");
let remainplaces = document.getElementById("remain_places");
let remainbikes = document.getElementById("remain_bikes");
let cardid = document.getElementById("cardid");
let lastname = document.getElementById("last_name");
let firstname = document.getElementById("first_name");
let mail = document.getElementById("mail");
let mobile = document.getElementById("mobile");
let resastation = document.getElementById("resastation");
let resaclient = document.getElementById("resauser");
let resatime = document.getElementById("resatime");
let resaexptime = document.getElementById("resaexp");
let resaexpirationdelay = 10; // Seconds
let resasessiontimeremaining;
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
resabutton.addEventListener('click', () => BookDebookBike('userclick'));
resabutton.disabled = checkallinputs;
// Load the list box with supported cities
for(let i = 0; i < allcities.length; i++) {
    let option = document.createElement('option');
    option.value = option.innerHTML = allcities[i].name;
    cityselect.appendChild(option);
}
// For the automatic slider movement
setInterval(autoDefil, 5000);
// Check any previous user session in local storage
let usersessionlname = persistentstorage.getItem("userlname");
let usersessionfname = persistentstorage.getItem("userfname");
if (usersessionfname) {
    lastname.value = usersessionlname;
    firstname.value = usersessionfname;
    let keepmysession = confirm(`Hello ${usersessionfname}, want to get your previous session ? `);
    if(!keepmysession) {
        persistentstorage.clear();
        lastname.value = firstname.value = '';
    }
}

// ---------------------------------------------------------------------------------
//     M A I N   P A G E  E V E N T   H A N D L E R   F O R   D I S P L A Y
//
// Install a window event handler used to synchronize the page content 
// after inner classes state modifications.
// event.data carries an object used to identify the class emiter and 
// the data it wants to communicate, most often a stations object
// but can be anything
// ---------------------------------------------------------------------------------
window.addEventListener('message', (event) => {
    switch( event.data.origin ) {
        case 'MAPJS-BOOK':
        case 'MAPJS-DEBOOK':
            formstatus.bikesavailable = event.data.stationobject.available_bikes === 0 ?
                         false : true;     // Update station bike status
            resabutton.disabled = checkallinputs();
            break;
        case 'MAPJS-SELECTSTATION': // Receives a station object
            address.innerText = (event.data.stationobject.address === "" ? 
                        event.data.stationobject.name :
                        event.data.stationobject.address);
            allplaces.innerText = event.data.stationobject.bike_stands;
            remainplaces.innerText = event.data.stationobject.available_bike_stands;
            remainbikes.innerText = event.data.stationobject.available_bikes;
            formstatus.bikesavailable = event.data.stationobject.available_bikes === 0 ?
                         false : true;     // Update station bike status
            resabutton.disabled = checkallinputs();
            break;
        case 'MAPJS-CHANGECITY': 
            address.innerText = "";
            allplaces.innerText = "";
            remainplaces.innerText = ""; 
            remainbikes.innerText = "";
            formstatus.bikesavailable = false;
            if(activeuser.found) BookDebookBike('citychange');
            resabutton.disabled = checkallinputs();
            resastation.innerText = resaclient.innerText =  resatime.innerText = "";
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
    activeuser.activeresa = false;
    // The activeuser.found flag indicates the cardid has a match in userlist.json
    lastname.value = activeuser.lname;
    firstname.value = activeuser.fname;
    mobile.value = activeuser.mobile;
    mail.value = activeuser.mail;
    cardid.value = cardid.value.toUpperCase();
    if(activeuser.found) {
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
    manageUserObject();
    resabutton.disabled = checkallinputs();
}
function firstnameinput() {
    if(firstname.value.length === 0) 
        { formstatus.firstname  = false; }
    else { formstatus.firstname = true;}
    manageUserObject();
    resabutton.disabled = checkallinputs();
}
// Have to create, delete or modify user object 
// depending of the manually entered fields status. 
function manageUserObject() {
    cardid.value = mobile.value = mail.value = ""   // Manually enter a firstname so clear cardid
                                                    // related fields
    if(formstatus.firstname && formstatus.lastname) {
        activeuser = theusers.searchUser("");   // Perform a dummy search
        activeuser.fname = firstname.value;
        activeuser.lname = lastname.value;
        activeuser.found = true;
    }
}
// Resa  handler
// It is assumed that when coming here all controls are done
// 1 / Bikes are available
// 2 - User lname and fname are both ok
function BookDebookBike(action) {
    switch(action) {
        case 'userclick':
            if(activeuser.activeresa) { 
                // Debook and then rebook. The user clicked the resa button but already have 
                // a reserved bikeSo free the previously reserved bike and book the new one.
                // It can be in the same station or another one. 
                remainbikes.innerText = activeuser.reservation.station.available_bikes + 1;
                thecity.DebookBike(activeuser.reservation.station);
                thecity.BookBike();
                bookUpdate();
            }
            else {
                // Book. 1st resa by user, normal situation
                thecity.BookBike();
                bookUpdate();
            }
            resasessiontimeremaining = resaexpirationdelay;
            resatimer = setInterval(resaExpirationCheck, 1000);
            persistentstorage.setItem('userfname', activeuser.fname);
            persistentstorage.setItem('userlname', activeuser.lname);
            break;
        case 'citychange':
            if(activeuser.activeresa) {
                // Free the reserved bike before switching to the new city
                remainbikes.innerText = '';
                thecity.DebookBike(activeuser.reservation.station);
                activeuser.activeresa = false;
                activeuser.reservation = {
                    "station": {},  
                    "resatime": getDateTime()
                };
                clearInterval(resatimer);   // Stop the timer 
            }
            break;
        case 'timer':
            // Free the reserved bike before switching to the new city
            remainbikes.innerText = activeuser.reservation.station.available_bikes + 1;
            thecity.DebookBike(activeuser.reservation.station);
            activeuser.activeresa = false;
            activeuser.reservation = {
                "station": {},  
                "resatime": getDateTime()
            };
            resastation.innerText = resaclient.innerText =  resatime.innerText = "";
            break;

    }
}
// Just to share code in BookDebookBike()
function bookUpdate() {
    activeuser.activeresa = true;
    activeuser.reservation = {
        "station": thecity.getSelectedStation(),    
        "resatime": getDateTime()
    };
    resastation.innerText = activeuser.reservation.station.name;
    resaclient.innerText = activeuser.fname +  activeuser.lname;
    resatime.innerText = activeuser.reservation.resatime;
    remainbikes.innerText = activeuser.reservation.station.available_bikes;
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
    thecity.setPosition(cityselect.value);
    formstatus.bikesavailable = false;
    resabutton.disabled = checkallinputs;
}
// ----------------------------------------------- 
function resaExpirationCheck() {
    resasessiontimeremaining--;
    resaexptime.innerText = secondsToString(resasessiontimeremaining);
    log(resasessiontimeremaining)
    if( resasessiontimeremaining === 0) {
        resaexptime.innerText = '';
        clearInterval(resatimer);
        BookDebookBike('timer');
    }
}
// ----------------------------------------------- 
function secondsToString(seconds) {
    let numdays = Math.floor(seconds / 86400);
    let numhours = Math.floor((seconds % 86400) / 3600);
    let numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    let numseconds = ((seconds % 86400) % 3600) % 60;
    return numminutes + " min " + numseconds + "s";
}
// ----------------------------------------------- 
function log(message) {
    console.log(version + message);
}
