console.log ("coucou");

const slide = ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"];
let numero = 0;

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

let isPaused = false

document.getElementById("pause_button").addEventListener('click', togglePause)
document.getElementById("previous").addEventListener('click', () => changeSlide(-1))
document.getElementById("next").addEventListener('click', () => changeSlide(1))

/*bouton play : <i class="fa-regular fa-circle-play"></i>*/

function togglePause() {
    isPaused = !isPaused
}

function autoDefil() {
    if (isPaused === false){
        changeSlide(1)
    }
}

setInterval(autoDefil, 5000);