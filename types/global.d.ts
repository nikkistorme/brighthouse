import { type } from "os";

export {}

declare global {
  interface Chrome {
    port: number;
    kill: () => Promise<void>;
  }
  type Category = "performance" | "accessibility" | "best-practices" | "seo" | "pwa";
  interface BrighthouseParams {
    urls: string[];
    runCount: number;
    categories: Category[];
    device: string;
    audits?: string[];
    headless?: boolean;
  }
  interface BrighthouseReport {
    url?: string;
    device?: string;
    performance?: number;
    accessibility?: number;
    "best-practices"?: number;
    seo?: number;
    pwa?: number;
    "first-contentful-paint"?: number;
    "largest-contentful-paint"?: number;
    "speed-index"?: number;
    "total-blocking-time"?: number;
    "cumulative-layout-shift"?: number;
  }
  interface AllReports {
    mobile: BrighthouseReport[];
    desktop: BrighthouseReport[];
  }
}