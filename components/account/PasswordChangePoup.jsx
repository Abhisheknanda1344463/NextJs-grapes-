// react
import React from "react";
import { FormattedMessage } from "react-intl";

function PasswordChangePoup(props) {
  const { popupName } = props;
  return (
    <div className="modal-body-forms">
      <div className="modal-body ">
        <h1>Change password</h1>
        <div className="modal-current-password">
          <p>
            <FormattedMessage
              id="CurrentPassword"
              defaultMessage=" Current password"
            />
          </p>
          <input />
        </div>
        <span className="modal-current-text">
          <p>
            We recommend that your password is not a word you can find in the
            dictionary, includes both capital and lower case letters, and
            contains at least one special character(1-9, !, *, etc.))
          </p>
        </span>
        <div className="modal-newpasswords">
          <div className="modal-current-password">
            <p>
              <FormattedMessage
                id="new.password"
                defaultMessage="New password"
              />
            </p>
            <input />
          </div>
          <div className="modal-current-password">
            <p>
              <FormattedMessage
                id="passwordConfirm"
                defaultMessage="Confirm password"
              />
            </p>
            <input />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2 mt-md-3 mt-lg-2 f15 px-4 py-2"
        >
          <FormattedMessage id="save" defaultMessage="Save" />
        </button>
      </div>
    </div>
  );
}

export default PasswordChangePoup;
