import React from 'react';
import styled from 'styled-components';
import type { AirGrade } from '../../types';

const SectionTitle = styled.div`
  font-size: 17px; font-weight: 700; padding: 0 20px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
`;
const TipsAreaContainer = styled.div`padding: 0 20px; margin-bottom: 40px;`;
const TipsCard = styled.div`
  background: var(--glass); border: 1px solid var(--glass-border); border-radius: var(--radius); overflow: hidden;
`;
const TipItem = styled.div`
  padding: 14px 20px; display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text2);
  border-bottom: 1px solid var(--glass-border);
  &:last-child { border-bottom: none; }
`;
const TipIcon = styled.span`font-size: 18px; flex-shrink: 0;`;

interface Props {
  worst: AirGrade;
}

const TIPS = {
  moderate: [
    { icon: '🙂', text: '민감군은 장시간 외출을 자제하세요' },
    { icon: '🚇', text: '대중교통 이용을 고려해보세요' },
    { icon: '💧', text: '외출 후 손과 얼굴을 깨끗이 씻으세요' },
  ],
  bad: [
    { icon: '😷', text: '외출 시 마스크 착용을 권장합니다' },
    { icon: '🚇', text: '가급적 대중교통을 이용해주세요' },
    { icon: '🏠', text: '실외 활동을 자제해주세요' },
    { icon: '💧', text: '물을 자주 섭취해주세요' },
  ],
  'very-bad': [
    { icon: '🚨', text: '외출을 삼가고 실내에 머물러주세요' },
    { icon: '😷', text: '부득이 외출 시 KF94 마스크 필수' },
    { icon: '🚇', text: '반드시 대중교통을 이용해주세요' },
    { icon: '🏠', text: '창문을 닫고 공기청정기를 가동하세요' },
    { icon: '💧', text: '물과 비타민을 충분히 섭취하세요' },
  ],
};

const TipsArea: React.FC<Props> = ({ worst }) => {
  if (worst === 'good') return null;
  const list = TIPS[worst] || TIPS['bad'];

  return (
    <>
      <SectionTitle>😷 건강 수칙</SectionTitle>
      <TipsAreaContainer>
        <TipsCard>
          {list.map((tip, idx) => (
            <TipItem key={idx}><TipIcon>{tip.icon}</TipIcon> {tip.text}</TipItem>
          ))}
        </TipsCard>
      </TipsAreaContainer>
    </>
  );
};

export default TipsArea;
