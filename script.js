/*
    script.js

    Feb 26 2022   Initial
    Mar 02 2022   Work on lat / long coordinates when creating the map
    Mar 03 2022   Include Toggle Pause code from main branch

*/
import map from './classes/map.js'
// -----------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------
const slide = ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"];
let numero = 0;
let isPaused = false
let interval = setInterval(autoDefil, 5000);


let boutonPause = document.getElementById("pause_button");
boutonPause.addEventListener('click', togglePause)
document.getElementById("previous").addEventListener('click', () => changeSlide(-1))
document.getElementById("next").addEventListener('click', () => changeSlide(1))
let cityselect = document.getElementById("cityselect");
cityselect.addEventListener('change', () => switchCity())

// Load the list box with supported cities
let themap = new map();
let allcities =themap.getCities();
for(let i = 0; i < allcities.length; i++) {
    let option = document.createElement('option');
    option.value = option.innerHTML = allcities[i].name;
    cityselect.appendChild(option);
}
themap.createMap(allcities[0].name);
// -----------------------------------------------------------------
// Handling functions
// -----------------------------------------------------------------
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
function switchCity() {
    themap.switchMap(cityselect.value);
}


