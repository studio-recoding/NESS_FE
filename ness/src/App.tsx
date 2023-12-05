import React from "react";
import ChatBot from "./components/ChatBot";
import styled from "styled-components";

const App: React.FC = () => {
  return (
    <Container>
      <ChatBot />
    </Container>
  );
};

const Container = styled.div`
  background-color: #f9f9f9;
  height: 100vw;
  display: flex;
`;

export default App;
