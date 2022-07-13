import { DISPLAY_HEIGHT, DISPLAY_WIDTH, DISPLAY_SCALING, BG_COLOR, COLOR } from "./constants/displayConstants";
import { CHAR_SET_WIDTH } from "./constants/charSetConstants";

const blankBuffer = () => Array(DISPLAY_HEIGHT).fill([]).map(row => Array(DISPLAY_WIDTH).fill(0));

export class Display {
    constructor(memory) {
        console.log('Construct a new Display object');
        this.memory = memory;
        this.screen = document.querySelector('canvas');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_SCALING;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_SCALING;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.clear();
        this.draw();
    }

	clear() { this.frameBuffer = blankBuffer(); }

	draw() {
		this.frameBuffer.forEach((row, y) =>
			row.forEach((pic, x) => {
				this.context.fillStyle = pic ? COLOR : BG_COLOR;
				this.context.fillRect(x * DISPLAY_SCALING, y * DISPLAY_SCALING, DISPLAY_SCALING, DISPLAY_SCALING);
			}));
	}

    drawSprite(x, y, spriteAddress, spriteRows) {
        // Output: frameBuffer update, drawBuffer(), collision flag returned
        let collision = 0;
        // NOTE: row is y position, not x, first dimension in frameBuffer is y, not x
        for (let row = 0; row < spriteRows; row++) {
          const sprite_row = this.memory.memory[spriteAddress + row];
          let bitmask = 0b10000000;
          for (let col = 0; col < CHAR_SET_WIDTH; col++, bitmask >>= 1) {
            const sprite_bit = (sprite_row & bitmask) ? 1 : 0;
            if (sprite_bit === 1) { // if zero => no change, X^0 = X, no collision
                const this_row = (y + row) < DISPLAY_HEIGHT ? (y + row) : (y + row) % DISPLAY_HEIGHT;
                const this_col = (x + col) <  DISPLAY_WIDTH ? (x + col) : (x + col) % DISPLAY_WIDTH;
                if (this.frameBuffer[this_row][this_col] && sprite_bit) {
                     collision = 1;
                }
                this.frameBuffer[this_row][this_col] ^= sprite_bit;
            }
          }
        }
        this.drawBuffer();
        return collision;
    }
}