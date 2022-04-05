// react
import React, { useState, useRef, useEffect } from 'react'

// third-party
import { Helmet } from 'react-helmet-async'

// application
import PageHeader               from '../shared/PageHeader'
import { FormattedMessage }     from 'react-intl'
import { url, apiUrlWithStore } from '../../helper'
import { useForm }              from 'react-hook-form'
import TextField                from '@mui/material/TextField'
// data stubs
import theme                    from '../../data/theme'
import { useRouter }            from 'next/router'
import { toast }                from 'react-toastify'
// import AccountLogin from "./AccountLogin";
import { CheckToastSvg }        from 'svg'



export default function AccountPageLogin () {
  const [input, Setinput] = useState({})
  const history = useRouter()

  const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
        } = useForm({})

  const breadcrumb = [
    {
      title: <FormattedMessage id="home" defaultMessage="Home"/>,
      url  : '/',
    },
    {
      title: (
        <FormattedMessage id="topbar.myAccount" defaultMessage="My account"/>
      ),
      url  : '',
    },
  ]

  const registerHandler = (event) => {
    // event.preventDefault();
    let options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body   : JSON.stringify({ ...event }),
    }

    fetch(apiUrlWithStore('/api/customer/register'), options)
      .then((responce) => responce.json())
      .then((res) => {
        if (res.message == 'Your account has been created successfully.') {
          history.push('/')
          toast(
            <span className="d-flex chek-fms">
              <CheckToastSvg/>
              <FormattedMessage
                id="accountcreatedsuccessfully"
                defaultMessage="Your account has been created successfully."
              />
            </span>,
            {
              hideProgressBar: true,
            }
          )
        } else if (res.message == 'Verification mail sent.') {
          history.push('/')
          toast(
            <span className="d-flex chek-fms">
              <CheckToastSvg/>
              <FormattedMessage
                id="verificationMail"
                defaultMessage="Verification mail sent."
              />
            </span>,
            {
              hideProgressBar: true,
            },
          )
        } else {
          if (res.email) {
            alert(res.email[0])
          }

          if (res.password) {
            alert(res.password[0])
          }
        }
      })
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Login — ${theme.name}`}</title>
      </Helmet>

      <FormattedMessage id="topbar.myAccount" defaultMessage="My account">
        {(account) => <PageHeader header={account} breadcrumb={breadcrumb}/>}
      </FormattedMessage>

      <div className="block">
        <div className="container p-0 login-container">
          <div className="row">
            <div className=" col-md-6 d-flex mt-4 mt-md-0 sign-up-fms">
              <div className="card flex-grow-1 mb-0">
                <div className="card-body p-5">
                  <h2 className="card-title">
                    <FormattedMessage id="sign.up" defaultMessage="Sign Up"/>
                  </h2>
                  <form onSubmit={handleSubmit(registerHandler)}>
                    <div className="signUp-position-relative ">
                      <TextField
                        id="outlined-email-input"
                        label={
                          <FormattedMessage
                            id="email"
                            defaultMessage="E-mail"
                          />
                        }
                        type="email"
                        autoComplete="current-email"
                        // onChange={handleChange}
                        name="email"
                        {...register('email', {
                          required: true,
                          pattern :
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        })}
                      />

                      <div className="alert alert-danger p-0 m-0">
                        {errors?.email?.type == 'required' ? (
                          <FormattedMessage
                            id="emailisrequired"
                            defaultMessage="The Email is required"
                          />
                        ) : errors?.email?.type == 'pattern' ? (
                          <FormattedMessage
                            id="invalid-email"
                            defaultMessage="Invalid Email"
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    <div className="signUp-position-relative">
                      <TextField
                        id="outlined-email-input"
                        label={
                          <FormattedMessage
                            id="topbar.password"
                            defaultMessage="Password"
                          />
                        }
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        // onChange={handleChange}

                        {...register('password', { required: true })}
                      />

                      <div className="alert alert-danger p-0 m-0">
                        {errors?.password?.type == 'required' &&
                        'The Password is required'}
                      </div>
                    </div>
                    <div className="signUp-position-relative">
                      <TextField
                        id="outlined-email-input"
                        label={
                          <FormattedMessage
                            id="topbar.password"
                            defaultMessage="Password"
                          />
                        }
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        // onChange={handleChange}

                        {...register('password_confirmation', {
                          validate: (value) => {
                            return (
                              value === watch('password') ||
                              'The passwords do not match'
                            )
                          },
                        })}
                      />

                      <div className="alert alert-danger p-0 m-0">
                        {errors?.password_confirmation?.type == 'validate' ? (
                          errors?.password_confirmation?.message
                        ) : errors?.password_confirmation?.type ==
                        'required' ? (
                          <FormattedMessage
                            id="passwordEmail"
                            defaultMessage="The Password is required"
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-lg btn-orange login-button rounded-pills"
                    >
                      <FormattedMessage
                        id="topbar.register"
                        defaultMessage="Registration"
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="test">
              <div className="test-input"></div>
            </div>

            {/* <div className="col-md-6 d-flex">
              <div className="card flex-grow-1 mb-md-0">
                <div className="card-body">
                  <AccountLogin />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
