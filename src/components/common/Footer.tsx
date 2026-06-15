import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px;
  text-align: center;
  color: var(--text3);
  font-size: 12px;
  margin-top: auto;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>© 2026 CommuteFit. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
