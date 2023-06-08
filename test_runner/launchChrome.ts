const chromeLauncher = require("chrome-launcher");

type ChromeOptions = {
  headless: boolean;
}

const launchChrome = async (options: ChromeOptions) => {
  let chrome;
  
  try {
    if (options.headless)
      chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    else chrome = await chromeLauncher.launch();
  } catch (error) {
    throw error;
  }

  return chrome;
}

export default launchChrome;