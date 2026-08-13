import { Prompt } from "./prompt";

async function Main() {
  console.clear();

  while (true) {
    const options = await Prompt();

    console.log();

    if (options) {
      console.log(options);
    } else continue;

    console.log();
  }
}

Main();
