import Resolver from '@forge/resolver';
import api, { route, fetch } from '@forge/api';

//const { Configuration, OpenAIApi } = require('openai');


const resolver = new Resolver();



resolver.define('getDescription', async ({ context }) => {
  // API call to get the description of the Jira issue with key
  const issueData = await api.asApp().requestJira(route`/rest/api/3/issue/${context.extension.issue.key}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  // API call to get the description of the Jira issue
  const responseData = await issueData.json();
  const description = responseData.fields.description;

  return JSON.stringify(description);
});


resolver.define('callAssistant', async ({ payload, context }) => {
  try {
    // Log the entire payload to check its structure
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    // Validate payload structure
    if (!payload || !payload.prompt) {
      throw new Error('Invalid payload structure: Missing prompt.');
    }

    // Create a new thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getOpenAPIKey()}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      throw new Error(`Error creating thread: ${errorText}`);
    }

    const threadData = await threadResponse.json();
    const threadId = threadData.id;
    console.log('Thread created:', threadData);

    // Create a new message in the thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getOpenAPIKey()}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: payload.prompt // Use the prompt field from the payload
      })
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      throw new Error(`Error creating message: ${errorText}`);
    }

    console.log('Message created:', await messageResponse.json());

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getOpenAPIKey()}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: 'asst_atkYPtA6QSH8Ow1TXbeZ5mQH'
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      throw new Error(`Error running assistant: ${errorText}`);
    }

    const runData = await runResponse.json();
    console.log('Run started:', runData);

    // Poll for the run status
    let runStatus = runData.status;
    while (runStatus !== 'completed' && runStatus !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again

      const pollResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runData.id}`, {
        headers: {
          'Authorization': `Bearer ${getOpenAPIKey()}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text();
        throw new Error(`Error polling run status: ${errorText}`);
      }

      const pollData = await pollResponse.json();
      runStatus = pollData.status;
      console.log('Run status:', pollData);
    }

    if (runStatus === 'completed') {
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${getOpenAPIKey()}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!messagesResponse.ok) {
        const errorText = await messagesResponse.text();
        throw new Error(`Error retrieving messages: ${errorText}`);
      }

      const messagesData = await messagesResponse.json();
      let formattedOutput = '';

      for (const message of messagesData.data.reverse()) {
        if (message.role === 'assistant') {
          formattedOutput += `${formatAssistantMessage(message.content[0].text.value)}\n`;
        }
      }

      return formattedOutput.trim();
    } else {
      return `Run status: ${runStatus}`;
    }

  } catch (error) {
    console.error('Error occurred:', error);
    if (error.response) {
      return `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`;
    } else {
      return error.toString();
    }
  }
});

// Get OpenAI API key
const getOpenAPIKey = () => {
  return process.env.OPEN_API_KEY;
}

// Format assistant message
const formatAssistantMessage = (message) => {
  // Split the message into lines and format them with bullet points and paragraphs
  const lines = message.split('\n');
  let formattedMessage = '';

  for (const line of lines) {
    if (line.trim()) {
      if (line.startsWith('- ')) {
        formattedMessage += `- ${line.slice(2)}\n`;
      } else {
        formattedMessage += `${line}\n\n`;
      }
    }
  }

  return formattedMessage.trim();
};

export const handler = resolver.getDefinitions();
