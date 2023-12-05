import React, { useEffect, useState } from "react";
import styled from "styled-components";
import chatMessages from "../messages.json"; // messages.json 파일 임포트

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatMessages.messages as ChatMessage[]
  );
  const [userInput, setUserInput] = useState("");
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/chat");
    ws.onmessage = (event) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: event.data },
      ]);
    };
    setWebsocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() === "") {
      return; // 빈 입력 방지
    }
    const newUserMessage: ChatMessage = {
      sender: "user",
      content: userInput,
    };

    setIsLoading(true);
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      setMessages([...messages, { sender: "user", content: userInput }]);
      websocket.send(userInput);
      setUserInput(""); // 입력 필드 초기화
    } else {
      console.error("WebSocket is not connected.");
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <ChatContainer>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>
            {msg.content}
          </Message>
        ))}
        {isLoading && <p>로딩중...</p>}
      </ChatContainer>
      <InputArea>
        <Input type="text" value={userInput} onChange={handleInputChange} />
        <Button onClick={handleSubmit}>Send</Button>
      </InputArea>
    </Container>
  );
};

export default ChatBot;

const Container = styled.div`
  width: 400px;
  height: 600px;
  display: flex;
  margin: auto;
  flex-direction: column;
  position: relative;
  background-color: #9bbbd4;
`;

const ChatContainer = styled.div`
  // 채팅 컨테이너 스타일
`;

const Message = styled.div<{ sender: string }>`
  // 메시지 스타일 (sender에 따라 다름)
`;

const InputArea = styled.div`
  margin-top: 20px;
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: auto;
  height: 100px;
  background-color: white;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  width: 70%;
  border: none;
`;

const Button = styled.button`
  padding: 10px;
`;
