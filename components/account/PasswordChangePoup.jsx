import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import shopApi from "../../api/shop";
import useInput from '../../hooks/useInput';
import classNames from 'classnames'
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setPopup } from '../../store/general'
import TextField from '@mui/material/TextField'
import { FailSvg, CheckToastSvg } from "../../svg";
function PasswordChangePoup() {
  const dispatch = useDispatch()
  const customer = useSelector((state) => state.customer.token);
  const [isValid, setIsValid] = useState(null)
  const old_password = useInput('')
  const password = useInput('')
  const password_confirmation = useInput('')
  const changePassword = () => {
    /*
     Change Password query  
    */
    shopApi.customerResetPassword({
      token: customer,
      password: password.value,
      password_confirmation: password_confirmation.value,
      old_password: old_password.value
    }).then(() => {
      toast(
        <span className="d-flex chek-fms">
          <CheckToastSvg />
          <FormattedMessage
            id="passupdatedsuccessfully"
            defaultMessage="Your password has been updated successfully."
          />
        </span>,
        {
          hideProgressBar: true,
        }
      )
    }).catch(err => {
      toast(
        <span className="d-flex chek-fms">
          <FailSvg />
          <FormattedMessage
            id="type_valid_data"
            defaultMessage={err.error}
          />
        </span>,
        {
          hideProgressBar: true,
        }
      )
    }).finally(() => {
      /*
        reset values in input after that close modal 
      */
      old_password.reset()
      password.reset()
      password_confirmation.reset()
      dispatch(setPopup(false))
    })
  }

  useEffect(() => {
    /*
      Validate match values or not
    */
    if (password.value !== "" && password_confirmation.value !== "") {
      setIsValid(password.value === password_confirmation.value)
    }
  }, [password, password_confirmation])

  const invalidFields = classNames('btn btn-primary mt-2 mt-md-3 mt-lg-2 f15 px-4 py-2', {
    'invalid-fields': !isValid || password_confirmation.value.length < 5 || password.value.length < 5,
  })

  return (
    <div className="modal-body-forms">
      <div className="modal-body ">
        <h1>
          <FormattedMessage
            id="ChangePassword"
            defaultMessage="Change Password"
          />
        </h1>
        <div className="modal-current-password new-passwords">
          <TextField
            style={{ width: "100%" }}
            id="outlined-email-input"
            label={
              <FormattedMessage
                id="CurrentPassword"
                defaultMessage="Current password"
              />
            }
            type="password"
            autoComplete="old_password"
            {...old_password}
            name="old_password"
          />
        </div>
        <div className="modal-newpasswords new-passwords">
          <div className="modal-current-password">
            <TextField
              id="outlined-email-input"
              style={{ width: "100%" }}
              label={
                <FormattedMessage
                  id="newpassword.popup"
                  defaultMessage="New password"
                />
              }
              type="password"
              autoComplete="new-password"
              {...password}
              name="password"
            />
            {
              password.value !== "" && password.value.length < 5 ? (
                <div className="error-message-change-password">
                  <FormattedMessage
                    id="password.minLength"
                    defaultMessage="Your password should have 6 symbols"
                  />
                </div>
              ) : (
                null
              )
            }
          </div>
          <div className="modal-current-password modal-confirm-password">
            <TextField
              id="outlined-email-input"
              style={{ width: "100%" }}
              label={
                <FormattedMessage
                  id="passwordConfirm"
                  defaultMessage="Confirm password"
                />
              }
              type="password"
              autoComplete="confirm_password"
              {...password_confirmation}
              name="confirm_password"
            />
            {
              !isValid && password.value && password_confirmation.value ? (
                <div className="error-message-change-password">
                  <FormattedMessage
                    id="change.password.confirm"
                    defaultMessage="Passwords are not the same"
                  />
                </div>
              ) : (
                null
              )
            }
            {
              password_confirmation.value !== "" && password_confirmation.value.length < 5 ? (
                <div className="error-message-change-password">
                  <FormattedMessage
                    id="password.minLength"
                    defaultMessage="Your password should have min 6 symbols"
                  />
                </div>
              ) : (
                null
              )
            }
          </div>
        </div>
        <button
          disabled={!isValid || password_confirmation.value.length < 5 || password.value.length < 5}
          type="submit"
          className={invalidFields}
          onClick={changePassword}
        >
          <FormattedMessage id="save" defaultMessage="Save" />
        </button>
      </div>
    </div>
  );
}

export default PasswordChangePoup;
