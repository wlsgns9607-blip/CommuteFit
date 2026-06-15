import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { AirQualityInfo } from '../../types';

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

const HeroContainer = styled.section<{ $worst: string }>`
  margin: 8px 20px 20px;
  border-radius: var(--radius);
  padding: 28px 24px 24px;
  position: relative;
  overflow: hidden;
  transition: background 0.5s, border-color 0.5s;

  background: ${({ $worst }) =>
    $worst === 'very-bad' ? 'linear-gradient(160deg, rgba(239,68,68,0.2) 0%, rgba(245,158,11,0.08) 100%)' :
    $worst === 'bad' ? 'linear-gradient(160deg, rgba(245,158,11,0.2) 0%, rgba(234,179,8,0.08) 100%)' :
    $worst === 'moderate' ? 'linear-gradient(160deg, rgba(59,130,246,0.2) 0%, rgba(45,212,191,0.08) 100%)' :
    'linear-gradient(160deg, rgba(16,185,129,0.2) 0%, rgba(45,212,191,0.08) 100%)'};
  
  border: 1px solid ${({ $worst }) =>
    $worst === 'very-bad' ? 'rgba(239,68,68,0.25)' :
    $worst === 'bad' ? 'rgba(245,158,11,0.25)' :
    $worst === 'moderate' ? 'rgba(59,130,246,0.25)' :
    'rgba(16,185,129,0.25)'};

  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 180px; height: 180px;
    border-radius: 50%;
    transition: background 0.5s;
    background: ${({ $worst }) =>
      $worst === 'very-bad' ? 'radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)' :
      $worst === 'bad' ? 'radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)' :
      $worst === 'moderate' ? 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)' :
      'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)'};
  }
`;

const AirTop = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 20px; position: relative; z-index: 1;
`;
const AirLocation = styled.div`
  font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 6px;
  strong { color: var(--text); }
`;
const AirTime = styled.div`
  font-size: 11px; color: var(--text3);
`;

const AirStatusMain = styled.div`
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 24px; position: relative; z-index: 1;
`;
const AirEmoji = styled.div`
  font-size: 56px; line-height: 1; animation: ${breathe} 3s ease-in-out infinite;
`;
const AirMainText = styled.div``;
const AirGrade = styled.div`
  font-size: 32px; font-weight: 800; line-height: 1.2;
`;
const AirDesc = styled.div`
  font-size: 14px; color: var(--text2); margin-top: 4px;
`;

const AirValues = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  margin-bottom: 20px; position: relative; z-index: 1;
`;
const AirValCard = styled.div`
  background: rgba(0,0,0,0.25);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
`;
const Label = styled.div`
  font-size: 11px; color: var(--text3); margin-bottom: 6px; letter-spacing: 0.5px;
`;
const NumRow = styled.div`
  display: flex; align-items: baseline; gap: 6px;
`;
const Num = styled.span`
  font-size: 28px; font-weight: 800; line-height: 1;
`;
const Unit = styled.span`
  font-size: 12px; color: var(--text3);
`;
const Badge = styled.span<{ $status: string }>`
  display: inline-block; margin-top: 8px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 700;
  
  background: ${({ $status }) =>
    $status === 'very-bad' ? 'rgba(239,68,68,0.2)' :
    $status === 'bad' ? 'rgba(245,158,11,0.2)' :
    $status === 'moderate' ? 'rgba(59,130,246,0.2)' :
    'rgba(16,185,129,0.2)'};
  color: ${({ $status }) =>
    $status === 'very-bad' ? 'var(--red)' :
    $status === 'bad' ? 'var(--orange)' :
    $status === 'moderate' ? 'var(--blue)' :
    'var(--emerald)'};
`;

const AirRecommend = styled.div`
  background: rgba(0,0,0,0.3);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  font-size: 14px; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  position: relative; z-index: 1;
`;

interface Props {
  info: AirQualityInfo | null;
}

const UI_INFO: Record<string, {emoji: string, grade: string, desc: string}> = {
  good: { emoji: '😊', grade: '좋음', desc: '현재 미세먼지 경보가 없습니다' },
  moderate: { emoji: '🙂', grade: '보통', desc: '민감군은 장시간 외출을 자제하세요' },
  bad: { emoji: '😷', grade: '주의보 발령', desc: '미세먼지 주의보가 발령되었습니다' },
  'very-bad': { emoji: '🤢', grade: '경보 발령', desc: '미세먼지 경보가 발령되었습니다' },
};

const AirHero: React.FC<Props> = ({ info }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h < 12 ? '오전' : '오후';
      h = h % 12 || 12;
      setCurrentTime(ampm + ' ' + h + ':' + m + ' 기준');
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const worst = info?.worst || 'good';
  const ui = UI_INFO[worst];
  const locationText = info ? (info.district + ' ' + info.region).trim() : '서울시';

  return (
    <HeroContainer $worst={worst}>
      <AirTop>
        <AirLocation>📍 현재 <strong>{locationText}</strong></AirLocation>
        <AirTime>{currentTime}</AirTime>
      </AirTop>
      <AirStatusMain>
        <AirEmoji>{ui.emoji}</AirEmoji>
        <AirMainText>
          <AirGrade>{ui.grade}</AirGrade>
          <AirDesc>{ui.desc}</AirDesc>
        </AirMainText>
      </AirStatusMain>
      <AirValues>
        <AirValCard>
          <Label>미세먼지 PM10</Label>
          <NumRow>
            <Num>{info?.pm10Val || '-'}</Num>
            <Unit>㎍/㎥</Unit>
          </NumRow>
          {info?.pm10Gbn ? (
            <Badge $status={info.pm10Gbn === '경보' ? 'very-bad' : 'bad'}>{info.pm10Gbn}</Badge>
          ) : (
            <Badge $status="good">경보 없음</Badge>
          )}
        </AirValCard>
        <AirValCard>
          <Label>초미세먼지 PM2.5</Label>
          <NumRow>
            <Num>{info?.pm25Val || '-'}</Num>
            <Unit>㎍/㎥</Unit>
          </NumRow>
          {info?.pm25Gbn ? (
            <Badge $status={info.pm25Gbn === '경보' ? 'very-bad' : 'bad'}>{info.pm25Gbn}</Badge>
          ) : (
            <Badge $status="good">경보 없음</Badge>
          )}
        </AirValCard>
      </AirValues>
      <AirRecommend>
        {worst === 'good' || worst === 'moderate' ? (
          <>🚶 현재 <strong>&nbsp;미세먼지 경보가 없습니다</strong> — 쾌적한 하루!</>
        ) : (
          <>🚇 오늘은 <strong>&nbsp;대중교통 이용</strong>을 권장합니다</>
        )}
      </AirRecommend>
    </HeroContainer>
  );
};

export default AirHero;
