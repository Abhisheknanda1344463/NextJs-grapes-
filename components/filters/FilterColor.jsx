// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import { Check12x9Svg } from "../../svg";
import { colorType } from "../../services/color";
import { FormattedMessage } from "react-intl";

function FilterColor(props) {
  const { data, value, onChangeValue, filterValues } = props;
  const updateValue = (data, newValue, remove, code) => {
    onChangeValue({ filter: code, value: newValue, remove: remove });
  };

  const handleChange = (event, value, code) => {
    if (event.target.checked) {
      updateValue(value, [event.target.value], false, code);
    }
    if (!event.target.checked) {
      updateValue(value, event.target.value, true, code);
    }
  };
  let fillVal;
  if (filterValues[value] !== undefined) {
    fillVal = filterValues[value].split(",");
  }

  const itemsList = data.map((item, index) => {
    const itemClasses = classNames("filter-list__item", {
      "filter-list__item--disabled": item.count === 0,
    });
    return (
      <div className="filter-color__item" key={index}>
        <span
          className={classNames("filter-color__check input-check-color", {
            "input-check-color--white":
              colorType(
                item.swatch_value || `${item.admin_name}`.toLowerCase()
              ) === "white",
            "input-check-color--light":
              colorType(
                item.swatch_value || `${item.admin_name}`.toLowerCase()
              ) === "light",
          })}
          style={{
            color: item.swatch_value || `${item.admin_name}`.toLowerCase(),
          }}
        >
          <label className="input-check-color__body">
            <input
              className="input-check-color__input"
              type="checkbox"
              value={item.id}
              checked={
                filterValues && filterValues[value.code]
                  ? filterValues[value.code].toString().includes(item.id)
                  : ""
              }
              disabled={item.count === 0}
              onChange={(e) => handleChange(e, item.id, value.code)}
            />
            <span className="input-check-color__box" />
            <Check12x9Svg className="input-check-color__icon" />
            <span className="input-check-color__stick" />
          </label>
        </span>
      </div>
    );
  });
  // })

  return (
    <>
      <div className="filter-list">
        <div className="widget__title">
          <FormattedMessage id="color" defaultMessage={props.title} />
        </div>
        <div className="filter-color__list">{itemsList}</div>
      </div>
    </>
  );
}

FilterColor.propTypes = {
  /**
   * Filter object.
   */
  data: PropTypes.object,
  /**
   * Value.
   */
  value: PropTypes.arrayOf(PropTypes.string),
  /**
   * Change value callback.
   */
  onChangeValue: PropTypes.func,
};

export default FilterColor;
