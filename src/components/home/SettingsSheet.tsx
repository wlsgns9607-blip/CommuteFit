import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { CommuteData } from '../../types';

const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`;
const Overlay = styled.div<{ $show: boolean }>`
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 200;
  display: ${({ $show }) => ($show ? 'flex' : 'none')}; align-items: flex-end; justify-content: center;
`;
const Sheet = styled.div`
  background: var(--bg2); border-radius: var(--radius) var(--radius) 0 0; width: 100%; max-width: 430px;
  padding: 28px 24px 40px; animation: ${slideUp} 0.35s ease; max-height: 90vh; overflow-y: auto;
`;
const Handle = styled.div`width: 36px; height: 4px; background: var(--text3); border-radius: 2px; margin: 0 auto 24px;`;
const SettingsTop = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;`;
const SettingsTitle = styled.div`font-size: 18px; font-weight: 700;`;
const BtnClose = styled.button`
  background: rgba(255,255,255,0.1); border: none; color: var(--text2); width: 36px; height: 36px; border-radius: 50%; font-size: 18px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; font-family: var(--font);
  &:hover { background: rgba(255,255,255,0.15); color: var(--text); }
`;

const RouteTabs = styled.div`
  display: flex; gap: 8px; overflow-x: auto; margin-bottom: 24px; padding-bottom: 8px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 4px; }
`;
const RouteTab = styled.button<{ $active: boolean }>`
  padding: 10px 16px; border-radius: 20px; white-space: nowrap; font-size: 13px; font-weight: 600;
  background: ${({ $active }) => ($active ? 'var(--teal)' : 'var(--glass)')};
  color: ${({ $active }) => ($active ? '#fff' : 'var(--text2)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--teal)' : 'var(--glass-border)')};
  cursor: pointer; font-family: var(--font); transition: all 0.2s;
`;
const AddTab = styled(RouteTab)`background: transparent; border-style: dashed; color: var(--text3);`

const FormGroup = styled.div`
  margin-bottom: 16px; label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 8px; }
`;
const FormInput = styled.input`
  width: 100%; padding: 14px 16px; border-radius: var(--radius-sm); background: var(--glass); border: 1px solid var(--glass-border);
  color: var(--text); font-family: var(--font); font-size: 15px; transition: border-color 0.3s;
  &:focus { outline: none; border-color: var(--teal); } &::placeholder { color: var(--text3); }
`;
const FuelOptions = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;`;
const FuelOption = styled.button<{ $active?: boolean }>`
  padding: 12px; border-radius: var(--radius-sm);
  background: ${({ $active }) => ($active ? 'rgba(45,212,191,0.1)' : 'var(--glass)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--teal)' : 'var(--glass-border)')};
  color: ${({ $active }) => ($active ? 'var(--teal)' : 'var(--text2)')};
  text-align: center; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-family: var(--font);
`;
const BtnGroup = styled.div`display: flex; gap: 8px; margin-top: 24px;`;
const BtnPrimary = styled.button`
  flex: 1; padding: 16px; border: none; border-radius: var(--radius-sm); background: var(--gradient); color: #fff;
  font-family: var(--font); font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.2s;
  &:active { transform: scale(0.97); }
`;
const BtnDelete = styled.button`
  padding: 16px; border: 1px solid var(--red); border-radius: var(--radius-sm); background: rgba(239,68,68,0.1); color: var(--red);
  font-family: var(--font); font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.2s;
  &:active { transform: scale(0.97); }
`;

const PreviewBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-top: 20px;
  margin-bottom: 8px;
`;
const PreviewTitle = styled.div`
  font-size: 13px; font-weight: 700; color: var(--teal); margin-bottom: 12px;
  display: flex; align-items: center; gap: 6px;
`;
const PreviewRow = styled.div`
  display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;
  &:last-child { margin-bottom: 0; }
`;
const PreviewLabel = styled.span`color: var(--text3);`;
const PreviewValue = styled.span<{ $color?: string }>`
  font-weight: 700; color: ${({ $color }) => $color || 'var(--text)'};
`;

interface Props {
  show: boolean;
  onClose: () => void;
  routes: CommuteData[];
  activeId: string | null;
  onSave: (newData: CommuteData) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const SettingsSheet: React.FC<Props> = ({ show, onClose, routes, activeId, onSave, onSelect, onDelete }) => {
  const [formData, setFormData] = useState<Partial<CommuteData>>({});

  useEffect(() => {
    if (show && activeId) {
      const route = routes.find(r => r.id === activeId);
      if (route) setFormData(route);
    }
  }, [show, activeId, routes]);

  const getTempCalculated = () => {
    const distance = formData.distance || 0;
    const efficiency = formData.efficiency || 12;
    const fuelType = formData.fuelType || 'gasoline';
    const parking = formData.parking || 0;
    const toll = formData.toll || 0;
    const workdays = formData.workdays || 5;

    const FUEL_PRICES: Record<string, number> = { gasoline: 2009, diesel: 2004, lpg: 1050 };
    const TRANSIT_BASE = 1400;
    const TRANSIT_PER_KM = 80;
    const fuelPrice = FUEL_PRICES[fuelType] || 2009;

    const roundTrip = distance * 2;
    const carDailyFuel = efficiency > 0 ? (roundTrip / efficiency) * fuelPrice : 0;
    const carDailyTotal = carDailyFuel + parking + toll;
    const carCost = Math.round(carDailyTotal * workdays);

    const transitOne = TRANSIT_BASE + Math.max(0, distance - 10) * TRANSIT_PER_KM;
    const transitCost = Math.round(transitOne * 2 * workdays);

    const savings = carCost - transitCost;

    return { carCost, transitCost, savings };
  };

  const tempCalc = getTempCalculated();
  const formatWon = (n: number) => n.toLocaleString('ko-KR') + '원';

  const handleChange = (field: keyof CommuteData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name) return alert('경로 이름을 입력해주세요.');
    if (!formData.departure || !formData.destination) return alert('출발지와 도착지를 입력해주세요.');
    if (!formData.distance || formData.distance <= 0) return alert('편도 거리를 입력해주세요.');
    if (!formData.efficiency || formData.efficiency <= 0) return alert('차량 연비를 입력해주세요.');
    
    if (!formData.id) {
      formData.id = 'route_' + Date.now();
    }
    
    onSave(formData as CommuteData);
    onClose();
  };
  
