import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline";

export const io = createInterface(stdin, stdout);

export async function AsyncPrompt(prompt: string) {
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

export async function AsyncConfirm(subject: string) {
  for (
    let confirm = "";
    ;
    confirm = await AsyncPrompt(`* [AsyncConfirm] Confirm ${subject}? [y/n]: `)
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

export async function Prompter(...prompt_texts: string[]) {
  const prompt_answers = [];

  for (let i = 0; i < prompt_texts.length; i++) {
    const prompt_text = prompt_texts[i];
    const answer = await AsyncPrompt(prompt_text + ": ");

    switch (answer) {
      case "/exit": {
        process.exit(0);
      }
      case "/clear": {
        console.clear();
        i = -1;
        break;
      }
      case "/def": {
        console.log("* [Prompter] Accepting Default Values...");
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
