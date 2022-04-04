/*
    sign.js

    Apr 01 2022   Initial
    Apr 02 2022   Cleanup unused vars. And maybe some strange code
    Apr 03 2022   Bring back pixels array. Could be useful to compute some signature characteristics
    Apr 04 2022   Continue CANVAS code analysis

*/

export default class sign {

    version = "sign.js 1.10, Apr 04 2022 : "

    constructor() {
        this.signparent = document.getElementById("sign");
        this.canvas;            // Signature zone
        this.context;           // The canvas context. Accessed by multiple handlers
        this.pixels = [];
        this.xyLast = {};

        this.#setFramework();
    }

    // Dynamically build the interface
    #setFramework() {
        // HTML setup
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
        this.canvas.width = "300";      // Sign area size, check it in style.css
        this.canvas.height = "200";
        // CANVAS setup
        this.context = this.canvas.getContext("2d");                // Work 2D
        if (!this.context) {
            throw new Error("Failed to get canvas' 2d context");    // Lack of browser support
        }
        // Fill background
        this.context.fillStyle = "cyan";                                        // cyan background
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);     // Fill area
        // Draw a line at the bottom of the sign area
        this.context.strokeStyle = "blue";                                  
        this.context.lineCap = "round";     // End of the line will be surrounded
        this.context.lineWidth = 1;         // Pen width
        this.context.moveTo((this.canvas.width * 0.05), (this.canvas.height * 0.9));
        this.context.lineTo((this.canvas.width * 0.95), (this.canvas.height * 0.9));
        this.context.stroke();              // Draw the prepared shape
        //  Test quadratic
        this.testBezierCurve();
        // Clear the points array in case it's already been used
        this.pixels = [];
        // Register starting events, either with the mouse or with a finger touch
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

        // Get the points where the mouse click occurred
        let xy = this.get_board_coords(e);
        this.context.beginPath();           // Create a new path
        this.pixels.push('moveStart');      // Store a begin sign marker
        this.context.moveTo(xy.x, xy.y);
        this.pixels.push(xy.x, xy.y);       // Store points for optional later use
        this.xyLast = xy;                   // Memorize the current points into the latest known position
    }
    // ------------------------------------------------------------------------
    on_mousemove = e => {
        e.preventDefault();
        e.stopPropagation();

        let xy = this.get_board_coords(e);
        // Prepare to draw a Bézier curve
        // 1st compute the end point coordinates of the curve
        let xyAdd = {
            x : (this.xyLast.x + xy.x) / 2,
            y : (this.xyLast.y + xy.y) / 2
        };
        // Bezier curve added to the current subpath and then drawn
        this.context.quadraticCurveTo(this.xyLast.x, this.xyLast.y, xyAdd.x, xyAdd.y);
        this.pixels.push(xyAdd.x, xyAdd.y);     // Store points for optional later use
        this.context.stroke();                  // Draw the curve
                                                // Then we reset the path to draw the next section of the curve
        this.context.beginPath();               
        this.context.moveTo(xyAdd.x, xyAdd.y);  // Prepare next draw by moving our pen to the current position
        this.xyLast = xy;                       // Memorize the current points into the latest known position

    }
    // ------------------------------------------------------------------------
    on_mouseup = e => {
        this.remove_event_listeners();
        this.context.stroke();                  // Draw final points
        this.pixels.push('moveEnd');                  // Mark the end of our signature section
                                                // Most probably the user will draw new curves
        this.log(`collected ${this.pixels.length} signature points`);
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
    // Look at https://www.youtube.com/watch?v=Ccxd6qzqFms for Bézier curves
    // and also https://www.imo.universite-paris-saclay.fr/~perrin/CAPES/geometrie/BezierDP.pdf
    // ----------------------------------------------- 
    testBezierCurve() {
        //  Test quadratic
        this.context.beginPath();
        this.context.moveTo(60, 20);
                    // ( controlpointX, controlpointY, endpointX, endpointY )
        this.context.quadraticCurveTo(300, 60, 60, 100);
        this.context.stroke();
    }
    // ----------------------------------------------- 
    log(message) {
        console.log(this.version + message);
    }

}