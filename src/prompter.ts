import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline";

export async function Prompter(...prompt_texts: string[]) {
  const rl = createInterface(stdin, stdout);
  const prompt_answers = [];

  for (let i = 0; i < prompt_texts.length; i++) {
    const prompt_text = prompt_texts[i];

    const promised_answer = new Promise<string>((resolve) => {
      // these are fucking bugged what the fuck!!!!!!'t

      const listener = async (input: string) => {
        switch (input) {
          case "!exit": {
            process.exit(0);
          }

          case "!cancel": {
            rl.close();
            return await Prompter(...prompt_texts);
          }

          case "!defaults": {
            rl.close();
            i = prompt_texts.length;
            break;
          }

          case "!clear": {
            rl.close();
            console.clear();
            return await Prompter(...prompt_texts);
          }

          default: {
            resolve(input);
          }
        }

        rl.removeListener("line", listener);
      };

      rl.addListener("line", listener);
    });

    rl.setPrompt(`${prompt_text}: `);
    rl.prompt();

    prompt_answers.push(await promised_answer);
  }

  rl.close();

  return prompt_answers;
}
