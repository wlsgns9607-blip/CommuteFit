import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');

  :root {
    --bg: #0B0F1A;
    --bg2: #131A2B;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --text: #F1F5F9;
    --text2: #94A3B8;
    --text3: #475569;
    --blue: #3B82F6;
    --teal: #2DD4BF;
    --emerald: #10B981;
    --orange: #F59E0B;
    --red: #EF4444;
    --gradient: linear-gradient(135deg, #3B82F6, #2DD4BF);
    --radius: 20px;
    --radius-sm: 14px;
    --font: 'Pretendard Variable', -apple-system, sans-serif;
  }

  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }

  html { 
    scroll-behavior: smooth; 
  }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  ::-webkit-scrollbar { width: 0; }

  @media (min-width: 431px) {
    body { 
      border-left: 1px solid var(--glass-border); 
      border-right: 1px solid var(--glass-border); 
    }
  }
`;
