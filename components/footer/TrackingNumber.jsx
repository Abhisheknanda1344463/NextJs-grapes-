// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { apiUrlWithStore } from "../../helper";

export default function TrackingNumber() {
  const [track, setTrack] = useState();
  const [success, SetSuccess] = useState();
  const hnadlarChange = (event) => {
    setTrack(event.target.value);
  };

  const handlerClick = (event) => {
    event.preventDefault();
    if (track) {
      fetch(apiUrlWithStore(`/api/track/${track}`), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data == "Wrong order number") {
            SetSuccess({ message: data, class: "text-danger" });
          } else {
            window.open(data.url, "_blank");
          }
        })
        .catch((error) => console.error(error, "error"));
    }
  };
  return (
    <div className="container">
      <div className="track-body">
        <h3>
          <FormattedMessage
            id="track.your.order"
            defaultMessage="Track Your Order"
          />{" "}
        </h3>
        <div className="track-body-input">
          <form action="">
            <label className="sr-only" htmlFor="tracking-number">
              <FormattedMessage
                id="your.track.number"
                defaultMessage="Your Track number"
              />
            </label>
            <div className="input-titles-track">
              <FormattedMessage
                id="your.track.number"
                defaultMessage="Your Track number"
              >
                {(placeholder) => (
                  <input
                    type="text"
                    onChange={hnadlarChange}
                    className="tracking-number-input"
                    id="tracking-number"
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
              {success ? (
                <small id="passwordHelp" className={success.class}>
                  <FormattedMessage
                    id="trackerr-message"
                    defaultMessage={success.message}
                  />
                </small>
              ) : (
                ""
              )}
            </div>
            <button
              onClick={handlerClick}
              type="submit"
              className="tracking-number-btn"
            >
              <FormattedMessage id="track" defaultMessage="Track" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
