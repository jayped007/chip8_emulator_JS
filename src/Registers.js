import { LOAD_PROGRAM_ADDRESS } from './constants/memoryConstants';
import {
  NUMBER_OF_REGISTERS,
  STACK_SIZE,
} from './constants/registerConstants';

export class Registers {
  constructor() {
    console.log('Construct Chip-8 Registers object');
    this.V = new Uint8Array(NUMBER_OF_REGISTERS); // 16 registers, each holds unsigned byte
    this.I = 0;
    this.DT = 0;
    this.ST = 0;
    this.PC = LOAD_PROGRAM_ADDRESS;
    this.SP = -1; // -1 -> empty, why?, push increments, first push -> [0]
    this.stack = new Uint16Array(STACK_SIZE);
    this.reset();
  }
  reset() {
    this.V.fill(0);
    this.I = 0;
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.PC = LOAD_PROGRAM_ADDRESS;
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
    console.assert(this.SP < STACK_SIZE, 'Error stack Overflow');
  }
  assertStackUnderflow() {
    console.assert(this.SP >= -1, 'Error stack Underflow');
  }
}
