import lighthouse, { RunnerResult } from 'lighthouse';

const runLighthouse = async (url: string, chrome: Chrome, device: string, categories: string[], audits: string[]) => {
  try {
    const flags = {
      port: chrome.port,
      output: "json",
      onlyCategories: categories,
      onlyAudits: audits,
    };
    let runnerResult: RunnerResult | undefined;
    switch (device) {
      case "desktop":
        // runnerResult = await lighthouse(url, flags, desktopConfig);
        // @ts-ignore
        runnerResult = await lighthouse(url, flags);
        break;
      default:
        // @ts-ignore
        runnerResult = await lighthouse(url, flags);
        break;
    }
    if (runnerResult?.lhr) return runnerResult.lhr;
    else throw new Error("🙅 No runnerResult found");
  } catch (err) {
    console.log(`🤖 Error found for ${url}...`);
    throw err;
  }
}

export default runLighthouse;