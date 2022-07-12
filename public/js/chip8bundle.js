/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Chip8": () => (/* binding */ Chip8)
/* harmony export */ });
/* harmony import */ var _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _constants_registerConstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _Display__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony import */ var _Memory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
/* harmony import */ var _Registers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(10);









class Chip8 {
    // Chip8 emulation class
    constructor() {
        console.log('Construct new Chip-8 emulator object');
        this.memory = new _Memory__WEBPACK_IMPORTED_MODULE_5__.Memory();
        this.registers = new _Registers__WEBPACK_IMPORTED_MODULE_6__.Registers();
        this.keyboard = new _Keyboard__WEBPACK_IMPORTED_MODULE_4__.Keyboard();
        this.loadCharSet();
        this.display = new _Display__WEBPACK_IMPORTED_MODULE_3__.Display(this.memory);
    }

    sleep(ms = _constants_registerConstants__WEBPACK_IMPORTED_MODULE_2__.TIMER_60_HZ) { // is not itself async but returns a Promise?
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    loadCharSet() {
        this.memory.memory.set(_constants_charSetConstants__WEBPACK_IMPORTED_MODULE_0__.CHAR_SET, _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_1__.CHAR_SET_ADDRESS);
    }

}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHAR_SET": () => (/* binding */ CHAR_SET),
/* harmony export */   "CHAR_SET_WIDTH": () => (/* binding */ CHAR_SET_WIDTH)
/* harmony export */ });
const CHAR_SET_WIDTH = 8;
const CHAR_SET = [
    0xf0, 0x90, 0x90, 0x90, 0xf0,
    0x20, 0x60, 0x20, 0x20, 0x70,
    0xf0, 0x10, 0xf0, 0x80, 0xf0,
    0xf0, 0x10, 0xf0, 0x10, 0xf0,
    0x90, 0x90, 0xf0, 0x10, 0x10,
    0xf0, 0x80, 0xf0, 0x10, 0xf0,
    0xf0, 0x80, 0xf0, 0x90, 0xf0,
    0xf0, 0x10, 0x20, 0x40, 0x40,
    0xf0, 0x90, 0xf0, 0x90, 0xf0,
    0xf0, 0x90, 0xf0, 0x10, 0xf0,
    0xf0, 0x90, 0xf0, 0x90, 0x90,
    0xe0, 0x90, 0xe0, 0x90, 0xe0,
    0xf0, 0x80, 0x80, 0x80, 0xf0,
    0xe0, 0x90, 0x90, 0x90, 0xe0,
    0xf0, 0x80, 0xf0, 0x80, 0xf0, 
    0xf0, 0x80, 0xf0, 0x80, 0x80,
];


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHAR_SET_ADDRESS": () => (/* binding */ CHAR_SET_ADDRESS),
/* harmony export */   "LOAD_PROGRAM_ADDRESS": () => (/* binding */ LOAD_PROGRAM_ADDRESS),
/* harmony export */   "MEMORY_SIZE": () => (/* binding */ MEMORY_SIZE)
/* harmony export */ });
const MEMORY_SIZE = 4096;
const LOAD_PROGRAM_ADDRESS = 0x200;
const CHAR_SET_ADDRESS = 0x000;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NUMBER_OF_REGISTERS": () => (/* binding */ NUMBER_OF_REGISTERS),
/* harmony export */   "STACK_SIZE": () => (/* binding */ STACK_SIZE),
/* harmony export */   "TIMER_60_HZ": () => (/* binding */ TIMER_60_HZ)
/* harmony export */ });
const NUMBER_OF_REGISTERS = 16;
const STACK_SIZE = 16;
const TIMER_60_HZ = 1000 / 60;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Display": () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


class Display {
    constructor(memory) {
        console.log('Construct a new Display object');
        this.memory = memory;
        this.screen = document.querySelector('canvas');
        this.screen.width = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING;
        this.screen.height = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.context.fillStyle = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.BG_COLOR; // black
        this.frameBuffer = [];
        this.reset();
    }

