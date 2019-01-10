import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'

import {signUpValidate as validateService} from '@services'
import { spinner } from './spinner'
import { literals } from './literals'

const VALIDATION = {
  REQUESTED: 'REQUESTED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

export class SignUpValidate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      validation: VALIDATION.REQUESTED
    }
  }

  componentDidMount () {
    return this.validationRequest()
  }

  async validationRequest () {
    const urlQuery = window.location.search
    const validateId = urlQuery.substring(urlQuery.indexOf('=') + 1)
    try {
      const validated = await validateService(validateId)
      this.setState({validation: validated ? VALIDATION.SUCCESSFUL : VALIDATION.FAILED})
    } catch (err) {
      this.setState({validation: VALIDATION.FAILED})
    }
  }

  render () {
    const RESULT = {
      REQUESTED: <span>
          <h1 className='is-size-3'>{literals.validating}</h1>
          <img alt='' src={spinner} />
        </span>,
      VALIDATED: <span>
          <h1 className='is-size-3'>{literals.emailValidatedHeading}</h1>
          <p>{literals.emailValidatedLine1}</p>
          <p>{literals.emailValidatedLine2}</p>
          <p>{literals.emailValidatedLine3}</p>
          <br /><Link to='/Login'><button className={'button is-link '}>{literals.goToLogin}</button></Link>
        </span>,
      NOT_VALIDATED: <span>
          <h1 className='is-size-3'>{literals.notValidatedHeading}</h1>
          <p>{literals.notValidatedLine1}</p>
          <p>{literals.notValidatedLine2}</p>
          <p>{literals.notValidatedLine3}</p>
          <br /><Link to='/SignUp'><button className={'button is-link '}>{literals.goToSignUp}</button></Link>
        </span>
    }
    return (
      <div id='SignUpValidatePage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className={'title is-3 ' + styles.separateTop}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className='box'>
              <div className='has-text-centered'>
                {
                  (this.state.validation === VALIDATION.REQUESTED)
                    ? RESULT.REQUESTED
                    : (this.state.validation === VALIDATION.SUCCESSFUL)
                      ? RESULT.VALIDATED
                      : RESULT.NOT_VALIDATED
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
