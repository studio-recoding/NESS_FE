import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import chatMessages from "../messages.json"; // messages.json 파일 임포트
import TimeTable from "./TimeTable";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}
interface TimetableData {
  with: string;
  when: string;
  what: string;
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
  const [timetableData, setTimetableData] = useState<TimetableData[]>([]); // 배열로 초기화

  const handleCleanupClick = (message: ChatMessage) => {
    try {
      const data = JSON.parse(message.content);
      setTimetableData((prevData) => [...prevData, data]);
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
    }
  };

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

  const isJsonMessage = (content: string) => {
    try {
      JSON.parse(content);
      console.log("isJson");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
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
      <TimeTable data={timetableData} />
      <ChatBotContainer>
        <ChatContainer>
          {messages.map((msg, index) => (
            <MessageContainer key={index} sender={msg.sender}>
              <Message key={index} sender={msg.sender}>
                {msg.content}
              </Message>
              {isJsonMessage(msg.content) && (
                <CleanupButton
                  onClick={() =>
                    handleCleanupClick({ sender: "bot", content: msg.content })
                  }
                >
                  정리
                </CleanupButton>
              )}
            </MessageContainer>
          ))}
          {tempMessage && (
            <MessageContainer sender={"bot"}>
              <Message sender={"bot"}>{tempMessage}</Message>
              {isJsonMessage(tempMessage) && (
                <CleanupButton
                  onClick={() =>
                    handleCleanupClick({ sender: "bot", content: tempMessage })
                  }
                >
                  정리
                </CleanupButton>
              )}
            </MessageContainer>
          )}
        </ChatContainer>
        <InputArea>
          <Input value={userInput} onChange={handleInputChange}></Input>
          <Button onClick={handleSubmit}>전송</Button>
        </InputArea>
      </ChatBotContainer>
    </Container>
  );
};

export default ChatBot;

const Container = styled.div`
  display: flex;
  margin: auto;
  flex-direction: row;
  position: relative;

  gap: 50px;
`;

const ChatBotContainer = styled.div`
  width: 400px;
  height: 600px;
  display: flex;
  margin: auto;
  border-radius: 5px;
  flex-direction: column;
  position: relative;
  background-color: #9bbbd4;
  overflow: auto;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;

  margin-bottom: 100px;
`;

const Message = styled.div<{ sender: string }>`
  padding: 10px;
  margin: 5px;
  max-width: 70%;
  display: flex;
  border: none;
  border-radius: 10px;
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

const MessageContainer = styled.div<{ sender: string }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${(props) =>
    props.sender === "user" ? "flex-end" : "flex-start"};
`;

const CleanupButton = styled.button`
  margin-left: 10px;
  width: 50px;
  height: 40px;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;
