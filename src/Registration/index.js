import React, { Component } from 'react';
import { Form, Label, Button } from 'semantic-ui-react';
import getCookie from 'js-cookie';


class Registration extends Component {
  constructor(){
    super();

    this.state = {
      username: '',
      password: '',
      email: ''
    }
  }
  handleChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const csrfCookie = getCookie('csrftoken');
    const registrationResponse = await fetch('http://localhost:8000/auth/', {
      method: 'POST',
      credentials: 'include', // this sends our session cookie with our request
      body: JSON.stringify(this.state),
      headers: {
        'X-CSRFToken': csrfCookie,
        'Content-Type': 'application/json',

      },
    });
    const parsedResponse = await registrationResponse.json();
    console.log(parsedResponse, 'parsed response');
    
    if(parsedResponse.data === 'registration successful'){
      // change our component
      alert('Congrats on registering!!!!!!!!!!!!');

      // this automatically get passed to your component as a prop
      this.props.history.push('/movies');
    } else {
      alert('registration rejected');
    }
  }
  render(){
    return (
      <div>
      
      <Form onSubmit={this.handleSubmit}>
        <Label>Username</Label>
        <Form.Input type='text' name="username" onChange={this.handleChange} />
        <Label>Password</Label>
        <Form.Input type='password' name="password" onChange={this.handleChange} />
        <Label>Email</Label>
        <Form.Input type='email' name="email" onChange={this.handleChange} />
        <Button type="Submit" color="green">Login</Button>
      </Form>
      </div>
      )
  }
}

export default Registration;
