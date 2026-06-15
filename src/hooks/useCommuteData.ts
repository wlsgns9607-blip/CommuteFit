import { useState, useEffect } from 'react';
import type { CommuteData } from '../types';

const FUEL_PRICES: Record<string, number> = { gasoline: 2009, diesel: 2004, lpg: 1050 };
const TRANSIT_BASE = 1400;
const TRANSIT_PER_KM = 80;

const DEFAULT_ROUTE: CommuteData = {
  id: 'route_1',
  name: '기본 출퇴근',
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
  const [routes, setRoutes] = useState<CommuteData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const savedRoutes = localStorage.getItem('commutefit_routes');
    const savedActiveId = localStorage.getItem('commutefit_active_id');
    
    if (savedRoutes) {
      try {
        const parsed = JSON.parse(savedRoutes);
        if (parsed && parsed.length > 0) {
          setRoutes(parsed);
          setActiveId(savedActiveId || parsed[0].id);
        } else {
          throw new Error('No routes');
        }
      } catch (e) {
        const initialRoute = calculateCost(DEFAULT_ROUTE);
        setRoutes([initialRoute]);
        setActiveId(initialRoute.id);
      }
    } else {
      const initialRoute = calculateCost(DEFAULT_ROUTE);
      setRoutes([initialRoute]);
      setActiveId(initialRoute.id);
    }
  }, []);

  const calculateCost = (input: CommuteData): CommuteData => {
    const roundTrip = input.distance * 2;
    const carDailyFuel = (roundTrip / input.efficiency) * input.fuelPrice;
    const carDailyTotal = carDailyFuel + (input.parking || 0) + (input.toll || 0);
    const carCost = Math.round(carDailyTotal * input.workdays);

    const transitOne = TRANSIT_BASE + Math.max(0, input.distance - 10) * TRANSIT_PER_KM;
    const transitCost = Math.round(transitOne * 2 * input.workdays);

    const savings = carCost - transitCost;
    const carbon = parseFloat(((roundTrip * input.workdays * 0.21) / 1000).toFixed(1));

    return { ...input, carCost, transitCost, savings, carbon };
  };

  const saveRoute = (updatedRoute: CommuteData) => {
    updatedRoute.fuelPrice = FUEL_PRICES[updatedRoute.fuelType] || 2009;
    const calculated = calculateCost(updatedRoute);
    
    let newRoutes = [...routes];
    const idx = newRoutes.findIndex(r => r.id === updatedRoute.id);
    if (idx >= 0) {
      newRoutes[idx] = calculated;
    } else {
      newRoutes.push(calculated);
    }
    
    setRoutes(newRoutes);
    localStorage.setItem('commutefit_routes', JSON.stringify(newRoutes));
    
    if (!activeId || idx < 0) {
      changeActiveRoute(calculated.id);
    }
  };

  const deleteRoute = (id: string) => {
    if (routes.length <= 1) {
      alert('최소 1개의 경로는 남겨두어야 합니다.');
      return;
    }
    const newRoutes = routes.filter(r => r.id !== id);
    setRoutes(newRoutes);
    localStorage.setItem('commutefit_routes', JSON.stringify(newRoutes));
    if (activeId === id) {
      changeActiveRoute(newRoutes[0].id);
    }
  };

  const changeActiveRoute = (id: string) => {
    setActiveId(id);
    localStorage.setItem('commutefit_active_id', id);
  };

  const activeRoute = routes.find(r => r.id === activeId) || routes[0] || null;

  return { routes, activeRoute, activeId, saveRoute, changeActiveRoute, deleteRoute };
}
