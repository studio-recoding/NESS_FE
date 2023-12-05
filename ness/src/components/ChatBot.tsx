import React, { useState } from "react";
import styled from "styled-components";
import chatMessages from "../../public/messages.json"; // messages.json 파일 임포트

const ChatContainer = styled.div`
  // 채팅 컨테이너 스타일
`;

const Message = styled.div<{ sender: string }>`
  // 메시지 스타일 (sender에 따라 다름)
`;

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatMessages.messages as ChatMessage[]
  );

  return (
    <ChatContainer>
      {messages.map((msg, index) => (
        <Message key={index} sender={msg.sender}>
          {msg.content}
        </Message>
      ))}
    </ChatContainer>
  );
};

export default ChatBot;
