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
/* harmony import */ var _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _constants_registerConstants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _Disassembler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _Display__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var _Memory__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(11);
/* harmony import */ var _Registers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(12);











class Chip8 {
    // Chip8 emulation class
    constructor(romBuffer) {
        console.log('Construct new Chip-8 emulator object');
        this.memory = new _Memory__WEBPACK_IMPORTED_MODULE_7__.Memory();
        this.registers = new _Registers__WEBPACK_IMPORTED_MODULE_8__.Registers();
        this.loadCharSet();
        this.loadRom(romBuffer);
        this.keyboard = new _Keyboard__WEBPACK_IMPORTED_MODULE_6__.Keyboard();
        this.disassembler = new _Disassembler__WEBPACK_IMPORTED_MODULE_4__.Disassembler();
        this.display = new _Display__WEBPACK_IMPORTED_MODULE_5__.Display(this.memory);
    }

    sleep(ms = _constants_registerConstants__WEBPACK_IMPORTED_MODULE_3__.TIMER_60_HZ) { // is not itself async but returns a Promise?
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    loadCharSet() {
        this.memory.memory.set(_constants_charSetConstants__WEBPACK_IMPORTED_MODULE_0__.CHAR_SET, _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_2__.CHAR_SET_ADDRESS);
    }

    loadRom(romBuffer) {
        console.assert(
          romBuffer.length + _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_2__.LOAD_PROGRAM_ADDRESS <= _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_2__.MEMORY_SIZE,
          'ROM is too large.'
        );
        this.memory.memory.set(romBuffer, _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_2__.LOAD_PROGRAM_ADDRESS);
        this.registers.PC = _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_2__.LOAD_PROGRAM_ADDRESS;
      }

    async execute(opcode) {
        const { instruction, args } = this.disassembler.disassemble(opcode);
        const { id } = instruction;
        this.registers.PC += 2;
        // console.log('i', instruction);
        // console.log('a', args);
        // console.log('id', id);
        switch (id) {
          case 'CLS':
            this.display.clear();
            break;
          case 'RET':
            this.registers.PC = this.registers.stackPop();
            break;
          case 'JP_ADDR':
            this.registers.PC = args[0];
            break;
          case 'CALL_ADDR':
            this.registers.stackPush(this.registers.PC);
            this.registers.PC = args[0];
            break;
          case 'SE_VX_KK':
            if (this.registers.V[args[0]] === args[1]) {
              this.registers.PC += 2;
            }
            break;
          case 'SNE_VX_KK':
            if (this.registers.V[args[0]] !== args[1]) {
              this.registers.PC += 2;
            }
            break;
          case 'SE_VX_VY':
            if (this.registers.V[args[0]] === this.registers.V[args[1]]) {
              this.registers.PC += 2;
            }
            break;
          case 'LD_VX_KK':
            this.registers.V[args[0]] = args[1];
            break;
          case 'ADD_VX_KK':
            this.registers.V[args[0]] += args[1];
            break;
          case 'LD_VX_VY':
            this.registers.V[args[0]] = this.registers.V[args[1]];
            break;
          case 'OR_VX_VY':
            this.registers.V[args[0]] |= this.registers.V[args[1]];
            break;
          case 'AND_VX_VY':
            this.registers.V[args[0]] &= this.registers.V[args[1]];
            break;
          case 'XOR_VX_VY':
            this.registers.V[args[0]] ^= this.registers.V[args[1]];
            break;
          case 'ADD_VX_VY':
            this.registers.V[0x0f] =
              this.registers.V[args[0]] + this.registers.V[args[1]] > 0xff;
            this.registers.V[args[0]] += this.registers.V[args[1]];
            break;
          case 'SUB_VX_VY':
            this.registers.V[0x0f] =
              this.registers.V[[args[0]]] > this.registers.V[args[1]];
            this.registers.V[args[0]] -= this.registers.V[args[1]];
            break;
          case 'SHR_VX_VY':
            this.registers.V[0x0f] = this.registers.V[args[0]] & 0x01;
            this.registers.V[args[0]] >>= 1;
            break;
          case 'SUBN_VX_VY':
            this.registers.V[0x0f] =
              this.registers.V[args[1]] > this.registers.V[args[0]];
            this.registers.V[args[0]] =
              this.registers.V[args[1]] - this.registers.V[args[0]];
            break;
          case 'SHL_VX_VY':
            this.registers.V[0x0f] = Boolean(this.registers.V[args[0]] & 0x80); //0b10000000
            this.registers.V[args[0]] <<= 1;
            break;
          case 'SNE_VX_VY':
            if (this.registers.V[args[0]] !== this.registers.V[args[1]]) {
              this.registers.PC += 2;
            }
            break;
          case 'LD_I_ADDR':
            this.registers.I = args[0];
            break;
          case 'JP_V0_ADDR':
            this.registers.PC = this.registers.V[0] + args[0];
            break;
          case 'RND_VX_KK':
            const random = Math.floor(Math.random() * 0xff);
            this.registers.V[args[0]] = random & args[1];
            break;
          case 'DRW_VX_VY_N':
            const collision = this.display.drawSprite(
              this.registers.V[args[0]],
              this.registers.V[args[1]],
              this.registers.I,
              args[2]
            );
            this.registers.V[0x0f] = collision;
            break;
          case 'SKP_VX':
            if (this.keyboard.isKeydown(this.registers.V[args[0]])) {
              this.registers.PC += 2;
            }
            break;
          case 'SKNP_VX':
            if (!this.keyboard.isKeydown(this.registers.V[args[0]])) {
              this.registers.PC += 2;
            }
            break;
          case 'LD_VX_DT':
            this.registers.V[args[0]] = this.registers.DT;
            break;
          case 'LD_VX_K':
            let keyPressed = -1;
            while (keyPressed === -1) {
              keyPressed = this.keyboard.hasKeydown();
              await this.sleep();
            }
            this.registers.V[args[0]] = keyPressed;
            console.log('got key', this.registers.V[args[0]]);
            break;
          case 'LD_DT_VX':
            this.registers.DT = this.registers.V[args[0]];
            break;
          case 'LD_ST_VX':
            this.registers.ST = this.registers.V[args[0]];
            break;
          case 'ADD_I_VX':
            this.registers.I += this.registers.V[args[0]];
            break;
          case 'LD_F_VX':
            this.registers.I = this.registers.V[args[0]] * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_1__.SPRITE_HIGHT;
            break;
          case 'LD_B_VX':
            let x = this.registers.V[args[0]];
            const hundreds = Math.floor(x / 100);
            x = x - hundreds * 100;
            const tens = Math.floor(x / 10);
            const ones = x - tens * 10;
            this.memory.memory[this.registers.I] = hundreds;
            this.memory.memory[this.registers.I + 1] = tens;
            this.memory.memory[this.registers.I + 2] = ones;
            break;
          case 'LD_I_VX':
            for (let i = 0; i <= args[0]; i++) {
              this.memory.memory[this.registers.I + i] = this.registers.V[i];
            }
            break;
          case 'LD_VX_I':
            for (let i = 0; i <= args[0]; i++) {
              this.registers.V[i] = this.memory.memory[this.registers.I + i];
            }
            break;
          default:
            console.error(`Instruction with id ${id} not found`, instruction, args);
        }
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
/* harmony export */   "BG_COLOR": () => (/* binding */ BG_COLOR),
/* harmony export */   "COLOR": () => (/* binding */ COLOR),
/* harmony export */   "DISPLAY_HEIGHT": () => (/* binding */ DISPLAY_HEIGHT),
/* harmony export */   "DISPLAY_SCALING": () => (/* binding */ DISPLAY_SCALING),
/* harmony export */   "DISPLAY_WIDTH": () => (/* binding */ DISPLAY_WIDTH),
/* harmony export */   "SPRITE_HIGHT": () => (/* binding */ SPRITE_HIGHT)
/* harmony export */ });
const DISPLAY_WIDTH = 64; // Chip8 window width - per Chip8 spec
const DISPLAY_HEIGHT = 32; // Chip8 window height
const DISPLAY_SCALING = 10; // scale Chip8 screen to browser window resolution
const SPRITE_HIGHT = 5; // height for character sprite definitions at 0x00
const BG_COLOR = "#000"; // black
const COLOR = "#3F6"; // ??

/***/ }),
/* 4 */
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
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NUMBER_OF_REGISTERS": () => (/* binding */ NUMBER_OF_REGISTERS),
/* harmony export */   "STACK_SIZE": () => (/* binding */ STACK_SIZE),
/* harmony export */   "TIMER_60_HZ": () => (/* binding */ TIMER_60_HZ)
/* harmony export */ });
const NUMBER_OF_REGISTERS = 16;
const STACK_SIZE = 16;
const TIMER_60_HZ = 1020 / 60;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Disassembler": () => (/* binding */ Disassembler)
/* harmony export */ });
/* harmony import */ var _constants_instructionSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


