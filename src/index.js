import { Chip8 } from './Chip8';
import { makeSoundcard } from "./SoundCard";

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
    const chip8 = new Chip8(romBuffer);
    var loopId, soundcard;

    soundcard = makeSoundcard();
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
