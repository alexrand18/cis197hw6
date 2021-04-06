/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import s from 'styled-components'
import '../App.css'

// eslint-disable-next-line react/prop-types
const Signup = ({ signingUp }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const signUpUser = async e => {
    e.preventDefault()
    const { data } = await axios.post('/account/signup', { username, password })
    if (data === 'success') history.push('/')
    else {
      // eslint-disable-next-line no-alert
      alert('There was an error signing up')
      setUsername('')
      setPassword('')
    }
  }

  const loginUser = async e => {
    e.preventDefault()
    const { data } = await axios.post('/account/login', { username, password })
    if (data === 'success') history.push('/')
    else {
      // eslint-disable-next-line no-alert
      alert('There was an error logging in')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="container-body">
      <div className="signup centered">
        {signingUp && (<h1>Sign Up</h1>)}
        {!signingUp && (<h1>Login</h1>)}
        <Form>
          <Form.Group controlId="username">
            <Form.Label>Username:</Form.Label>
            <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          {signingUp && (<Button className="signupButton" onClick={e => signUpUser(e)}>Sign Up</Button>)}
          {!signingUp && (<Button className="signupButton" onClick={e => loginUser(e)}>Login</Button>)}
        </Form>
        <div className="container">
          {signingUp && (
          <div className="loginText">
            {' '}
            Already have an account? Log in
            {' '}
            <Link to="/login">here!</Link>
          </div>
          )}
          {!signingUp && (
          <div className="loginText">
            Dont have an account? Sign up
            {' '}
            <Link to="/signup">here!</Link>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup
