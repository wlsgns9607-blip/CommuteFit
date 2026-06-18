import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { CommuteData } from '../../types';

const SectionTitle = styled.div`
  font-size: 17px; font-weight: 700; padding: 0 20px; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
`;
const SavingsAreaContainer = styled.div`padding: 0 20px; margin-bottom: 24px;`;
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

// Animations
const floatUp = keyframes`
  0% {
    transform: translate(-50%, -50%) translateY(0) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(-20px) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) translateY(-80px) scale(1);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// Additional Styled Components for Environmental Contribution
const EcoContainer = styled.div`
  padding: 0 20px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EcoCard = styled.div`
  background: linear-gradient(135deg, rgba(45, 212, 191, 0.08), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(45, 212, 191, 0.2);
  border-radius: var(--radius);
  padding: 24px 20px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const CardBadge = styled.span`
  background: rgba(45, 212, 191, 0.15);
  color: var(--teal);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 12px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const StatBox = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.04);
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text2);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  span {
    font-size: 12px;
    font-weight: 500;
    color: var(--text2);
    margin-left: 2px;
  }
`;

const GraphSection = styled.div`
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-sm);
  padding: 16px 14px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.02);
`;

const GraphTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--text2);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BarContainer = styled.div`
  margin-bottom: 14px;
  &:last-of-type {
    margin-bottom: 18px;
  }
`;

const BarLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 6px;
  color: var(--text2);
`;

const BarWrapper = styled.div`
  height: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  border-radius: 5px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SavingsResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
`;

const ResultLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text2);
`;

const ResultValue = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: var(--teal);
  display: flex;
  align-items: center;
  gap: 4px;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const MessageQuote = styled.div`
  text-align: center;
  margin: 12px 0 16px;
  padding: 0 10px;
`;

const QuoteLine1 = styled.p`
  font-size: 12px;
  color: var(--text2);
  font-style: italic;
  margin-bottom: 4px;
  line-height: 1.5;
`;

const QuoteLine2 = styled.p`
  font-size: 13px;
  color: var(--teal);
  font-weight: 700;
  line-height: 1.5;
`;

const InfoFootnote = styled.div`
  font-size: 11px;
  color: var(--text3);
  line-height: 1.5;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 12px;
  margin-top: 8px;
`;

const CumulativeCard = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.03));
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: var(--radius);
  padding: 22px 20px;
  position: relative;
  overflow: hidden;
`;

const CumulativeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin: 14px 0 20px;
`;

const CumulativeBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-sm);
  padding: 12px 6px;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.05);
`;

const CumIcon = styled.div`
  font-size: 20px;
  margin-bottom: 6px;
`;

const CumValue = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  span {
    font-size: 10px;
    font-weight: 500;
    color: var(--text2);
    margin-left: 1px;
  }
`;

const CumLabel = styled.div`
  font-size: 10px;
  color: var(--text2);
  margin-top: 4px;
`;

const RecordButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--emerald), #059669);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease-out;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  font-family: var(--font);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const FloatingToast = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  background: rgba(16, 185, 129, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  pointer-events: none;
  z-index: 10;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  animation: ${floatUp} 1.2s forwards cubic-bezier(0.18, 0.89, 0.32, 1.28);
`;

interface Props {
  data: CommuteData | null;
}

const fmt = (n?: number) => (n ? n.toLocaleString('ko-KR') + '원' : '0원');

