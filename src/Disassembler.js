import { INSTRUCTION_SET } from './constants/instructionSet';

export class Disassembler {
  disassemble(opcode) {
    const instruction = INSTRUCTION_SET.find(
      (instruction) => (opcode & instruction.mask) === instruction.pattern
    );
    // NOTE: ASSUMES found, but potentially undefined return value
    const args = instruction.arguments.map(
      (arg) => (opcode & arg.mask) >> arg.shift
    );
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
