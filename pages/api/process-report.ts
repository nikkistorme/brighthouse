import { Result } from "lighthouse";

const avgCategoryScore = (reports: BrighthouseReport[], category: Category) => {
  const scores = reports.map((r) => r[category]);
  if (scores.includes(undefined)) return 0;
  const sum = scores.reduce((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a + b;
    else return 0;
  }, 0);
  if (sum === 0 || sum === undefined) return 0;
  const count = scores.length;
  const avg = sum / count;
  return Math.round(avg * 100) / 100;
};

const urlsMatch = (url1: string, url2: string) => {
  const formattedUrl1 = url1.replace(/\/$/, "");
  const formattedUrl2 = url2.replace(/\/$/, "");
  return formattedUrl1 === formattedUrl2;
};

export default async function handler(req: any, res: any) {
  const body = req.body;
  const processedReportsM: BrighthouseReport[] = [];
  const processedReportsD: BrighthouseReport[] = [];

  for (const url of body.params.urls) {
    const urlReportsM = body.reports.mobile.filter((r: BrighthouseReport) => { if (r.url) return urlsMatch(r.url, url) });
    const urlReportsD = body.reports.desktop.filter((r: BrighthouseReport) => { if (r.url) return urlsMatch(r.url, url) });
    let processedUrlReportD: BrighthouseReport = {};
    let processedUrlReportM: BrighthouseReport = {};

    if (urlReportsM?.length > 0) processedUrlReportM = { ...urlReportsM[0] };

    if (urlReportsD?.length > 0) processedUrlReportD = { ...urlReportsD[0] };

    body.params.categories.forEach((category: Category) => {
      if (urlReportsM?.length > 0) {
        let avgScoreM = 0;
        avgScoreM = avgCategoryScore(urlReportsM, category);
        if (urlReportsM?.length > 0) processedUrlReportM[category] = avgScoreM;
      }

      if (urlReportsD?.length > 0) {
        let avgScoreD = 0;
        avgScoreD = avgCategoryScore(urlReportsD, category);
        if (urlReportsD?.length > 0) processedUrlReportD[category] = avgScoreD;
      }

    });

    if (Object.keys(processedUrlReportM).length > 0) processedReportsM.push(processedUrlReportM);
    if (Object.keys(processedUrlReportD).length > 0) processedReportsD.push(processedUrlReportD);
  }

  res.status(200).json({ mobile: processedReportsM, desktop: processedReportsD });
}