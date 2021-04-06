/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import { Form, Modal } from 'react-bootstrap'
import '../App.css'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000')

const Home = () => {
  const [question, setQuestion] = useState({})
  const [questions, setQuestions] = useState([])
  const [loggedIn, setLoggedIn] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [inputQuestion, setInputQuestion] = useState('')
  const [inputAnswer, setInputAnswer] = useState('')

  const history = useHistory()

  useEffect(async () => {
    const { data } = await axios.get('/api/loggedIn')
    setLoggedIn(data)
    const res = await axios.get('/api/questions')
    setQuestions(res.data)
    if (res.data.length > 0) setQuestion(res.data[0])
  }, [])

  useEffect(() => {
    socket.on('getNewQuestion', q => {
      setQuestions([...questions, q])
    })
    socket.on('getNewAnswer', info => {
      const clone = [...questions]
      clone.forEach((q, index) => {
        if (q._id === info._id) {
          clone[index].answer = info.answer
        }
      })
      setQuestions(clone)
    })
  }, [questions])

  useEffect(() => {
    socket.on('getNewAnswer', info => {
      if (info._id === question._id) setQuestion({ ...question, answer: info.answer })
    })
  }, [question])

  const sendToLogin = e => {
    history.push('/login')
  }

  const logoutUser = async e => {
    await axios.post('/account/logout')
    history.push('/login')
  }

  const addQuestion = async e => {
    e.preventDefault()
    const { data } = await axios.post('/api/questions/add', { questionText: inputQuestion })
    socket.emit('addNewQuestion', data)
    setInputQuestion('')
    setIsAdding(false)
    setQuestions([...questions, data])
  }

  const submitAnswer = async e => {
    e.preventDefault()
    await axios.post('/api/questions/answer', { _id: question._id, answer: inputAnswer })
    setQuestion({ ...question, answer: inputAnswer })
    questions.forEach((q, indx) => {
      if (q._id === question._id) {
        const clone = [...questions]
        clone[indx].answer = inputAnswer
        setQuestions(clone)
      }
    })
    const info = { _id: question._id, answer: inputAnswer }
    socket.emit('answeredQuestion', info)
    setInputAnswer('')
  }
  return (
    <div>
      <div className="fullHeight">
        <div className="topBar d-flex justify-content-between">
          <div className="header"><p className="header">Campuswire Lite</p></div>
          <div />
          {loggedIn !== null && loggedIn !== '' && (
          <div>
            {`Hi ${loggedIn}!`}
            <div onClick={e => (logoutUser(e))}>Log out</div>
          </div>
          )}
        </div>
        <div className="questionContainer container-fluid">
          <div className="row">
            <div className="col col-md-4 col-lg-4 col-xl-4 questionsList wf">
              {(loggedIn === null || loggedIn === '') && (<button type="button" className="homeButton" onClick={e => sendToLogin(e)}> Log in to submit a question</button>)}
              {loggedIn !== null && loggedIn !== '' && (<button type="button" className="homeButton" onClick={() => setIsAdding(true)}> Add question </button>)}
              {questions.map(({
                questionText, author, answer, _id,
              }) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  className="questionButton"
                  onClick={() => {
                    setQuestion({
                      questionText, author, answer, _id,
                    })
                  }}
                >
                  {questionText}
                </div>
              ))}
            </div>
            <div className="col col-md-8 col-lg-8 col-xl-8 questionsMain">
              <div className="selectedQuestion">
                <span style={{ fontSize: 30 }}>{question.questionText}</span>
                <br />
                <br />
                <span style={{ fontWeight: 'bold' }}>Author:</span>
                <br />
                {question.author}
                <br />
                <br />
                <span style={{ fontWeight: 'bold' }}>Answer:</span>
                <br />
                {question.answer}
                <div className="answerSection" style={{ marginTop: 30 }}>
                  <div><span style={{ color:'#00716A', fontWeight: 'bold', fontSize: 15 }}>Answer this question:</span></div>
                  <div><textarea className="answerArea" style={{ width: '100%' }} value={inputAnswer} onChange={e => setInputAnswer(e.target.value)} placeholder="Answer here..." /></div>
                  <div><button type="button" className="homeButton" onClick={e => submitAnswer(e)}> Submit Answer</button></div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={isAdding} onHide={() => setIsAdding(false)}>
            <Modal.Header><Modal.Title>Add Question</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTitleModal">
                  <textarea className="inputArea" value={inputQuestion} onChange={e => setInputQuestion(e.target.value)} placeholder="Enter question here..." />
                </Form.Group>
              </Form>
              <div className="buttonRow"><button type="button" className="addQuestionButton" onClick={e => addQuestion(e)}>Add Question</button></div>
              <div className="buttonRow"><button type="button" className="cancelButton" onClick={() => setIsAdding(false)}> Cancel </button></div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default Home
