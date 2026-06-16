// ===== CommuteFit - script.js =====
(function () {
  'use strict';

  // ===== 유류비 기준 (원/L) =====
  const FUEL_PRICES = { gasoline: 2009, diesel: 2004, lpg: 1050 };
  const TRANSIT_BASE = 1400;
  const TRANSIT_PER_KM = 80;

  // ===== 에어코리아 API =====
  const API_KEY = '71e3a27ca738072ecdb720c30dfb49900309dfd3083a5a3cac20b3f2e11db71e';
  const API_ENDPOINT = 'https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo';

  // ===== State =====
  let commuteData = null;
  let fuelType = 'gasoline';

  // ===== 기본 출퇴근 데이터 =====
  const DEFAULT_DATA = {
    departure: '서울시 강남구', destination: '서울시 종로구',
    distance: 25, efficiency: 12, workdays: 5,
    parking: 10000, toll: 0,
    fuelType: 'gasoline', fuelPrice: 2009
  };

  // ===== Init =====
  function init() {
    loadData();
    // 데이터 없으면 기본값 사용 (팝업 없이 바로 홈 표시)
    if (!commuteData) {
      commuteData = { ...DEFAULT_DATA };
      calculateAndUpdate();
    }
    setupSettings();
    generateAirQuality();
    updateCostDisplay();
    updateTime();
  }

  // ===== LocalStorage =====
  function loadData() {
    try {
      const s = localStorage.getItem('commutefit');
      if (s) commuteData = JSON.parse(s);
    } catch (e) { /* ignore */ }
  }
  function saveData() {
    localStorage.setItem('commutefit', JSON.stringify(commuteData));
  }

  // ===== 설정 Bottom Sheet =====
  function setupSettings() {
    const overlay = document.getElementById('settings-overlay');
    const btnOpen = document.getElementById('btn-settings');
    const btnSave = document.getElementById('btn-save');

    btnOpen.addEventListener('click', openSettings);
    document.getElementById('btn-close-settings').addEventListener('click', closeSettings);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSettings();
    });

    // 연료 종류 선택
    document.querySelectorAll('.fuel-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.fuel-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        fuelType = opt.dataset.fuel;
      });
    });

    // 저장
    btnSave.addEventListener('click', () => {
      const departure = document.getElementById('input-departure').value.trim();
      const destination = document.getElementById('input-destination').value.trim();
      const distance = parseFloat(document.getElementById('input-distance').value);
      const efficiency = parseFloat(document.getElementById('input-efficiency').value);
      const workdays = parseInt(document.getElementById('input-workdays').value) || 5;
      const parking = parseInt(document.getElementById('input-parking').value) || 0;
      const toll = parseInt(document.getElementById('input-toll').value) || 0;

      if (!departure || !destination) { alert('출발지와 도착지를 입력해주세요.'); return; }
      if (!distance || distance <= 0) { alert('편도 거리를 입력해주세요.'); return; }
      if (!efficiency || efficiency <= 0) { alert('차량 연비를 입력해주세요.'); return; }

      commuteData = { departure, destination, distance, efficiency, workdays, parking, toll, fuelType, fuelPrice: FUEL_PRICES[fuelType] };
      saveData();
      calculateAndUpdate();
      closeSettings();
    });

    // 기존 데이터 채우기
    if (commuteData) {
      document.getElementById('input-departure').value = commuteData.departure || '';
      document.getElementById('input-destination').value = commuteData.destination || '';
      document.getElementById('input-distance').value = commuteData.distance || '';
      document.getElementById('input-efficiency').value = commuteData.efficiency || '';
      document.getElementById('input-workdays').value = commuteData.workdays || 5;
      document.getElementById('input-parking').value = commuteData.parking || 0;
      document.getElementById('input-toll').value = commuteData.toll || 0;
      fuelType = commuteData.fuelType || 'gasoline';
      document.querySelectorAll('.fuel-option').forEach(o => {
        o.classList.toggle('active', o.dataset.fuel === fuelType);
      });
    }
  }

  function openSettings() {
    document.getElementById('settings-overlay').classList.add('show');
  }
  function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('show');
  }

  // ===== 비용 계산 =====
  function calculateAndUpdate() {
    if (!commuteData) return;
    const d = commuteData;
    const roundTrip = d.distance * 2;

    // 자가용: (왕복 연료비 + 일일 주차비 + 일일 통행료) * 주간 출근일수
    const carDailyFuel = (roundTrip / d.efficiency) * d.fuelPrice;
    const carDailyTotal = carDailyFuel + (d.parking || 0) + (d.toll || 0);
    d.carCost = Math.round(carDailyTotal * d.workdays);

    // 대중교통: (기본요금 + 거리비례) * 2(왕복) * 주간 출근일수
    const transitOne = TRANSIT_BASE + Math.max(0, d.distance - 10) * TRANSIT_PER_KM;
    d.transitCost = Math.round(transitOne * 2 * d.workdays);

    d.savings = d.carCost - d.transitCost;
    d.carbon = parseFloat((roundTrip * d.workdays * 0.21 / 1000).toFixed(1));

    saveData();
    updateCostDisplay();
  }

  function updateCostDisplay() {
    if (!commuteData || !commuteData.carCost) return;
    const d = commuteData;
    document.getElementById('cost-car').textContent = fmt(d.carCost);
    document.getElementById('cost-transit').textContent = fmt(d.transitCost);
    document.getElementById('savings-amount').textContent = fmt(d.savings);
    document.getElementById('sd-carbon').textContent = d.carbon + 'kg';
    document.getElementById('sd-trees').textContent = (d.carbon / 6).toFixed(1) + '그루';
    document.getElementById('sd-days').textContent = d.workdays + '일';
  }

  // ===== 미세먼지 API 호출 =====
  async function generateAirQuality() {
    const year = new Date().getFullYear();
    const url = API_ENDPOINT
      + '?serviceKey=' + API_KEY
      + '&returnType=json'
      + '&numOfRows=100'
      + '&pageNo=1'
      + '&year=' + year;

    try {
      const res = await fetch(url);
      const json = await res.json();
      const items = json.response?.body?.items || [];

      // 오늘 날짜 기준 활성 경보 찾기 (해제되지 않은 것 또는 오늘 발령된 것)
      const today = new Date().toISOString().slice(0, 10);
      const activeAlarms = items.filter(it => {
        // 해제 안 된 경보 or 오늘 발령된 경보
        return !it.clearDate || it.clearDate === '' || it.issueDate === today;
      });

      // 최근 경보 데이터 (가장 최신 것 사용)
      const latest = items.length > 0 ? items[0] : null;

      if (activeAlarms.length > 0) {
        // 활성 경보가 있는 경우
        renderAlarmActive(activeAlarms);
      } else if (latest) {
        // 활성 경보 없음 → 최근 경보 이력 표시
        renderAlarmClear(latest, items.length);
      } else {
        // 데이터 없음
        renderNoAlarm();
      }
    } catch (err) {
      console.error('API 호출 실패:', err);
      renderNoAlarm();
    }
  }

  // ===== 활성 경보 표시 =====
  function renderAlarmActive(alarms) {
    // PM10, PM25 경보 각각 확인
    const pm10Alarm = alarms.find(a => a.itemCode === 'PM10');
    const pm25Alarm = alarms.find(a => a.itemCode === 'PM25');

    const pm10Val = pm10Alarm ? parseInt(pm10Alarm.issueVal) : 0;
    const pm25Val = pm25Alarm ? parseInt(pm25Alarm.issueVal) : 0;
    const pm10Gbn = pm10Alarm ? pm10Alarm.issueGbn : null;
    const pm25Gbn = pm25Alarm ? pm25Alarm.issueGbn : null;
    const district = alarms[0].districtName || '전국';
    const region = alarms[0].moveName || '';

    // 등급 결정
    const worst = (pm10Gbn === '경보' || pm25Gbn === '경보') ? 'very-bad' : 'bad';
    updateAirUI(worst, pm10Val, pm25Val, pm10Gbn, pm25Gbn, district, region);
  }

  // ===== 경보 해제 상태 =====
  function renderAlarmClear(latest, totalCount) {
    const district = latest.districtName || '전국';
    const region = latest.moveName || '';
    // 경보 해제 → 좋음 상태
    updateAirUI('good', 0, 0, null, null, district, region);
  }

  // ===== 데이터 없음 =====
  function renderNoAlarm() {
    updateAirUI('good', 0, 0, null, null, '서울시', '');
  }

  // ===== 공통 UI 업데이트 =====
  function updateAirUI(worst, pm10Val, pm25Val, pm10Gbn, pm25Gbn, district, region) {
    const info = {
      'good': { emoji: '😊', grade: '좋음', desc: '현재 미세먼지 경보가 없습니다' },
      'moderate': { emoji: '🙂', grade: '보통', desc: '민감군은 장시간 외출을 자제하세요' },
      'bad': { emoji: '😷', grade: '주의보 발령', desc: '미세먼지 주의보가 발령되었습니다' },
      'very-bad': { emoji: '🤢', grade: '경보 발령', desc: '미세먼지 경보가 발령되었습니다' },
    }[worst];

    // Hero 업데이트
    const hero = document.getElementById('air-hero');
    hero.className = 'air-hero ' + worst;
    document.getElementById('air-emoji').textContent = info.emoji;
    document.getElementById('air-grade').textContent = info.grade;
    document.getElementById('air-desc').textContent = info.desc;
    document.getElementById('air-region').textContent = district + (region ? ' ' + region : '');

    // PM10
    document.getElementById('pm10-val').textContent = pm10Val || '-';
    const pm10b = document.getElementById('pm10-badge');
    if (pm10Gbn) {
      pm10b.textContent = pm10Gbn;
      pm10b.className = 'badge badge-' + (pm10Gbn === '경보' ? 'very-bad' : 'bad');
    } else {
      pm10b.textContent = '경보 없음';
      pm10b.className = 'badge badge-good';
    }

    // PM2.5
    document.getElementById('pm25-val').textContent = pm25Val || '-';
    const pm25b = document.getElementById('pm25-badge');
    if (pm25Gbn) {
      pm25b.textContent = pm25Gbn;
      pm25b.className = 'badge badge-' + (pm25Gbn === '경보' ? 'very-bad' : 'bad');
    } else {
      pm25b.textContent = '경보 없음';
      pm25b.className = 'badge badge-good';
    }

    // 추천
    const rec = document.getElementById('air-recommend');
    if (worst === 'good' || worst === 'moderate') {
      rec.innerHTML = '🚶 현재 <strong>&nbsp;미세먼지 경보가 없습니다</strong> — 쾌적한 하루!';
    } else {
      rec.innerHTML = '🌍 <strong>대기질이 좋지 않습니다.</strong> 자가용 이용을 줄이면 환경에 큰 도움이 됩니다.';
    }

    // 건강 수칙
    const tipsTitle = document.getElementById('tips-title');
    const tipsArea = document.getElementById('tips-area');
    if (worst === 'good') {
      tipsTitle.style.display = 'none';
      tipsArea.style.display = 'none';
    } else {
      tipsTitle.style.display = '';
      tipsArea.style.display = '';
      const tips = {
        'moderate': [
          { icon: '🙂', text: '민감군은 장시간 외출을 자제하세요' },
          { icon: '🚇', text: '대중교통 이용을 고려해보세요' },
          { icon: '💧', text: '외출 후 손과 얼굴을 깨끗이 씻으세요' },
        ],
        'bad': [
          { icon: '😷', text: '외출 시 마스크 착용을 권장합니다' },
          { icon: '🚇', text: '자가용 이용을 줄이면 배출가스를 줄이는 데 도움이 됩니다' },
          { icon: '🏠', text: '실외 활동을 자제해주세요' },
          { icon: '💧', text: '물을 자주 섭취해주세요' },
        ],
        'very-bad': [
          { icon: '🚨', text: '외출을 삼가고 실내에 머물러주세요' },
          { icon: '😷', text: '부득이 외출 시 KF94 마스크 필수' },
          { icon: '🚇', text: '대중교통을 이용해 쾌적한 대기 환경 만들기에 동참해주세요' },
          { icon: '🏠', text: '창문을 닫고 공기청정기를 가동하세요' },
          { icon: '💧', text: '물과 비타민을 충분히 섭취하세요' },
        ],
      };
      const tipsList = tips[worst] || tips['bad'];
      const card = document.getElementById('tips-card');
      card.innerHTML = tipsList.map(t =>
        '<div class="tip-item"><span class="tip-icon">' + t.icon + '</span> ' + t.text + '</div>'
      ).join('');
    }
  }




  // ===== 시간 표시 =====
  function updateTime() {
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h < 12 ? '오전' : '오후';
    const h12 = h % 12 || 12;
    document.getElementById('air-time').textContent = ampm + ' ' + h12 + ':' + m + ' 기준';
  }

  // ===== Util =====
  function fmt(n) { return n.toLocaleString('ko-KR') + '원'; }

  // ===== Start =====
  document.addEventListener('DOMContentLoaded', init);
})();
