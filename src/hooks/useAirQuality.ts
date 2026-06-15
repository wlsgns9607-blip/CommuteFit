import { useState, useEffect } from 'react';
import type { AirQualityInfo } from '../types';

const API_KEY = '71e3a27ca738072ecdb720c30dfb49900309dfd3083a5a3cac20b3f2e11db71e';
const API_ENDPOINT = 'https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo';

export function useAirQuality() {
  const [airInfo, setAirInfo] = useState<AirQualityInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAirQuality() {
      try {
        const year = new Date().getFullYear();
        const url = API_ENDPOINT + '?serviceKey=' + API_KEY + '&returnType=json&numOfRows=100&pageNo=1&year=' + year;
        
        const res = await fetch(url);
        const json = await res.json();
        const items = json.response?.body?.items || [];

        const today = new Date().toISOString().slice(0, 10);
        const activeAlarms = items.filter((it: any) => !it.clearDate || it.clearDate === '' || it.issueDate === today);
        const latest = items.length > 0 ? items[0] : null;

        if (activeAlarms.length > 0) {
          const pm10Alarm = activeAlarms.find((a: any) => a.itemCode === 'PM10');
          const pm25Alarm = activeAlarms.find((a: any) => a.itemCode === 'PM25');
          const pm10Val = pm10Alarm ? parseInt(pm10Alarm.issueVal) : 0;
          const pm25Val = pm25Alarm ? parseInt(pm25Alarm.issueVal) : 0;
          const pm10Gbn = pm10Alarm ? pm10Alarm.issueGbn : null;
          const pm25Gbn = pm25Alarm ? pm25Alarm.issueGbn : null;
          const district = activeAlarms[0].districtName || '전국';
          const region = activeAlarms[0].moveName || '';

          const worst = (pm10Gbn === '경보' || pm25Gbn === '경보') ? 'very-bad' : 'bad';
          setAirInfo({ worst, pm10Val, pm25Val, pm10Gbn, pm25Gbn, district, region });
        } else if (latest) {
          const district = latest.districtName || '전국';
          const region = latest.moveName || '';
          setAirInfo({ worst: 'good', pm10Val: 0, pm25Val: 0, pm10Gbn: null, pm25Gbn: null, district, region });
        } else {
          setAirInfo({ worst: 'good', pm10Val: 0, pm25Val: 0, pm10Gbn: null, pm25Gbn: null, district: '서울시', region: '' });
        }
      } catch (error) {
        console.error('API 호출 실패:', error);
        setAirInfo({ worst: 'good', pm10Val: 0, pm25Val: 0, pm10Gbn: null, pm25Gbn: null, district: '서울시', region: '' });
      } finally {
        setLoading(false);
      }
    }

    fetchAirQuality();
  }, []);

  return { airInfo, loading };
}
