import generateSite from "./index";

async function main(): Promise<void> {
  try {
    await generateSite();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
