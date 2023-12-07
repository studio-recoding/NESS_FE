import React from "react";
import styled from "styled-components";

interface TimetableProps {
  data: { with: string; when: string; what: string }[];
}

const Timetable: React.FC<TimetableProps> = ({ data }) => {
  return (
    <Container>
      <h2>Timetable</h2>
      <StyledTable>
        <thead>
          <tr>
            <StyledHeader>With</StyledHeader>
            <StyledHeader>When</StyledHeader>
            <StyledHeader>What</StyledHeader>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <StyledRow key={index}>
              <StyledCell>{item.with}</StyledCell>
              <StyledCell>{item.when}</StyledCell>
              <StyledCell>{item.what}</StyledCell>
            </StyledRow>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default Timetable;

const Container = styled.div`
  width: 400px;
  height: 600px;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledHeader = styled.th`
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #ddd;
`;

const StyledRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const StyledCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;
