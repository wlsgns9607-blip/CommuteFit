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
const BtnPrimary = styled.button`
  width: 100%; padding: 16px; border: none; border-radius: var(--radius-sm); background: var(--gradient); color: #fff;
  font-family: var(--font); font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: transform 0.2s;
  &:active { transform: scale(0.97); }
`;

interface Props {
  show: boolean;
  onClose: () => void;
  data: CommuteData | null;
  onSave: (newData: Partial<CommuteData>) => void;
}

const SettingsSheet: React.FC<Props> = ({ show, onClose, data, onSave }) => {
  const [formData, setFormData] = useState<Partial<CommuteData>>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data, show]);

  const handleChange = (field: keyof CommuteData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.departure || !formData.destination) return alert('출발지와 도착지를 입력해주세요.');
    if (!formData.distance || formData.distance <= 0) return alert('편도 거리를 입력해주세요.');
    if (!formData.efficiency || formData.efficiency <= 0) return alert('차량 연비를 입력해주세요.');
    
    onSave(formData);
    onClose();
  };

  return (
    <Overlay $show={show} onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <Sheet>
        <Handle />
        <SettingsTop>
          <SettingsTitle>🚗 출퇴근 정보 설정</SettingsTitle>
          <BtnClose onClick={onClose}>✕</BtnClose>
        </SettingsTop>
        
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
          <FormInput type="number" placeholder="예: 10000" min="0" value={formData.parking || ''} onChange={(e) => handleChange('parking', parseInt(e.target.value) || 0)} />
        </FormGroup>
        <FormGroup>
          <label>일일 통행료 (원, 왕복 기준)</label>
          <FormInput type="number" placeholder="예: 2000" min="0" value={formData.toll || ''} onChange={(e) => handleChange('toll', parseInt(e.target.value) || 0)} />
        </FormGroup>
        <FormGroup>
          <label>주간 출근 일수</label>
          <FormInput type="number" placeholder="예: 5" min="1" max="7" value={formData.workdays || ''} onChange={(e) => handleChange('workdays', parseInt(e.target.value) || 5)} />
        </FormGroup>

        <BtnPrimary onClick={handleSave}>저장하기</BtnPrimary>
      </Sheet>
    </Overlay>
  );
};

export default SettingsSheet;
