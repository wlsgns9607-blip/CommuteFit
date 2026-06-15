import React from 'react';
import styled from 'styled-components';
import AirHero from '../components/home/AirHero';
import CostCompare from '../components/home/CostCompare';
import SavingsArea from '../components/home/SavingsArea';
import TipsArea from '../components/home/TipsArea';
import SettingsSheet from '../components/home/SettingsSheet';
import { useCommuteData } from '../hooks/useCommuteData';
import { useAirQuality } from '../hooks/useAirQuality';

const RouteSelector = styled.div`
  margin: 16px 20px 8px;
  display: flex; gap: 8px; overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

const RoutePill = styled.button<{ $active: boolean }>`
  padding: 8px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap;
  background: ${({ $active }) => ($active ? 'var(--teal)' : 'var(--glass)')};
  color: ${({ $active }) => ($active ? '#fff' : 'var(--text2)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--teal)' : 'var(--glass-border)')};
  cursor: pointer; font-family: var(--font); transition: all 0.2s;
`;

const NoticeBar = styled.div`
  margin: 16px 20px 8px;
  padding: 12px 16px;
  background: rgba(45, 212, 191, 0.1);
  border: 1px solid rgba(45, 212, 191, 0.3);
  border-radius: var(--radius-sm);
  color: var(--teal);
  font-size: 13px; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(45, 212, 191, 0); }
    100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); }
  }
`;

interface HomeProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ showSettings, setShowSettings }) => {
  const { routes, activeRoute, activeId, saveRoute, changeActiveRoute, deleteRoute } = useCommuteData();
  const { airInfo } = useAirQuality();

  return (
    <>
      <NoticeBar>📢 우리나라 미세먼지를 줄여보아요!! 대중교통을 이용해봅시다!!</NoticeBar>
      <AirHero info={airInfo} />
      
      {routes.length > 1 && (
        <RouteSelector>
          {routes.map(r => (
            <RoutePill 
              key={r.id} 
              $active={r.id === activeId}
              onClick={() => changeActiveRoute(r.id)}
            >
              🚗 {r.name}
            </RoutePill>
          ))}
        </RouteSelector>
      )}

      <CostCompare data={activeRoute} />
      <SavingsArea data={activeRoute} />
      <TipsArea worst={airInfo?.worst || 'good'} />
      
      <SettingsSheet 
        show={showSettings} 
        onClose={() => setShowSettings(false)} 
        routes={routes}
        activeId={activeId}
        onSave={saveRoute}
        onSelect={changeActiveRoute}
        onDelete={deleteRoute}
      />
    </>
  );
};

export default Home;
