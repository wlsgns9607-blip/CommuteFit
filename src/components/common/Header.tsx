import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 12px;
`;

const AppLogo = styled.div`
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SettingsBtn = styled.button`
  background: none;
  border: none;
  color: var(--text3);
  font-size: 22px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: var(--text);
  }
`;

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <HeaderContainer>
      <AppLogo>
        🌫️ <span>CommuteFit</span>
      </AppLogo>
      <SettingsBtn onClick={onSettingsClick} title="설정">
        ⚙️
      </SettingsBtn>
    </HeaderContainer>
  );
};

export default Header;
