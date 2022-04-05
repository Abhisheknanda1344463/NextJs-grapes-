// react
import React, { useCallback, useEffect, useMemo, useState } from "react";

// third-party
import InputRange from "react-input-range";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import Currency from "../shared/Currency";
import languages from "../../i18n";
import { FormattedMessage } from "react-intl";

function getFirstValidValue(...values) {
  return values.reduce(
    (acc, value) => (acc === null && (value || value === 0) ? value : acc),
    null
  );
}

function FilterRange(props) {
  const { data, value, onChangeValue, locale, filter } = props;

  const { direction } = languages[locale];
  const [propsFrom, propsTo] = value || [];
  const [timer, setTimer] = useState(null);
  const [state, setState] = useState([propsFrom, propsTo]);
  const [stateFrom, stateTo] = state;

  let { min, max } = data;
  let from = Math.max(getFirstValidValue(stateFrom, propsFrom, min), min);
  let to = Math.min(getFirstValidValue(stateTo, propsTo, max), max);
  let fromLabel = from;
  let toLabel = to;

  // since react-input-range does not support RTL direction,
  // we just need to invert and swipe values
  if (direction === "rtl") {
    [from, to] = [to * -1, from * -1];
    [min, max] = [max * -1, min * -1];
    [fromLabel, toLabel] = [from * -1, to * -1];
  }

  // Update state from props.
  useEffect(() => {
    setState([propsFrom, propsTo]);
  }, [propsFrom, propsTo]);

  // Clear previous timer.
  useEffect(
    () => () => {
      clearTimeout(timer);
    },
    [timer]
  );

  const handleChange = useCallback(
    (newValue) => {
      let { min: newFrom, max: newTo } = newValue;

      // This is needed to fix a bug in react-input-range.
      [newFrom, newTo] = [Math.max(newFrom, min), Math.min(newTo, max)];

      // since react-input-range does not support RTL direction,
      // we just need to invert and swipe values
      if (direction === "rtl") {
        [newFrom, newTo] = [newTo * -1, newFrom * -1];
      }

      setState([newFrom, newTo]);

      if (onChangeValue) {
        setTimer(
          setTimeout(() => {
            onChangeValue({ filter: "price", value: [newFrom, newTo] });
          }, 250)
        );
      }
    },
    [min, max, data, onChangeValue, direction, setTimer, setState]
  );
  return useMemo(
    () => (
      <div className="filter-price">
        <div className="widget__title">
          <FormattedMessage id="price" defaultMessage={props.title} />
        </div>
        {max ? (
          <>
            <div className="filter-price__title">
              <span className="filter-price__min-value">
                <Currency value={fromLabel} />
              </span>

              <span className="filter-price__max-value">
                <Currency value={toLabel} />
              </span>
            </div>
            <div className="filter-price__slider" dir="ltr">
              <InputRange
                minValue={min}
                maxValue={max}
                value={{ min: from, max: to }}
                step={1}
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    ),
    [min, max, from, to, fromLabel, toLabel, handleChange]
  );
}

const mapStateToProps = (state) => ({
  locale: state.locale.code,
});

export default connect(mapStateToProps)(FilterRange);