class Disassembler {
  disassemble(opcode) {
    //console.log(`disassemble ${opcode.toString(16)}`);
    const instruction = _constants_instructionSet__WEBPACK_IMPORTED_MODULE_0__.INSTRUCTION_SET.find(
      (instruction) => (opcode & instruction.mask) === instruction.pattern
    );
    // NOTE: ASSUMES found, but potentially undefined return value
    if (!instruction) {
      console.log(`cant disassemble ${opcode.toString(16)}`);
    }
    const args = instruction.arguments.map(
      (arg) => (opcode & arg.mask) >> arg.shift
    );
    //console.log(`disassembled ${opcode.toString(16)} : ${instruction} : ${args}`);
    return { instruction, args };
  }
}

/* NOTE: elements of INSTRUCTION set are JSON objects like:
  {
    key: 2,
    id: 'CLS',
    name: 'CLS',
    mask: 0xffff,
    pattern: 0x00e0,
    arguments: [],
  },
  {
    key: 32,
    id: 'LD_B_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf033,
    arguments: [MASK_X],
  },
*/

/* HOW does disassemble(opcode) work based on the above?
#1. find is given a function in the same way a filter() function does,
    it iterates through array sequentially and returns FIRST match
    where function returns true.  What if always false?
#2. find iterates through the INSTRUCTION_SET array,
    calling the function for each element in the array,
    returns first that returns true
#3. Apparently that guarantees you found the right instruction and you
    are returned the JSON as 'instruction'.
*/


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "INSTRUCTION_SET": () => (/* binding */ INSTRUCTION_SET),
/* harmony export */   "MASK_HIGHEST_AND_LOWEST_BYTE": () => (/* binding */ MASK_HIGHEST_AND_LOWEST_BYTE),
/* harmony export */   "MASK_HIGHEST_BYTE": () => (/* binding */ MASK_HIGHEST_BYTE),
/* harmony export */   "MASK_KK": () => (/* binding */ MASK_KK),
/* harmony export */   "MASK_N": () => (/* binding */ MASK_N),
/* harmony export */   "MASK_NNN": () => (/* binding */ MASK_NNN),
/* harmony export */   "MASK_X": () => (/* binding */ MASK_X),
/* harmony export */   "MASK_Y": () => (/* binding */ MASK_Y)
/* harmony export */ });
const MASK_NNN = { mask: 0x0fff };
const MASK_N = { mask: 0x000f };
const MASK_X = { mask: 0x0f00, shift: 8 };
const MASK_Y = { mask: 0x00f0, shift: 4 };
const MASK_KK = { mask: 0x00ff };
const MASK_HIGHEST_BYTE = 0xf000;
const MASK_HIGHEST_AND_LOWEST_BYTE = 0xf00f;
const INSTRUCTION_SET = [
  {
    key: 2,
    id: 'CLS',
    name: 'CLS',
    mask: 0xffff,
    pattern: 0x00e0,
    arguments: [],
  },
  {
    key: 3,
    id: 'RET',
    name: 'RET',
    mask: 0xffff,
    pattern: 0x00ee,
    arguments: [],
  },
  {
    key: 4,
    id: 'JP_ADDR',
    name: 'JP',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x1000,
    arguments: [MASK_NNN],
  },
  {
    key: 5,
    id: 'CALL_ADDR',
    name: 'CALL',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x2000,
    arguments: [MASK_NNN],
  },
  {
    key: 6,
    id: 'SE_VX_KK',
    name: 'SE',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x3000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 7,
    id: 'SNE_VX_KK',
    name: 'SNE',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x4000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 8,
    id: 'SE_VX_VY',
    name: 'SE',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x5000,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 9,
    id: 'LD_VX_KK',
    name: 'LD',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x6000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 10,
    id: 'ADD_VX_KK',
    name: 'ADD',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0x7000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 11,
    id: 'LD_VX_VY',
    name: 'LD',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8000,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 12,
    id: 'OR_VX_VY',
    name: 'OR',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8001,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 13,
    id: 'AND_VX_VY',
    name: 'AND',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8002,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 14,
    id: 'XOR_VX_VY',
    name: 'XOR',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8003,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 15,
    id: 'ADD_VX_VY',
    name: 'ADD',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8004,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 16,
    id: 'SUB_VX_VY',
    name: 'SUB',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8005,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 17,
    id: 'SHR_VX_VY',
    name: 'SHR',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8006,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 18,
    id: 'SUBN_VX_VY',
    name: 'SUBN',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x8007,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 19,
    id: 'SHL_VX_VY',
    name: 'SHL',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x800e,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 20,
    id: 'SNE_VX_VY',
    name: 'SNE',
    mask: MASK_HIGHEST_AND_LOWEST_BYTE,
    pattern: 0x9000,
    arguments: [MASK_X, MASK_Y],
  },
  {
    key: 21,
    id: 'LD_I_ADDR',
    name: 'LD',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xa000,
    arguments: [MASK_NNN],
  },
  {
    key: 22,
    id: 'JP_V0_ADDR',
    name: 'JP',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xb000,
    arguments: [MASK_NNN],
  },
  {
    key: 23,
    id: 'RND_VX_KK',
    name: 'RND',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xc000,
    arguments: [MASK_X, MASK_KK],
  },
  {
    key: 24,
    id: 'DRW_VX_VY_N',
    name: 'DRW',
    mask: MASK_HIGHEST_BYTE,
    pattern: 0xd000,
    arguments: [MASK_X, MASK_Y, MASK_N],
  },
  {
    key: 25,
    id: 'SKP_VX',
    name: 'SKP',
    mask: 0xf0ff,
    pattern: 0xe09e,
    arguments: [MASK_X],
  },
  {
    key: 26,
    id: 'SKNP_VX',
    name: 'SKNP',
    mask: 0xf0ff,
    pattern: 0xe0a1,
    arguments: [MASK_X],
  },
  {
    key: 27,
    id: 'LD_VX_DT',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf007,
    arguments: [MASK_X],
  },
  {
    key: 27,
    id: 'LD_VX_K',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf00a,
    arguments: [MASK_X],
  },
  {
    key: 28,
    id: 'LD_DT_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf015,
    arguments: [MASK_X],
  },
  {
    key: 29,
    id: 'LD_ST_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf018,
    arguments: [MASK_X],
  },
  {
    key: 30,
    id: 'ADD_I_VX',
    name: 'ADD',
    mask: 0xf0ff,
    pattern: 0xf01e,
    arguments: [MASK_X],
  },
  {
    key: 31,
    id: 'LD_F_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf029,
    arguments: [MASK_X],
  },
  {
    key: 32,
    id: 'LD_B_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf033,
    arguments: [MASK_X],
  },
  {
    key: 32,
    id: 'LD_I_VX',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf055,
    arguments: [MASK_X],
  },
  {
    key: 33,
    id: 'LD_VX_I',
    name: 'LD',
    mask: 0xf0ff,
    pattern: 0xf065,
    arguments: [MASK_X],
  },
];


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Display": () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);



