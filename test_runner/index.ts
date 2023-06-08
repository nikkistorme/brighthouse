import runReports from './runReports';

type TestRunnerParams = {
  urls: string[];
  runCount: number;
  categories: string[];
  device: string;
}

const testRunner = async (params: TestRunnerParams) => {
  const parameters = {
    ...params,
    headless: true,
    audits: [
      "first-contentful-paint",
      "largest-contentful-paint",
      "speed-index",
      "total-blocking-time",
      "cumulative-layout-shift",
      "interactive",
      "server-response-time",
      "modern-image-formats",
    ],
  }
  let reportResults;
  try {
    console.log('🚀 ~ parameters:', parameters);
    reportResults = await runReports(parameters);
  } catch (error) {
    throw error;
  }
  return reportResults;
}

export default testRunner;