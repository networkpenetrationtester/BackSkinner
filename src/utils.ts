export async function Delay(ms: number) {
  console.log(`* [Delay] Waiting ${ms / 1000}s...`);
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