    reset() {
        let loops = 0;
        for (let i = 0; i < _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT; i++) {
            loops++;
            this.frameBuffer.push([]); // creates [i] as an array, 2D array
            for (let j = 0; j < _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH; j++) {
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
        for (let i = 0; i < _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT; i++) {
            this.frameBuffer.push([]); // creates [i] as an array, 2D array
            for (let j = 0; j < _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH; j++) {
                this.drawPixel(i, j, this.frameBuffer[i][j]); // (y, x)
            }
        }        
    }

    drawPixel(y, x, value) {
        this.context.fillStyle = value ? _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.COLOR : _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.BG_COLOR;
        this.context.fillRect(
            x*_constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING,
            y*_constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING,
            _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING,
            _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING);
    }

    drawSprite(y, x, spriteAddress, spriteRows) {
        let pixelCollision = 0;
        for (let row_offset = 0; row_offset < spriteRows; row_offset++) {
          const sprite_row = this.memory.memory[spriteAddress + row_offset];
          for (let col_offset = 0; col_offset < _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_1__.CHAR_SET_WIDTH; col_offset++) {
            const bitmask = 0b10000000 >> col_offset;  // left to right, vs R to L
            const this_sprite_bit = (sprite_row & bitmask) ? 1 : 0;
            if (this_sprite_bit === 1) { // if zero => no change, X^0 = X, no collision
                const this_row = (y + row_offset) % _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT;
                const this_col = (x + col_offset) % _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH;
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

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BG_COLOR": () => (/* binding */ BG_COLOR),
/* harmony export */   "COLOR": () => (/* binding */ COLOR),
/* harmony export */   "DISPLAY_HEIGHT": () => (/* binding */ DISPLAY_HEIGHT),
/* harmony export */   "DISPLAY_SCALING": () => (/* binding */ DISPLAY_SCALING),
/* harmony export */   "DISPLAY_WIDTH": () => (/* binding */ DISPLAY_WIDTH)
/* harmony export */ });
const DISPLAY_WIDTH = 64; // Chip8 window width - per Chip8 spec
const DISPLAY_HEIGHT = 32; // Chip8 window height
const DISPLAY_SCALING = 10; // scale Chip8 screen to browser window resolution
const BG_COLOR = "#000"; // black
const COLOR = "#3F6"; // ??

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keyboard": () => (/* binding */ Keyboard)
/* harmony export */ });
/* harmony import */ var _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);


class Keyboard {
  constructor() {
    this.keys = new Array(_constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__.NUMBER_OF_KEYS).fill(false);
    // NOTE: event handler defined inline with event listeners below
    document.addEventListener('keydown', (event) => this.keydown(event.key));
    document.addEventListener('keyup', (event) => this.keyup(event.key));
  }

  keydown(key) {
    const keyIndex = _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__.keyMap.findIndex((mapKey) => mapKey === key.toLowerCase());
    if (keyIndex > -1) {
      this.keys[keyIndex] = true;
    }
  }

  keyup(key) {
    const keyIndex = _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__.keyMap.findIndex((mapKey) => mapKey === key.toLowerCase());
    if (keyIndex > -1) {
      this.keys[keyIndex] = false;
      console.log(`Pressed ${key} mapped to ${keyIndex}.`)
    }
  }

  isKeydown(keyIndex) {
    return this.keys[keyIndex];
  }

  hasKeydown() {
    return this.keys.findIndex((key) => key);
  }
}

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NUMBER_OF_KEYS": () => (/* binding */ NUMBER_OF_KEYS),
/* harmony export */   "keyMap": () => (/* binding */ keyMap)
/* harmony export */ });
const NUMBER_OF_KEYS = 16;
const keyMap = [
  '1',
  '2',
  '3',
  'q',
  'w',
  'e',
  'a',
  's',
  'd',
  'z',
  'x',
  'c',
  '4',
  'r',
  'f',
  'v',
];


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Memory": () => (/* binding */ Memory)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


