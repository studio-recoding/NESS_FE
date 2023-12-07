import React, { useEffect, useRef, useState } from "react";
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
  const [tempMessage, setTempMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tempMessageRef = useRef("");
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/chat");
    ws.onmessage = (event) => {
      if (event.data === "&!~") {
        addTempMessageToMessages(tempMessageRef.current); // useRef를 사용
        tempMessageRef.current = ""; // 참조를 통해 값 초기화
        setTempMessage(""); // 상태 업데이트로 리렌더링 트리거
      } else {
        tempMessageRef.current += event.data; // 참조를 통해 값 업데이트
        setTempMessage(tempMessageRef.current); // 상태 업데이트로 리렌더링 트리거
      }
    };
    setWebsocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  const addTempMessageToMessages = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", content: message },
    ]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        {tempMessage && <Message sender={"bot"}>{tempMessage}</Message>}
      </ChatContainer>
      <InputArea>
        <Input value={userInput} onChange={handleInputChange}></Input>
        <Button onClick={handleSubmit}>전송</Button>
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
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Message = styled.div<{ sender: string }>`
  padding: 10px;
  margin: 5px;
  max-width: 70%;
  display: flex;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  word-break: break-word; // 긴 텍스트가 있을 경우 줄바꿈
  ${(props) =>
    props.sender === "user"
      ? `
    align-self: flex-end;
    background-color: yellow; 
    color: black;
  `
      : `
    align-self: flex-start;
    background-color: white; 
    color: black; 
  `}
`;

const InputArea = styled.div`
  margin-top: 20px;
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: auto;
  height: 100px;
  background-color: white;
  display: flex;
`;

const Input = styled.textarea`
  display: flex;
  padding: 10px;
  margin-right: 10px;
  width: 70%;
  align-items: flex-start;
  border: none;
`;

const Button = styled.button`
  border: none;
  display: flex;
  background-color: #fef01b;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 30px;
  border-radius: 3px;
  margin-top: 10px;
  margin-left: 20px;
`;
