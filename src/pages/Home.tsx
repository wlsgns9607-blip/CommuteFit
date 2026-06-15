import React from 'react';
import AirHero from '../components/home/AirHero';
import CostCompare from '../components/home/CostCompare';
import SavingsArea from '../components/home/SavingsArea';
import TipsArea from '../components/home/TipsArea';
import SettingsSheet from '../components/home/SettingsSheet';
import { useCommuteData } from '../hooks/useCommuteData';
import { useAirQuality } from '../hooks/useAirQuality';

interface HomeProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ showSettings, setShowSettings }) => {
  const { data, saveData } = useCommuteData();
  const { airInfo } = useAirQuality();

  return (
    <>
      <AirHero info={airInfo} />
      <CostCompare data={data} />
      <SavingsArea data={data} />
      <TipsArea worst={airInfo?.worst || 'good'} />
      <SettingsSheet 
        show={showSettings} 
        onClose={() => setShowSettings(false)} 
        data={data}
        onSave={saveData}
      />
    </>
  );
};

export default Home;