class Memory {
    constructor() {
        this.memory = new Uint8Array(_constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.MEMORY_SIZE);
        this.reset();
    }

    reset() {
        this.memory.fill(0);
    }

    setMemory(index, value) {
        this.assertMemory(index);
        this.memory[index] = value;
    }
    
    getMemory(index) {
        this.assertMemory(index);
        return this.memory[index];
    }

    assertMemory(index) {
        console.assert(
          index >= 0 && index < _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.MEMORY_SIZE,
          `Error trying to access memory at index ${index}`
        );
    }

    getOpcode(index) {
        const highByte = this.getMemory(index);
        const lowByte = this.getMemory(index + 1);
        return (highByte << 8) | lowByte;
    }

}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Registers": () => (/* binding */ Registers)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _constants_registerConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



class Registers {
  constructor() {
    console.log('Construct Chip-8 Registers object');
    this.V = new Uint8Array(_constants_registerConstants__WEBPACK_IMPORTED_MODULE_1__.NUMBER_OF_REGISTERS); // 16 registers, each holds unsigned byte
    this.I = 0;
    this.DT = 0;
    this.ST = 0;
    this.PC = _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS;
    this.SP = -1; // -1 -> empty, why?, push increments, first push -> [0]
    this.stack = new Uint16Array(_constants_registerConstants__WEBPACK_IMPORTED_MODULE_1__.STACK_SIZE);
    this.reset();
  }
  reset() {
    this.V.fill(0);
    this.I = 0;
    this.DT = 0;
    this.ST = 0;
    this.PC = _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__.LOAD_PROGRAM_ADDRESS;
    this.SP = -1; // indicates empty stack
    this.stack.fill(0);
  }

  stackPush(value) {
    this.SP++;
    this.assertStackOverflow();
    this.stack[this.SP] = value;
  }

  stackPop() {
    const value = this.stack[this.SP];
    this.SP--;
    this.assertStackUnderflow();
    return value;
  }
  assertStackOverflow() {
    console.assert(this.SP < _constants_registerConstants__WEBPACK_IMPORTED_MODULE_1__.STACK_SIZE, 'Error stack Overflow');
  }
  assertStackUnderflow() {
    console.assert(this.SP >= -1, 'Error stack Underflow');
  }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Chip8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


function startupTests(chip8) {
    chip8.registers.stackPush(55);
    console.log(`stack pop: [${chip8.registers.stackPop()}]`);
    for (let i = 0; i < 16; i++) {
        let o = i*5; // offset
        console.log(`${i} sprite: [${chip8.memory.getMemory(o).toString(16)}, ${chip8.memory.getMemory(o+1).toString(16)}, ${chip8.memory.getMemory(o+2).toString(16)}, ${chip8.memory.getMemory(o+3).toString(16)}, ${chip8.memory.getMemory(o+4).toString(16)}]`);
    }
    //chip8.display.drawSprite(30, 30, 0x0a, 5);
}

async function runChip8() {
    // const rom = await fetch('./roms/test_opcode');
    // const arrayBuffer = await rom.arrayBuffer();
    // const romBuffer = new Uint8Array(arrayBuffer);
    // const chip8 = new Chip8(romBuffer);
    const chip8 = new _Chip8__WEBPACK_IMPORTED_MODULE_0__.Chip8();
    startupTests(chip8);
    while (1) {
      await chip8.sleep(200);
      if (chip8.registers.DT > 0) {
        await chip8.sleep();
        chip8.registers.DT--;
      }
    //   if (chip8.registers.ST > 0) {
    //     chip8.soundCard.enableSound();
    //     await chip8.sleep();
    //     chip8.registers.ST--;
    //   }
    //   if (chip8.registers.ST === 0) {
    //     chip8.soundCard.disableSound();
    //   }
    }
  }
  
  runChip8();
})();

/******/ })()
;