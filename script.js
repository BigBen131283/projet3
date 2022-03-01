
const slider = {
     slide: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
     desc: ["tome1", "tome2", "tome3"],
     comment: ["description du tome1", "description du tome2", "description du tome3" ]
}

let numero = 0;
let isPaused = false
let boutonPause = document.getElementById("pause_button")
let p = document.getElementById("description")
p.innerHTML = slider.desc[0];

function changeSlide(sens) {
    numero = numero + sens;
    if (numero < 0) {
        numero = slider.slide.length -1;
    }
    if (numero > slider.slide.length -1) {
        numero = 0;
    }
    document.getElementById("slide").src = slider.slide[numero];
    document.getElementById("description").innerHTML = slider.desc[numero];
}


document.getElementById("pause_button").addEventListener('click', togglePause)
document.getElementById("previous").addEventListener('click', () => changeSlide(-1))
document.getElementById("next").addEventListener('click', () => changeSlide(1))

/*bouton play :  class="fa-circle-play"  */
/*bouton pause : class="fa-circle-pause" */


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

setInterval(autoDefil, 5000);