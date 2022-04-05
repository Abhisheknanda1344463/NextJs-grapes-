// react
import React from "react";
import { useState } from "react";
import { apiUrlWithStore } from "../../helper";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
// data stubs
import Box from "@mui/material/Box";
import { FormattedMessage } from "react-intl";
import PageHeader from "components/shared/PageHeader";

export default function ContactWithUs() {
  const intialValues = { email: "", full_name: "", phone: "", message: "" };
  const [formValues, setFormValues] = useState(intialValues);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const breadcrumb = [
    { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "/" },
    {
      title: (
        <FormattedMessage
          id="contact.with.us"
          defaultMessage="Contact with us"
        />
      ),
      url: ""
    }
  ];
  const history = useRouter();
  const submitForm = () => {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formValues)
    };

    fetch(apiUrlWithStore(`/api/contact-us-send`), options)
      .then((responce) => responce.json())
      .then((res) => {
        if (res.success == true) {
          history.push("/thanksforMessage");
        }
      })
      .catch((err) => console.error(err));
  };
  const handleChange = (e) => {
    // const { name, value } = e.target;

    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };
  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.name) {
      errors.name = "This field is required";
    }

    if (!values.email) {
      errors.email = "This field is required";
    }
    if (values.email && !regex.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.message) {
      errors.message = "This field is required";
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [formErrors]);

  return (
    <div className="site__body">
      <PageHeader header="" breadcrumb={breadcrumb} />
      <div className="container p-4 contact-with-us">
        <h3 className="contact-customhtml-fms">
          <FormattedMessage
            id="contact.with.us"
            defaultMessage="Contact with us"
          />
        </h3>

        <div className="fieldset-params-fms">
          <TextField
            id="outlined-email-input_2"
            label={
              <div className="contact-label-fms">
                <FormattedMessage
                  id="email"
                  defaultMessage={<span>Էլ․հասցե</span>}
                />
                <span className="red-fms"> *</span>
              </div>
            }
            type="email"
            autoComplete="current-email"
            onChange={handleChange}
            name="email"
          />

          <TextField
            id="outlined-data-input_3"
            label={
              <div className="contact-label-fms">
                <FormattedMessage
                  id="name.surname"
                  defaultMessage="Name, Surname"
                />
                <span className="red-fms"> *</span>
              </div>
            }
            type="text"
            autoComplete="current-data"
            onChange={handleChange}
            name="full_name"
          />
          <TextField
            id="outlined-phone-input_4"
            label={
              <div className="label-fms">
                <div className="contact-label-fms">
                  <FormattedMessage id="phone" defaultMessage="Phone" />
                </div>
              </div>
            }
            type="phone"
            autoComplete="current-phone"
            onChange={handleChange}
            name="phone"
          />
        </div>
        <div className="comment required">
          <TextField
            id="outlined-message-input_5"
            label={
              <div className="contact-label-fms">
                <FormattedMessage
                  id="contact.comment"
                  defaultMessage="Comment message"
                />
                <span className="red-fms"> *</span>
              </div>
            }
            type="text"
            autoComplete="current-message"
            onChange={handleChange}
            name="message"
          />
        </div>

        <div className="action-fms">
          <button
            onClick={() => submitForm()}
            class="btn btn-orange inner-addtocart rounde-pills btn-lg"
          >
            <span>
              <FormattedMessage id="send" defaultMessage="Send" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
