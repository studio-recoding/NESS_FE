import React, { useState } from "react";
import styled from "styled-components";
import chatMessages from "../messages.json"; // messages.json 파일 임포트

const ChatContainer = styled.div`
  // 채팅 컨테이너 스타일
`;

const Message = styled.div<{ sender: string }>`
  // 메시지 스타일 (sender에 따라 다름)
`;

const InputArea = styled.div`
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  width: 70%;
`;

const Button = styled.button`
  padding: 10px;
`;

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatMessages.messages as ChatMessage[]
  );
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim() === "") {
      return; // 빈 입력 방지
    }
    const newUserMessage: ChatMessage = {
      sender: "user",
      content: userInput,
    };
    setMessages(messages.concat(newUserMessage));
    setUserInput(""); // 입력 필드 초기화
  };

  return (
    <div>
      <ChatContainer>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>
            {msg.content}
          </Message>
        ))}
      </ChatContainer>
      <InputArea>
        <Input type="text" value={userInput} onChange={handleInputChange} />
        <Button onClick={handleSubmit}>Send</Button>
      </InputArea>
    </div>
  );
};

export default ChatBot;
