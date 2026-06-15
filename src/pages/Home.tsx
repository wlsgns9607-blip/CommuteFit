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

interface HomeProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ showSettings, setShowSettings }) => {
  const { routes, activeRoute, activeId, saveRoute, changeActiveRoute, deleteRoute } = useCommuteData();
  const { airInfo } = useAirQuality();

  return (
    <>
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
