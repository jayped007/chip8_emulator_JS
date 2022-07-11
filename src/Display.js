import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./constants/displayConstants";
export class Display {
    constructor() {
        console.log('Construct a new Display object');
        this.screen = document.querySelector('canvas');
        this.screen.width = DISPLAY_WIDTH;
        this.screen.height = DISPLAY_HEIGHT;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.context.fillStyle = "#000"; // black
        this.context.fillRect(0, 0, this.screen.width, this.screen.height)

    }
}