const blankBuffer = () => Array(_constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT).fill([]).map(row => Array(_constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH).fill(0));

class Display {
    constructor(memory) {
        console.log('Construct a new Display object');
        this.memory = memory;
        this.screen = document.querySelector('canvas');
        this.screen.width = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING;
        this.screen.height = _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.clear();
        this.draw();
    }

	clear() { this.frameBuffer = blankBuffer(); }

	draw() {
		this.frameBuffer.forEach((row, y) =>
			row.forEach((pic, x) => {
				this.context.fillStyle = pic ? _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.COLOR : _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.BG_COLOR;
				this.context.fillRect(x * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING, y * _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING, _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING, _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_SCALING);
			}));
	}

    drawSprite(x, y, spriteAddress, spriteRows) {
        // Output: frameBuffer update, drawBuffer(), collision flag returned
        let collision = false;
        // NOTE: row is y position, not x, first dimension in frameBuffer is y, not x
        for (let row = 0; row < spriteRows; row++) {
          const sprite_row = this.memory.memory[spriteAddress + row];
          let bitmask = 0b10000000;
          for (let col = 0; col < _constants_charSetConstants__WEBPACK_IMPORTED_MODULE_1__.CHAR_SET_WIDTH; col++, bitmask >>= 1) {
            const sprite_bit_set = (sprite_row & bitmask);
            if (sprite_bit_set) { // if zero => no change, X^0 = X, no collision
                const this_row = (y + row) < _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT ? (y + row) : (y + row) % _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_HEIGHT;
                const this_col = (x + col) <  _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH ? (x + col) : (x + col) % _constants_displayConstants__WEBPACK_IMPORTED_MODULE_0__.DISPLAY_WIDTH;
                if (!collision && this.frameBuffer[this_row][this_col]) {
                     collision = true;
                }
                this.frameBuffer[this_row][this_col] ^= 1;
            }
          }
        }
        this.draw();
        return collision;
    }
}

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keyboard": () => (/* binding */ Keyboard)
/* harmony export */ });
/* harmony import */ var _constants_keyboardConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);


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
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NUMBER_OF_KEYS": () => (/* binding */ NUMBER_OF_KEYS),
/* harmony export */   "keyMap": () => (/* binding */ keyMap)
/* harmony export */ });
const NUMBER_OF_KEYS = 16;
const keyMap = [
  'x',
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
  'c',
  '4',
  'r',
  'f',
  'v',
];


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Memory": () => (/* binding */ Memory)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


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
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Registers": () => (/* binding */ Registers)
/* harmony export */ });
/* harmony import */ var _constants_memoryConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _constants_registerConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);



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


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeSoundcard": () => (/* binding */ makeSoundcard)
/* harmony export */ });
const makeSoundcard = () => {
	const VOLUME = 0.3;
	const atx = new (window.AudioContext || window.webkitAudioContext)();
	const gain = atx.createGain();
	const osc = atx.createOscillator();
	osc.connect(gain).connect(atx.destination);

	gain.gain.setValueAtTime(0.00001, atx.currentTime);
	osc.type = "triangle";
	osc.frequency.value = 392;
	osc.start(atx.currentTime);
	let playing = false;

	return {
		start: () => {
			if (playing) return;
			playing = true;
			gain.gain.setValueAtTime(VOLUME, atx.currentTime);
		},
		stop: () => {
			if (!playing) return;
			playing = false;
			gain.gain.setValueAtTime(VOLUME, atx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.0000001, atx.currentTime + .02);
		},
	}

};


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
/* harmony import */ var _SoundCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);



