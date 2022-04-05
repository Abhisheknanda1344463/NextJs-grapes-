// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import Link from "next/link";

import { connect } from "react-redux";
class Indicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  }

  componentDidUpdate(prevProps, prevState) {
    const { open } = this.state;
    const { onOpen, onClose, openEd } = this.props;

    if (openEd) {
      if (this.wrapperRef && open) {
        this.close();
        this.props.func(false);
      }
    }
    if (open !== prevState.open) {
      if (open && onOpen) {
        onOpen();
      }
      if (!open && onClose) {
        onClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleOutsideClick = (event) => {
    const { open } = this.state;

    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && open) {
      this.close();
    }
  };

  handleButtonClick = (event) => {
    const { onClick, dropdown } = this.props;

    if (onClick) {
      onClick(event);
    }
    if (dropdown) {
      event.preventDefault();
    }

    this.toggle();
  };

  toggle() {
    this.setState((state) => ({
      open: !state.open
    }));
  }

  open() {
    this.setState(() => ({
      open: true
    }));
  }

  close() {
    this.setState(() => ({
      open: false
    }));
  }

  render() {
    let { open } = this.state;
    const { url, className, icon } = this.props;
    let { value, dropdown } = this.props;
    let button;

    if (value !== undefined) {
      value = <span className="indicator__value">{value}</span>;
    }
    const title = (
      <span className="indicator__area" onClick={this.handleButtonClick}>
        {icon}
        {value?.props?.children > 0 ? value : null}
      </span>
    );
    if (url) {
      button = (
        <>
          <Link
            href={url}
            className="indicator__button"
            onClick={this.handleButtonClick}
          >
            <a aria-label={`go your account`}>{title}</a>
          </Link>
          <span
            onClick={this.handleButtonClick}
            className="indicator-title-fms"
          >
            {this.props.title}
          </span>
        </>
      );
    } else {
      button = (
        <>
          <button
            aria-label="indicatorButton"
            type="button"
            className="indicator__button"
            onClick={this.handleButtonClick}
          >
            {title}
          </button>
          <span
            onClick={this.handleButtonClick}
            className="indicator-title-fms"
          >
            {this.props.title}
          </span>
        </>
      );
    }

    if (dropdown) {
      dropdown = (
        <div className="indicator__dropdown">
          <div>{dropdown}</div>
        </div>
      );
    }

    const classes = classNames(
      `indicator indicator--trigger--click ${className}`,
      {
        "indicator--opened": open
      }
    );

    return (
      <div className={classes} ref={this.setWrapperRef}>
        {button}
        {dropdown}
      </div>
    );
  }
}

Indicator.propTypes = {
  /** indicator value */
  value: PropTypes.number,
  /** the component that will be shown in the dropdown */
  dropdown: PropTypes.node,
  /** indicator icon */
  icon: PropTypes.node,
  /** indicator url */
  url: PropTypes.string,
  /** callback function that is called when the dropdown is opened */
  onOpen: PropTypes.func,
  /** callback function that is called when the dropdown is closed */
  onClose: PropTypes.func
};

const mapDispatchToProps = (state) => {
  return {
    auth: state.customer.authenticated
  };
};

export default connect(mapDispatchToProps, null)(Indicator);
