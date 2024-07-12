import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Spinner, Fragment } from '@forge/react';
import { invoke } from '@forge/bridge';


const App = () => {
  const [summary, setSummary] = useState();

  // Getting the description of the issue.
  useEffect(() => {
    const getDescriptionSummary = async () => {
      const descriptionData = await invoke('getDescription');
      console.log("Description - " + descriptionData);
      if (descriptionData) {
        // ChatGPT prompt to get the summary
        const prompt = `As a security officer in a software development company, you get user stories from a product manager. Based on security standards like OWASP Application Security Verification Standard, provide list of sub-tasks for this user story of what to develop to make the product secure.
Provide bullet points that can be done as sub-tasks by a development team. Don't provide introduction or summary: "${descriptionData}". `;
        

        // Assistant API call to get the summary.
        const summary = await invoke('callAssistant', { prompt });
        console.log("Summary - " + summary);
        setSummary(summary);


      }
    };
    getDescriptionSummary();
  }, []);

  return (
    <>
      <Text>{summary}</Text>
    </>
  );
};



ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
