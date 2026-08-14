import { Interface } from "node:readline";

export async function AsyncPrompt(io: Interface, prompt: string) {
  io.setPrompt(prompt);
  io.prompt();

  return await new Promise<string>((resolve) => {
    const listener = (input: string) => {
      io.removeListener("line", listener);
      resolve(input);
    };

    io.addListener("line", listener);
  });
}

export async function AsyncConfirm(io: Interface, subject: string) {
  for (
    let confirm = "";
    ;
    confirm = await AsyncPrompt(io, `* [AsyncConfirm] ${subject}? [y/n]: `)
  ) {
    switch (confirm) {
      case "y": {
        console.log(`* [AsyncConfirm] Proceeding...`);
        return true;
      }
      case "n": {
        console.log(`* [AsyncConfirm] Aborted.`);
        return false;
      }
    }
  }
}

export async function Prompter(io: Interface, ...prompt_texts: string[]) {
  let prompt_answers = [];

  for (let i = 0; i < prompt_texts.length; i++) {
    const prompt_text = prompt_texts[i];
    const answer = await AsyncPrompt(io, prompt_text + ": ");

    switch (answer) {
      case "/exit": {
        process.exit(0);
      }
      case "/clear": {
        console.clear();
        prompt_answers = [];
        i = -1;
        break;
      }
      case "/def": {
        console.log("* [Prompter] Accepting default values...");
        i = prompt_texts.length;
        break;
      }
      default: {
        prompt_answers.push(answer);
        break;
      }
    }
  }

  return prompt_answers;
}
