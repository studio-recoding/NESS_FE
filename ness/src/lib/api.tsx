import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const openAIKey = ""; // 실제 배포 시에는 서버를 통해 API 키를 관리해야 합니다.

    try {
      const apiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
        }
      );

      const formattedResponse = apiResponse.data.choices[0].message.content;
      setResponse(formattedResponse);
    } catch (error) {
      console.error("Error:", error);
      setResponse(`Error: ${error}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your prompt:
          <input type="text" value={prompt} onChange={handlePromptChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h2>Response:</h2>
      <pre>{response}</pre>
    </div>
  );
};

export default App;