// function startupTests(chip8) {
//     chip8.registers.stackPush(55);
//     console.log(`stack pop: [${chip8.registers.stackPop()}]`);
//     for (let i = 0; i < 16; i++) {
//         let o = i*5; // offset
//         console.log(`${i} sprite: [${chip8.memory.getMemory(o).toString(16)}, ${chip8.memory.getMemory(o+1).toString(16)}, ${chip8.memory.getMemory(o+2).toString(16)}, ${chip8.memory.getMemory(o+3).toString(16)}, ${chip8.memory.getMemory(o+4).toString(16)}]`);
//     }
//     chip8.display.drawSprite(30, 30, 0x0a, 5);
// }

const TIME_UNIT = 1020 / 60;
const CLOCKS_PER_TIME_UNIT = 9;

async function runChip8() {
    const rom = await fetch('./roms/test_opcode');
    const arrayBuffer = await rom.arrayBuffer();
    const romBuffer = new Uint8Array(arrayBuffer);
    const chip8 = new _Chip8__WEBPACK_IMPORTED_MODULE_0__.Chip8(romBuffer);
    var loopId, soundcard;

    soundcard = (0,_SoundCard__WEBPACK_IMPORTED_MODULE_1__.makeSoundcard)();
    clearInterval(loopId);
    loopId = setInterval(loop, TIME_UNIT);

    function loop() {
      for (let i = 0; i < CLOCKS_PER_TIME_UNIT; i++) {
        const opcode = chip8.memory.getOpcode(chip8.registers.PC);
        chip8.execute(opcode);
        //chip8.display.draw();
      }
      chip8.display.draw();
  
      if (chip8.registers.DT > 0) {
        --chip8.registers.DT;
      }
  
      if (chip8.registers.ST > 0) {
        --chip8.registers.ST;
        soundcard && soundcard.start();
      } else {
        soundcard && soundcard.stop();
      }
    }

}

console.log("Start me up");
runChip8();

})();

/******/ })()
;