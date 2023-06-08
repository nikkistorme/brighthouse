import runLighthouse from "@/test_runner/runLighthouse";

export default async function handler(req: any, res: any) {
  const body = req.body;

  const audits = [
    "first-contentful-paint",
    "largest-contentful-paint",
    "speed-index",
    "total-blocking-time",
    "cumulative-layout-shift",
  ]

  let result;
  try {
    result = await runLighthouse(body.url, body.chrome, body.device, body.categories, audits);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ result });
}