import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline";
import { Prompt } from "./prompt";
import { Delay } from "./utils";

(async function Main() {
  console.clear();

  while (true) {
    const io = createInterface(stdin, stdout);
    const options = await Prompt(io);

    io.close(); // prevent user keyboard input from interrupting pretty logs
    console.log();

    if (options) {
      console.log(options);
      console.log();
    } else continue;

    for (let i = 0; i < 5; i++) {
      console.log("* [Main] Larping Download: ", options.url.href);
      await Delay(1000);
    }

    console.log();
  }
})();
