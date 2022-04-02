/*
    sign.js

    Apr 01 2022   Initial

*/

export default class sign {

    version = "sign.js 1.05, Apr 01 2022 : "

    constructor() {
        this.signparent = document.getElementById("sign");
        this.canvas;            // Signature zone
        this.context;           // The canvas context. Accessed by multiple handlers
        this.disableSave = true;
        this.pixels = [];
        this.cpixels = [];
        this.xyLast = {};
        this.xyAddLast = {};
        this.calculate = false;

        this.#setFramework();
    }

    // Dynamically build the interface
    #setFramework() {
        let canvasArea = document.createElement("canvas");
        canvasArea.setAttribute("id", "newSignature");
        let para = document.createElement("p");
        para.innerText = "Signature";
        let clearbutton = document.createElement("button");
        clearbutton.innerText = "Clear";
        clearbutton.addEventListener('click', this.clear);
        this.signparent.appendChild(para);
        this.signparent.appendChild(canvasArea);
        this.signparent.appendChild(clearbutton);

        this.canvas = document.getElementById("newSignature");
        this.context = this.canvas.getContext("2d");
        if (!this.context) {
            throw new Error("Failed to get canvas' 2d context");
        }
        this.context.fillStyle = "#fff";
        this.context.strokeStyle = "#444";
        this.context.lineWidth = 1.2;
        this.context.lineCap = "round";

        this.context.fillStyle = "#fff";
        this.context.strokeStyle = "#444";
        this.context.lineWidth = 1.2;
        this.context.lineCap = "round";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#3a87ad";
        this.context.strokeStyle = "#3a87ad";
        this.context.lineWidth = 1;
        this.context.moveTo((this.canvas.width * 0.042), (this.canvas.height * 0.7));
        this.context.lineTo((this.canvas.width * 0.958), (this.canvas.height * 0.7));
        this.context.stroke();
        this.context.fillStyle = "#fff";
        this.context.strokeStyle = "#444";
        // Register starting events
        this.canvas.addEventListener('mousedown', this.on_mousedown, false);
        this.canvas.addEventListener('touchstart', this.on_mousedown, false);

    }
    // ------------------------------------------------------------------------
    // Handler functions are declared like that to get an access to this
    // pointing on the class instance
    // ------------------------------------------------------------------------
    on_mousedown = e => {
        e.preventDefault();     // Disable default action
        e.stopPropagation();    // Do not propagate the event
                                // Register movement events
        this.canvas.addEventListener('mousemove', this.on_mousemove, false);
        this.canvas.addEventListener('mouseup', this.on_mouseup, false);
        this.canvas.addEventListener('touchmove', this.on_mousemove, false);
        this.canvas.addEventListener('touchend', this.on_mouseup, false);

        document.body.addEventListener('mouseup', this.on_mouseup, false);
        document.body.addEventListener('touchend', this.on_mouseup, false);

        // Get the points where the mouse click occurred
        let xy = this.get_board_coords(e);
        this.context.beginPath();
        this.pixels.push('moveStart');
        this.context.moveTo(xy.x, xy.y);
        this.pixels.push(xy.x, xy.y);
        this.xyLast = xy;
    }
    // ------------------------------------------------------------------------
    on_mousemove = e => {
        e.preventDefault();
        e.stopPropagation();

        let xy = this.get_board_coords(e);
        let xyAdd = {
            x : (this.xyLast.x + xy.x) / 2,
            y : (this.xyLast.y + xy.y) / 2
        };

        if (this.calculate) {
            let xLast = (this.xyAddLast.x + this.xyLast.x + xyAdd.x) / 3;
            let yLast = (this.xyAddLast.y + this.xyLast.y + xyAdd.y) / 3;
            this.pixels.push(xLast, yLast);
        } else {
            this.calculate = true;
        }

        this.context.quadraticCurveTo(this.xyLast.x, this.xyLast.y, xyAdd.x, xyAdd.y);
        this.pixels.push(xyAdd.x, xyAdd.y);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(xyAdd.x, xyAdd.y);
        this.xyAddLast = xyAdd;
        this.xyLast = xy;

    }
    // ------------------------------------------------------------------------
    on_mouseup = e => {
        this.remove_event_listeners();
        this.disableSave = false;
        this.context.stroke();
        this.pixels.push('e');
        this.calculate = false;
    }

    // ------------------------------------------------------------------------
    // Utilities
    // ------------------------------------------------------------------------
    clear = () => {
        this.signparent.removeChild(this.canvas);
        this.#setFramework();
    }
    // ------------------------------------------------------------------------
    // Track mouse coordinates for start move end events    
    // ------------------------------------------------------------------------
    get_board_coords(e) {
        let x, y;

        if (e.changedTouches && e.changedTouches[0]) {
            var offsety = canvas.offsetTop || 0;
            var offsetx = canvas.offsetLeft || 0;

            x = e.changedTouches[0].pageX - offsetx;
            y = e.changedTouches[0].pageY - offsety;
        } else if (e.layerX || 0 == e.layerX) {
            x = e.layerX;
            y = e.layerY;
        } else if (e.offsetX || 0 == e.offsetX) {
            x = e.offsetX;
            y = e.offsetY;
        }

        return {
            x : x,
            y : y
        };
    }
    // ------------------------------------------------------------------------
    remove_event_listeners() {
        this.canvas.removeEventListener('mousemove', this.on_mousemove, false);
        this.canvas.removeEventListener('mouseup', this.on_mouseup, false);
        this.canvas.removeEventListener('touchmove', this.on_mousemove, false);
        this.canvas.removeEventListener('touchend', this.on_mouseup, false);

        document.body.removeEventListener('mouseup', this.on_mouseup, false);
        document.body.removeEventListener('touchend', this.on_mouseup, false);
    }    
    // ----------------------------------------------- 
    log(message) {
        console.log(this.version + message);
    }

}