import styles from './styles.scss'
import React from 'react'

import { literals } from './literals'

export class AnothersProfile extends React.Component {
  render () {
    console.log(this.props)
    const fields = Object.keys(this.props.userProfile)
    return (
      <div id='AnothersProfile'>
        <h2 className='title is-4'>{literals.profileOf(`${this.props.fullname}`)}</h2>
        <div id='showAvatar'>
          <div className={'box ' + styles.limitWidth}>
            {this.props.avatar ? <img src={this.props.avatar} alt='avatar' /> : <i className='fas fa-user fa-4x' alt='users foto' />}
          </div>
        </div>
        <table className='table is-fullwidth'>
          <tbody>
            {fields.map(field =>
              <tr key={field}>
                <td>{literals[field]}:</td>
                <td>
                  <input className='input' type='text' name={field}
                    value={this.props.userProfile[field]}
                    disabled={true} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}
