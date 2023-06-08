import killChrome from "@/test_runner/killChrome";

export default async function handler(req: any, res: any) {
  const body = req.body;
  try {
    await killChrome(body.chrome);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ 'message': 'Chrome killed' });
}