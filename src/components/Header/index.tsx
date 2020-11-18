import React, { useEffect } from 'react';

import { Link, useRouteMatch } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  const { path } = useRouteMatch();

  return (
    <Container size={size}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          {path === '/' && <Link to="/import">Importar</Link>}
          {path === '/import' && <Link to="/">{`< Voltar`}</Link>}
        </nav>
      </header>
    </Container>
  );
};

export default Header;
