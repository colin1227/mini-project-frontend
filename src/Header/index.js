import React from 'react';
import { Header, Button, Container } from 'semantic-ui-react';

import { Link } from 'react-router-dom';


const HeaderApp = (props) => {
  return (
    <Header>
      <Container>
        <Button><Link to="/">Login</Link></Button>
        <Button><Link to="/movies">Movies</Link></Button>
        <Button><Link to="/auth">Registration</Link></Button>
        <Button onClick={props.logOut}>Logout</Button>
      </Container>
    </Header>
    )
}

export default HeaderApp;
