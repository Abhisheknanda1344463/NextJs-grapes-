// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { url, apiUrlWithStore } from "../../helper";
import TextField from "@mui/material/TextField";
export default function AccountForgotPassword(props) {
  const [input, setInput] = useState();
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState();
  const handleChange = (e) => setInput(e.target.value);

  const sedForgot = (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input }),
    };
    fetch(apiUrlWithStore(`/api/customer/forget-password`), options)
      .then((response) => response.json())
      .then((res) => {
        if (res == "Email has been sent successfully") setSuccess(res);
        else setErrors(res);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div
        className="container"
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          marginTop: "50px",
        }}
      >
        <div className=" col-md-6 d-flex mt-4 mt-md-0 forgot-pass-block">
          <div className="card flex-grow-1 mb-0">
            <div className="card-body p-5">
              <h3 className="card-title">
                <FormattedMessage id="email" defaultMessage="e-mail address" />
              </h3>

              <form>
                <div className="">
                  <div className="signUp-position-relative ">
                    <TextField
                      id="outlined-email-input"
                      label={
                        <FormattedMessage
                          id="email"
                          defaultMessage="e-mail address"
                        />
                      }
                      type="email"
                      autoComplete="current-email"
                      name="email"
                      onChange={handleChange}
                    />
                  </div>

                  {errors ? (
                    <div className="alert alert-danger">{errors}</div>
                  ) : (
                    ""
                  )}

                  <button
                    type="submit"
                    onClick={sedForgot}
                    className="btn btn-primary mt-2 mt-md-3 mt-lg-5 f15 px-4 py-2"
                  >
                    <FormattedMessage id="send" defaultMessage="Send" />
                  </button>

                  {success && (
                    <div
                      className="alert alert-success"
                      style={{ marginTop: "20px", borderRadius: "4px" }}
                    >
                      {success}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
