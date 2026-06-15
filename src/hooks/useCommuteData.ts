import { useState, useEffect } from 'react';
import type { CommuteData } from '../types';

const FUEL_PRICES: Record<string, number> = { gasoline: 2009, diesel: 2004, lpg: 1050 };
const TRANSIT_BASE = 1400;
const TRANSIT_PER_KM = 80;

const DEFAULT_DATA: CommuteData = {
  departure: '서울시 강남구',
  destination: '서울시 종로구',
  distance: 25,
  efficiency: 12,
  workdays: 5,
  parking: 10000,
  toll: 0,
  fuelType: 'gasoline',
  fuelPrice: 2009,
};

export function useCommuteData() {
  const [data, setData] = useState<CommuteData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('commutefit');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        calculateAndUpdate(parsed);
      } catch (e) {
        calculateAndUpdate({ ...DEFAULT_DATA });
      }
    } else {
      calculateAndUpdate({ ...DEFAULT_DATA });
    }
  }, []);

  const calculateAndUpdate = (input: CommuteData) => {
    const roundTrip = input.distance * 2;
    
    const carDailyFuel = (roundTrip / input.efficiency) * input.fuelPrice;
    const carDailyTotal = carDailyFuel + (input.parking || 0) + (input.toll || 0);
    const carCost = Math.round(carDailyTotal * input.workdays);

    const transitOne = TRANSIT_BASE + Math.max(0, input.distance - 10) * TRANSIT_PER_KM;
    const transitCost = Math.round(transitOne * 2 * input.workdays);

    const savings = carCost - transitCost;
    const carbon = parseFloat(((roundTrip * input.workdays * 0.21) / 1000).toFixed(1));

    const newData = { ...input, carCost, transitCost, savings, carbon };
    setData(newData);
    localStorage.setItem('commutefit', JSON.stringify(newData));
  };

  const saveData = (newData: Partial<CommuteData>) => {
    if (!data) return;
    const merged = { ...data, ...newData };
    merged.fuelPrice = FUEL_PRICES[merged.fuelType];
    calculateAndUpdate(merged as CommuteData);
  };

  return { data, saveData };
}
