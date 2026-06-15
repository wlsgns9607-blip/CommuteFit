import React from 'react';
import styled from 'styled-components';
import type { CommuteData } from '../../types';

const SectionTitle = styled.div`
  font-size: 17px; font-weight: 700;
  padding: 0 20px; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
`;

const CostAreaContainer = styled.div`
  padding: 0 20px; margin-bottom: 24px;
`;

const CostCard = styled.div`
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
  transition: transform 0.25s, box-shadow 0.25s;

  &:active { transform: scale(0.98); }
`;

const CostLeft = styled.div`
  display: flex; align-items: center; gap: 14px;
`;
const CostIcon = styled.div`font-size: 36px;`;
const CostLabel = styled.div`font-size: 12px; color: var(--text3);`;
const CostName = styled.div`font-size: 15px; font-weight: 600; margin-top: 2px;`;
const CostPrice = styled.div<{ $type: 'car' | 'transit' }>`
  font-size: 22px; font-weight: 800;
  color: ${({ $type }) => ($type === 'car' ? 'var(--orange)' : 'var(--teal)')};
`;

interface Props {
  data: CommuteData | null;
}

const fmt = (n?: number) => (n ? n.toLocaleString('ko-KR') + '원' : '0원');

const CostCompare: React.FC<Props> = ({ data }) => {
  return (
    <>
      <SectionTitle>📊 이동수단 비용 비교</SectionTitle>
      <CostAreaContainer>
        <CostCard>
          <CostLeft>
            <CostIcon>🚗</CostIcon>
            <div>
              <CostLabel>자가용 예상 비용 (주간)</CostLabel>
              <CostName>유류비 + 주차비 + 통행료</CostName>
            </div>
          </CostLeft>
          <CostPrice $type="car">{fmt(data?.carCost)}</CostPrice>
        </CostCard>
        <CostCard>
          <CostLeft>
            <CostIcon>🚇</CostIcon>
            <div>
              <CostLabel>대중교통 예상 비용 (주간)</CostLabel>
              <CostName>지하철 + 버스</CostName>
            </div>
          </CostLeft>
          <CostPrice $type="transit">{fmt(data?.transitCost)}</CostPrice>
        </CostCard>
      </CostAreaContainer>
    </>
  );
};

export default CostCompare;
