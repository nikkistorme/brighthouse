'use client';
import { Key, useState } from 'react';
import { Result } from 'lighthouse';
import ReportTable from './ReportTable';

import styles from '@/styles/page.module.css';
import ParamsForm from './ParamsForm';

const apiOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [results, setResults] = useState<AllReports>({desktop: [], mobile: []});

  const selectedOptions = (event: React.FormEvent<HTMLFormElement>) => {
    const options = event.currentTarget.categories.options;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    return selectedOptions;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const parameters = {
      urls: event.currentTarget.urls.value.split('\n'),
      runCount: Number(event.currentTarget.runCount.value),
      device: event.currentTarget.device.value,
      categories: selectedOptions(event),
    };
    let reportCount = parameters.urls.length * parameters.runCount;
    if (parameters.device === 'both') {
      reportCount *= 2;
    }
    setStepCount(reportCount + 2); // +2 for launching chrome and processing results
    setCategories(parameters.categories);

    let chrome;
    try {
      const response = await fetch('/api/launch-chrome', apiOptions);
      const data = await response.json();
      chrome = data.chrome;
    } catch (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    setCurrentStep(currentStep => currentStep + 1);
    
    const allResults: {
      desktop: any[],
      mobile: any[],
    } = {
      desktop: [],
      mobile: [],
    }
    let desktopResult: Result;
    let mobileResult: Result;
    for (const url of parameters.urls) {
      if (!url) continue;
      let count = 0;
      while (count < parameters.runCount) {
        switch (parameters.device) {
          case 'desktop':
            const response = await fetch('/api/run-lighthouse', {
              ...apiOptions,
              body: JSON.stringify({
                url,
                chrome,
                device: 'desktop',
                categories: parameters.categories,
              }),
            });
            const data = await response.json();
            desktopResult = data.result;
            allResults.desktop.push(desktopResult);
            setCurrentStep(currentStep => currentStep + 1);
            break;
          case 'both':
            const mobileResponseForBoth = await fetch('/api/run-lighthouse', {
              ...apiOptions,
              body: JSON.stringify({
                url,
                chrome,
                device: 'mobile',
                categories: parameters.categories,
              }),
            });
            const mobileDataForBoth = await mobileResponseForBoth.json();
            mobileResult = mobileDataForBoth.result;
            setCurrentStep(currentStep => currentStep + 1);
            const desktopResponse = await fetch('/api/run-lighthouse', {
              ...apiOptions,
              body: JSON.stringify({
                url,
                chrome,
                device: 'desktop',
                categories: parameters.categories,
              }),
            });
            const desktopData = await desktopResponse.json();
            desktopResult = desktopData.result;
            allResults.mobile.push(mobileResult);
            allResults.desktop.push(desktopResult);  
            setCurrentStep(currentStep => currentStep + 1);
            break;
          default:
            const mobileResponse = await fetch('/api/run-lighthouse', {
              ...apiOptions,
              body: JSON.stringify({
                url,
                chrome,
                device: 'mobile',
                categories: parameters.categories,
              }),
            });
            const mobileData = await mobileResponse.json();
            mobileResult = mobileData.result;
            allResults.mobile.push(mobileResult);
            setCurrentStep(currentStep => currentStep + 1);
            break;
        }
        count++;
      }
    }

    await fetch('/api/kill-chrome', {...apiOptions, body: JSON.stringify({chrome})});

    await processResults(parameters, allResults);
    setCurrentStep(0);
    setStepCount(0);

    setLoading(false);
  };

  const processResults = async (params: BrighthouseParams, results: {desktop: Result[], mobile: Result[]}) => {
    const newReportsM: BrighthouseReport[] = []
    const newReportsD: BrighthouseReport[] = []

    for (const result of results.mobile) {
      if (!result) continue;
      let processedResult: BrighthouseReport = {
        url: result.requestedUrl || "",
        device: "mobile",
      };
      params.categories.forEach((category: Category) => {
        if (result!.categories[category]!.score)
          // @ts-ignore: Unreachable code error
          processedResult[category] = result!.categories[category]!.score * 100;
        else processedResult[category] = 0;
      });
      newReportsM.push(processedResult);
    };

    for (const result of results.desktop) {
      let processedResult: BrighthouseReport = {
        url: result.requestedUrl || "",
        device: "desktop",
      };
      params.categories.forEach((category: Category) => {
        if (result?.categories[category]?.score)
          // @ts-ignore: Unreachable code error
          processedResult[category] = result.categories[category].score * 100;
        else processedResult[category] = 0;
      });
      newReportsD.push(processedResult);
    }

    console.log('🚀 ~ newReportsM:', newReportsM);
    console.log('🚀 ~ newReportsD:', newReportsD);

    const response = await fetch('/api/process-report', {
      ...apiOptions,
      body: JSON.stringify({
        params,
        reports: {
          mobile: newReportsM,
          desktop: newReportsD,
        },
      }),
    });
    const data = await response.json();
    console.log('🚀 ~ data:', data);
    setResults(data);
  };

  return (
    <main>
      <div>
        <h1>Brighthouse</h1>
        <p>Automatically run batches of Google Lighthouse audits and compile the results.</p>
        <h2>TODO</h2>
        <ul>
          <li>Accessible multiselect</li>
          <li>Accessible table</li>
          <li>Accessible form</li>
          <li>Accessible progress bar</li>
          <li>Style background and typography</li>
          <li>Style table</li>
          <li>Style form</li>
          <li>Style progress bar</li>
          <li>Catch incorrect URLs</li>
          <li>Add audit types</li>
        </ul>
      </div>
      <div>
        <h2>Parameters</h2>
        <ParamsForm onSubmit={handleSubmit} loading={loading} />
      </div>
      <div>
        <h2>Results</h2>
        <div>
          {!loading && !results?.mobile?.length && !results?.desktop?.length && <p>Submit the desired parameters to begin compiling reports</p>}
          {loading && stepCount > 0 && currentStep > 0
            && <p>{`${Math.round(currentStep / stepCount * 100)}%`}</p>
          }
        </div>
        {!loading && results.mobile?.length > 0 &&
          <>
            <h3>Mobile</h3>
            <ReportTable reports={results.mobile} categories={categories} />
          </>
        }
        {!loading && results.desktop?.length > 0 &&
          <>
            <h3>Desktop</h3>
            <ReportTable reports={results.desktop} categories={categories} />
          </>
        }
      </div>
    </main>
  )
}
