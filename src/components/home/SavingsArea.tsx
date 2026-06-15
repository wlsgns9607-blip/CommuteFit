import React from 'react';
import styled from 'styled-components';
import type { CommuteData } from '../../types';

const SectionTitle = styled.div`
  font-size: 17px; font-weight: 700; padding: 0 20px; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
`;
const SavingsAreaContainer = styled.div`padding: 0 20px; margin-bottom: 32px;`;
const SavingsCard = styled.div`
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(45,212,191,0.08));
  border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius); padding: 28px 24px; text-align: center;
`;
const SavingsLabel = styled.div`
  font-size: 14px; color: var(--text2); margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 6px;
`;
const SavingsAmount = styled.div`
  font-size: 40px; font-weight: 800; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
`;
const SavingsSub = styled.div`font-size: 13px; color: var(--emerald); margin-top: 10px;`;
const SavingsDetail = styled.div`display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 20px;`;
const SavingsDetailItem = styled.div`background: rgba(0,0,0,0.2); border-radius: var(--radius-sm); padding: 14px 8px; text-align: center;`;
const SdIcon = styled.div`font-size: 20px; margin-bottom: 6px;`;
const SdVal = styled.div`font-size: 16px; font-weight: 700;`;
const SdLabel = styled.div`font-size: 10px; color: var(--text3); margin-top: 4px;`;

interface Props {
  data: CommuteData | null;
}

const fmt = (n?: number) => (n ? n.toLocaleString('ko-KR') + '원' : '0원');

const SavingsArea: React.FC<Props> = ({ data }) => {
  return (
    <>
      <SectionTitle>💰 절약 현황</SectionTitle>
      <SavingsAreaContainer>
        <SavingsCard>
          <SavingsLabel>💰 이번 주 절약 예상액</SavingsLabel>
          <SavingsAmount>{fmt(data?.savings)}</SavingsAmount>
          <SavingsSub>대중교통 이용 시 절약 가능한 금액</SavingsSub>
          <SavingsDetail>
            <SavingsDetailItem>
              <SdIcon>🌳</SdIcon>
              <SdVal>{data?.carbon || 0}kg</SdVal>
              <SdLabel>탄소 절감</SdLabel>
            </SavingsDetailItem>
            <SavingsDetailItem>
              <SdIcon>🌲</SdIcon>
              <SdVal>{((data?.carbon || 0) / 6).toFixed(1)}그루</SdVal>
              <SdLabel>나무 환산</SdLabel>
            </SavingsDetailItem>
            <SavingsDetailItem>
              <SdIcon>📅</SdIcon>
              <SdVal>{data?.workdays || 5}일</SdVal>
              <SdLabel>출근일수</SdLabel>
            </SavingsDetailItem>
          </SavingsDetail>
        </SavingsCard>
      </SavingsAreaContainer>
    </>
  );
};

export default SavingsArea;
