import { Key } from "react";

const columns: {
  [key: string]: string;
} = {
  url: 'URL',
  device: 'Device',
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
  pwa: 'PWA',
};

export default function ReportTable({reports, categories}: {reports: BrighthouseReport[], categories: string[]}) {
  return (
    <div className="table_wrapper">
      <table className="table">
        <thead className="table_header">
          <tr>
            <th scope="col" className="cell">URL</th>
            <th scope="col" className="cell">Device</th>
            {categories.map((category: string, index: Key) => <th scope="col" className="cell" key={index}>{columns[category]}</th>)}
          </tr>
        </thead>
        <tbody>
          {reports.map((result: BrighthouseReport, index: Key) => (
            <tr className="table_row" key={index}>
              <td scope="row" className="cell">{result.url}</td>
              <td scope="row" className="cell">{result.device}</td>
              {categories.map((category: string, index: Key) => <td className="cell" key={index}>{result[category as keyof BrighthouseReport]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
)
}