import { DISPLAY_HEIGHT, DISPLAY_WIDTH, DISPLAY_SCALING, BG_COLOR, COLOR } from "./constants/displayConstants";
import { CHAR_SET_WIDTH } from "./constants/charSetConstants";
export class Display {
    constructor(memory) {
        console.log('Construct a new Display object');
        this.memory = memory;
        this.screen = document.querySelector('canvas');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_SCALING;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_SCALING;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.context.fillStyle = BG_COLOR; // black
        this.frameBuffer = [];
        this.reset();
    }

    reset() {
        let loops = 0;
        for (let i = 0; i < DISPLAY_HEIGHT; i++) {
            loops++;
            this.frameBuffer.push([]); // creates [i] as an array, 2D array
            for (let j = 0; j < DISPLAY_WIDTH; j++) {
                loops++;
                //this.frameBuffer[i].push((loops & 1 == 1) ? 1 : 0); // buf[i][j] = 0
                this.frameBuffer[i].push(0);
            }
        }
        this.context.fillRect(0, 0, this.screen.width, this.screen.height);
        this.drawBuffer();
        console.log('reset display');
    }

    drawBuffer() {
        console.log('drawBuffer()');
        for (let i = 0; i < DISPLAY_HEIGHT; i++) {
            this.frameBuffer.push([]); // creates [i] as an array, 2D array
            for (let j = 0; j < DISPLAY_WIDTH; j++) {
                this.drawPixel(i, j, this.frameBuffer[i][j]); // (y, x)
            }
        }        
    }

    drawPixel(y, x, value) {
        this.context.fillStyle = value ? COLOR : BG_COLOR;
        this.context.fillRect(
            x*DISPLAY_SCALING,
            y*DISPLAY_SCALING,
            DISPLAY_SCALING,
            DISPLAY_SCALING);
    }

    drawSprite(y, x, spriteAddress, spriteRows) {
        let pixelCollision = 0;
        for (let row_offset = 0; row_offset < spriteRows; row_offset++) {
          const sprite_row = this.memory.memory[spriteAddress + row_offset];
          for (let col_offset = 0; col_offset < CHAR_SET_WIDTH; col_offset++) {
            const bitmask = 0b10000000 >> col_offset;  // left to right, vs R to L
            const this_sprite_bit = (sprite_row & bitmask) ? 1 : 0;
            if (this_sprite_bit === 1) { // if zero => no change, X^0 = X, no collision
                const this_row = (y + row_offset) % DISPLAY_HEIGHT;
                const this_col = (x + col_offset) % DISPLAY_WIDTH;
                if (pixelCollision === 0 && (this.frameBuffer[this_row][this_col] === 1 && this_sprite_bit === 1)) {
                    pixelCollision = 1;
                }
                this.frameBuffer[this_row][this_col] ^= this_sprite_bit;
            }
          }
        }
        this.drawBuffer();
        return pixelCollision;
    }
}