  const handleAdd = () => {
    setFormData({
      id: 'route_' + Date.now(),
      name: '새 경로 ' + (routes.length + 1),
      departure: '',
      destination: '',
      distance: 10,
      efficiency: 12,
      workdays: 5,
      parking: 0,
      toll: 0,
      fuelType: 'gasoline'
    });
  };

  const handleDelete = () => {
    if (confirm('이 경로를 삭제하시겠습니까?')) {
      onDelete(formData.id!);
      onClose();
    }
  };

  return (
    <Overlay $show={show} onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <Sheet>
        <Handle />
        <SettingsTop>
          <SettingsTitle>🚗 출퇴근 정보 설정</SettingsTitle>
          <BtnClose onClick={onClose}>✕</BtnClose>
        </SettingsTop>
        
        <RouteTabs>
          {routes.map(r => (
            <RouteTab 
              key={r.id} 
              $active={r.id === formData.id} 
              onClick={() => { onSelect(r.id); setFormData(r); }}
            >
              {r.name}
            </RouteTab>
          ))}
          <AddTab $active={false} onClick={handleAdd}>+ 새 경로</AddTab>
        </RouteTabs>
        
        <FormGroup>
          <label>경로 이름</label>
          <FormInput type="text" placeholder="예: 기본 출퇴근" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>출발지</label>
          <FormInput type="text" placeholder="예: 서울시 강남구" value={formData.departure || ''} onChange={(e) => handleChange('departure', e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>도착지</label>
          <FormInput type="text" placeholder="예: 서울시 종로구" value={formData.destination || ''} onChange={(e) => handleChange('destination', e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>편도 거리 (km)</label>
          <FormInput type="number" placeholder="예: 25" min="1" max="200" value={formData.distance || ''} onChange={(e) => handleChange('distance', parseFloat(e.target.value))} />
        </FormGroup>
        <FormGroup>
          <label>연료 종류</label>
          <FuelOptions>
            <FuelOption $active={formData.fuelType === 'gasoline'} onClick={() => handleChange('fuelType', 'gasoline')}>휘발유</FuelOption>
            <FuelOption $active={formData.fuelType === 'diesel'} onClick={() => handleChange('fuelType', 'diesel')}>경유</FuelOption>
            <FuelOption $active={formData.fuelType === 'lpg'} onClick={() => handleChange('fuelType', 'lpg')}>LPG</FuelOption>
          </FuelOptions>
        </FormGroup>
        <FormGroup>
          <label>차량 연비 (km/L)</label>
          <FormInput type="number" placeholder="예: 12" min="1" max="50" step="0.1" value={formData.efficiency || ''} onChange={(e) => handleChange('efficiency', parseFloat(e.target.value))} />
        </FormGroup>
        <FormGroup>
          <label>일일 주차비 (원)</label>
          <FormInput type="number" placeholder="예: 10000" min="0" value={formData.parking === undefined ? '' : formData.parking} onChange={(e) => handleChange('parking', parseInt(e.target.value) || 0)} />
        </FormGroup>
        <FormGroup>
          <label>일일 통행료 (원, 왕복 기준)</label>
          <FormInput type="number" placeholder="예: 2000" min="0" value={formData.toll === undefined ? '' : formData.toll} onChange={(e) => handleChange('toll', parseInt(e.target.value) || 0)} />
        </FormGroup>
        <FormGroup>
          <label>주간 출근 일수</label>
          <FormInput type="number" placeholder="예: 5" min="1" max="7" value={formData.workdays || ''} onChange={(e) => handleChange('workdays', parseInt(e.target.value) || 5)} />
        </FormGroup>

        <PreviewBox>
          <PreviewTitle>💡 실시간 계산 미리보기 (주간)</PreviewTitle>
          <PreviewRow>
            <PreviewLabel>🚗 자가용 비용</PreviewLabel>
            <PreviewValue $color="var(--orange)">{formatWon(tempCalc.carCost)}</PreviewValue>
          </PreviewRow>
          <PreviewRow>
            <PreviewLabel>🚇 대중교통 비용</PreviewLabel>
            <PreviewValue $color="var(--teal)">{formatWon(tempCalc.transitCost)}</PreviewValue>
          </PreviewRow>
          <PreviewRow style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '8px' }}>
            <PreviewLabel style={{ fontWeight: 700 }}>💰 절약 예상액</PreviewLabel>
            <PreviewValue $color="var(--emerald)" style={{ fontSize: '15px' }}>{formatWon(tempCalc.savings)}</PreviewValue>
          </PreviewRow>
        </PreviewBox>

        <BtnGroup>
          {routes.length > 1 && formData.id && routes.find(r=>r.id===formData.id) && (
            <BtnDelete onClick={handleDelete}>삭제</BtnDelete>
          )}
          <BtnPrimary onClick={handleSave}>저장하기</BtnPrimary>
        </BtnGroup>
      </Sheet>
    </Overlay>
  );
};

export default SettingsSheet;
