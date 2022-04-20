import { useState } from "react";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import { useForm } from "react-hook-form";
import shopApi from "../../api/shop";
import { setPopup } from "../../store/general";
import { connect } from "react-redux";
import Link from "next/link";
import { SucceSsvg } from "svg";
function AccountResetPassword(props) {
  const [formSuccess, setSuccess] = useState();
  const [formErrors, setErrors] = useState();
  const { setPopup } = props;
  const { query } = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (query?.resetPasswordKey) {
      shopApi
        .customerResetPassword({ ...data, token: query?.resetPasswordKey })
        .then((res) => {
          if (res == "success") {
            setSuccess(res);
          } else {
            setErrors(res);
          }
        });
    }
  };
  const success = (
    <div className="modalss active modalss" onClick={() => setPopup(false)}>
      <div
        className="modal-content active"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal-title">
          {" "}
          <SucceSsvg />
          <FormattedMessage
            id="reset.password.done"
            defaultMessage="Your password successfully have changed!"
          />
        </span>
        <span className="modal-string">
          {" "}
          <FormattedMessage
            id="use.new.password"
            defaultMessage="Use Your new password to login."
          />
        </span>
        <Link href="/">
          <a className="modal-href">
            {" "}
            <FormattedMessage
              id="go.homepage"
              defaultMessage="Go To Homepage"
            />
          </a>
        </Link>
      </div>
    </div>
  );
  return (
    <div className="container">
      <div className="col-md-8 d-flex mt-4 mt-md-5 forgot-pass-block mx-auto">
        <div className="card flex-grow-1 mb-0">
          <div className="card-body p-5">
            <h1 className="card-title">
              <FormattedMessage
                id="reset.password"
                defaultMessage="Reset Password"
              />
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <FormattedMessage id="password" defaultMessage="password">
                  {(placeholder) => (
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={placeholder}
                      className="form-control forgot-pass-input"
                      {...register("password", { required: true })}
                    />
                  )}
                </FormattedMessage>
                {errors.password && (
                  <div className="alert alert-danger p-0">
                    {errors.password.message || "This field is required"}
                  </div>
                )}
              </div>
              <div className="form-group">
                <FormattedMessage
                  id="repeat-password"
                  defaultMessage="Repeat Password"
                >
                  {(placeholder) => (
                    <input
                      type="password"
                      id="repeat-password"
                      name="repeat-password"
                      placeholder={placeholder}
                      className="form-control forgot-pass-input"
                      {...register("password_confirmation", {
                        validate: (value) => {
                          return (
                            value === watch("password") ||
                            "The passwords do not match"
                          );
                        },
                      })}
                    />
                  )}
                </FormattedMessage>
                {errors.password_confirmation && (
                  <div className="alert alert-danger p-0">
                    {errors.password_confirmation.message}
                  </div>
                )}
              </div>

              {formErrors ? (
                <div className="alert alert-danger">{formErrors}</div>
              ) : (
                ""
              )}
              {formSuccess && (
                <div
                  style={{
                    marginTop: "20px",
                    borderRadius: "4px",
                  }}
                  className="alert alert-success"
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary mt-2 mt-md-3 mt-lg-2 f15 px-4 py-2"
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = () => ({});
const mapDispatchToProps = {
  setPopup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountResetPassword);
