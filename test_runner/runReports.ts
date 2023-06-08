import launchChrome from './launchChrome';
import runLighthouse from './runLighthouse';
import killChrome from './killChrome';

type TestRunnerParams = {
  urls: string[];
  runCount: number;
  categories: string[];
  device: string;
  headless: boolean;
  audits: string[];
}

const runReports = async (params: TestRunnerParams) => {
  const device = params.device;
  const results: {
    desktop: any[];
    mobile: any[];
  } = {
    desktop: [],
    mobile: [],
  }
  const chrome = await launchChrome({ headless: params.headless });
  try {
    for (const url of params.urls) {
      if (!url) continue;
      let count = 0;
      while (count < params.runCount) {
        if (device === "desktop") {
          console.log(`🤖 Beginning desktop audit ${count + 1} for ${url}...`);
          const desktopResult = await runLighthouse(url, chrome, "desktop", params.categories, params.audits);
          console.log(`🤖 Finished desktop audit ${count + 1} for ${url}`);
          results.desktop.push(desktopResult);
        } else if (device === "both") {
          console.log(`🤖 Beginning mobile audit ${count + 1} for ${url}...`);
          const mobileResult = await runLighthouse(url, chrome, "mobile", params.categories, params.audits);
          console.log(`🤖 Finished mobile audit ${count + 1} for ${url}`);
          console.log(`🤖 Beginning desktop audit ${count + 1} for ${url}...`);
          const desktopResult = await runLighthouse(url, chrome, "desktop", params.categories, params.audits);
          console.log(`🤖 Finished desktop audit ${count + 1} for ${url}`);
          results.mobile.push(mobileResult);
          results.desktop.push(desktopResult);
        } else {
          console.log(`🤖 Beginning mobile audit ${count + 1} for ${url}...`);
          const mobileResult = await runLighthouse(url, chrome, "mobile", params.categories, params.audits);
          console.log(`🤖 Finished mobile audit ${count + 1} for ${url}`);
          results.mobile.push(mobileResult);
        }
        count++;
      }
    }
    await killChrome(chrome);
    return results;
  } catch (err) {
    await killChrome(chrome);
    throw err;
  }
}

export default runReports;