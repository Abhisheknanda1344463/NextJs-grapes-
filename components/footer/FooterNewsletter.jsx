// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { apiUrlWithStore } from "../../helper";
import TextField from "@mui/material/TextField";
export default function FooterNewsletter(props) {
  const [email, Setemail] = useState();
  const [success, SetSuccess] = useState();
  const hnadlarChange = (event) => {
    Setemail(event.target.value);
  };

  const handlerClick = (event) => {
    event.preventDefault();
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {

      let option = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ subscriber_email: email })
      }

      fetch(apiUrlWithStore(`/api/subscribe`), option)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            SetSuccess({ message: data.success, class: "text-success" });
          } else {
            SetSuccess({ message: data.success, class: "text-danger" });
          }
        })
        .catch((error) => console.error(error, "error"));
    } else {
      SetSuccess({ message: "Invalid Email", class: "text-danger" });
    }
  };
  return (
    <div className="footer-newsletter-container">
      <h3 className="footer-newsletter__title">
        <FormattedMessage id="footer.subscribe" defaultMessage="Subscribe" />
      </h3>

      <form action="" className="footer-newsletter__form">
        {/* <label className="sr-only" htmlFor="footer-newsletter-address">
          <FormattedMessage id="email" defaultMessage="E-mail" />
        </label>
        <FormattedMessage id="email" defaultMessage="E-mail">
          {(placeholder) => (
            <input
              type="text"
              onChange={hnadlarChange}
              className="footer-newsletter__form-input form-control"
              id="footer-newsletter-address"
              placeholder={placeholder}
            />
          )}
        </FormattedMessage> */}
        <TextField
          id={props.id}
          label={
            <FormattedMessage
              id="email"
              defaultMessage={<span>Էլ․հասցե</span>}
            />
          }
          type="email"
          autoComplete="current-email"
          onChange={hnadlarChange}
          name="email"
        />
        {success ? (
          <small id="passwordHelp" className={success.class}>
            <FormattedMessage
              id="subscribe-message"
              defaultMessage={success.message}
            />
          </small>
        ) : (
          ""
        )}
        <button
          onClick={handlerClick}
          type="submit"
          className="footer-newsletter__form-button btn "
        >
          <FormattedMessage
            id="footer.subscribe.one"
            defaultMessage="Subscribe"
          />
        </button>
      </form>
    </div>
  );
}
