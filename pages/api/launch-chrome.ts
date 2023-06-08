import launchChrome from '@/test_runner/launchChrome';

export default async function handler(req: any, res: any) {
  let chrome;
  try {
    chrome = await launchChrome({ headless: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ chrome });
}