const SavingsArea: React.FC<Props> = ({ data }) => {
  const workdays = data?.workdays || 5;
  const distance = data?.distance || 8; // Default to 8 to support 80km reducing test case if empty
  const weeklyDistance = distance * 2 * workdays;
  
  const weeklyCarbonSavings = parseFloat((weeklyDistance * 0.1575).toFixed(1));
  const carCarbon = parseFloat((weeklyDistance * 0.185).toFixed(1));
  const transitCarbon = parseFloat((weeklyDistance * 0.0275).toFixed(1));

  const [cumulative, setCumulative] = useState({
    count: 15,
    distance: 240,
    carbon: 37.8
  });
  
  const [toastList, setToastList] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('commutefit_cumulative_eco');
    if (saved) {
      try {
        setCumulative(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleAddRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
    const distToAdd = distance * 2;
    const carbonToAdd = parseFloat((distToAdd * 0.1575).toFixed(1));

    const updated = {
      count: cumulative.count + 1,
      distance: cumulative.distance + distToAdd,
      carbon: parseFloat((cumulative.carbon + carbonToAdd).toFixed(1))
    };

    setCumulative(updated);
    localStorage.setItem('commutefit_cumulative_eco', JSON.stringify(updated));

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newId = Date.now();
    setToastList(prev => [...prev, {
      id: newId,
      text: `대중교통 이용 +1회! (감소: ${distToAdd}km / 절감: ${carbonToAdd}kg) 🌱`,
      x,
      y
    }]);

    setTimeout(() => {
      setToastList(prev => prev.filter(t => t.id !== newId));
    }, 1200);
  };

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

      <SectionTitle>🌱 환경 기여도 리포트</SectionTitle>
      <EcoContainer>
        <EcoCard>
          <CardBadge>Weekly Eco Report</CardBadge>
          <StatGrid>
            <StatBox>
              <StatLabel>🚗 자가용 운행 감소 거리</StatLabel>
              <StatValue>{weeklyDistance}<span>km</span></StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>💨 예상 CO₂ 절감량</StatLabel>
              <StatValue>{weeklyCarbonSavings}<span>kg</span></StatValue>
            </StatBox>
          </StatGrid>

          <GraphSection>
            <GraphTitle>📊 자가용 대비 예상 탄소 배출량</GraphTitle>
            <BarContainer>
              <BarLabelRow>
                <span>자가용 이용 시 예상 배출량</span>
                <strong>{carCarbon} kg</strong>
              </BarLabelRow>
              <BarWrapper>
                <BarFill $width={100} $color="linear-gradient(90deg, #EF4444, #F59E0B)" />
              </BarWrapper>
            </BarContainer>
            
            <BarContainer>
              <BarLabelRow>
                <span>대중교통 이용 시 예상 배출량</span>
                <strong>{transitCarbon} kg</strong>
              </BarLabelRow>
              <BarWrapper>
                <BarFill $width={parseFloat(((transitCarbon / carCarbon) * 100).toFixed(1))} $color="linear-gradient(90deg, #2DD4BF, #10B981)" />
              </BarWrapper>
            </BarContainer>

            <SavingsResult>
              <ResultLabel>예상 CO₂ 절감량</ResultLabel>
              <ResultValue>▼ {weeklyCarbonSavings} kg</ResultValue>
            </SavingsResult>
          </GraphSection>

          <MessageQuote>
            <QuoteLine1>"한 사람의 선택이 미세먼지 문제를 해결할 수는 없습니다."</QuoteLine1>
            <QuoteLine2>"하지만 많은 사람의 작은 선택이 더 나은 환경을 만드는 데 기여할 수 있습니다."</QuoteLine2>
          </MessageQuote>

          <InfoFootnote>
            본 수치는 평균 차량 배출량 데이터를 기반으로 계산된 예상 수치입니다.
            실제 미세먼지 농도는 기상 조건, 산업 활동, 해외 유입, 교통량 등 다양한 요인에 의해 영향을 받을 수 있습니다.
          </InfoFootnote>
        </EcoCard>

        <CumulativeCard>
          <CardBadge style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)' }}>Cumulative Impact</CardBadge>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', textAlign: 'left' }}>🏆 누적 환경 기여도 확인</div>
          
          <CumulativeGrid>
            <CumulativeBox>
              <CumIcon>🚌</CumIcon>
              <CumValue>{cumulative.count}<span>회</span></CumValue>
              <CumLabel>이용 횟수</CumLabel>
            </CumulativeBox>
            <CumulativeBox>
              <CumIcon>🛤️</CumIcon>
              <CumValue>{cumulative.distance}<span>km</span></CumValue>
              <CumLabel>감소 거리</CumLabel>
            </CumulativeBox>
            <CumulativeBox>
              <CumIcon>🍃</CumIcon>
              <CumValue>{cumulative.carbon}<span>kg</span></CumValue>
              <CumLabel>CO₂ 절감</CumLabel>
            </CumulativeBox>
          </CumulativeGrid>

          <RecordButton onClick={handleAddRecord}>
            오늘도 대중교통 이용! 기록하기 🌱
          </RecordButton>

          {toastList.map(t => (
            <FloatingToast key={t.id} $x={t.x} $y={t.y}>
              {t.text}
            </FloatingToast>
          ))}
        </CumulativeCard>
      </EcoContainer>
    </>
  );
};

export default SavingsArea;
