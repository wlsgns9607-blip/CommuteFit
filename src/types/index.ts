export interface CommuteData {
  departure: string;
  destination: string;
  distance: number;
  efficiency: number;
  workdays: number;
  parking: number;
  toll: number;
  fuelType: 'gasoline' | 'diesel' | 'lpg';
  fuelPrice: number;
  carCost?: number;
  transitCost?: number;
  savings?: number;
  carbon?: number;
}

export type AirGrade = 'good' | 'moderate' | 'bad' | 'very-bad';

export interface AirQualityInfo {
  worst: AirGrade;
  pm10Val: number;
  pm25Val: number;
  pm10Gbn: string | null;
  pm25Gbn: string | null;
  district: string;
  region: string;
}
