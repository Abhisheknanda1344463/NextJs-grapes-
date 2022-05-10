// react
import React, {useCallback, useEffect, useState} from "react";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import {useSelector, connect} from "react-redux";
// import shopApi from "../../api/shop";
// import { url } from "../../helper";
// import Collapse from "../shared/Collapse";
// import { ArrowRoundedDown12x7Svg } from "../../svg";

import FilterRange from "../filters/FilterRange";
import FilterCheck from "../filters/FilterCheck";
import FilterColor from "../filters/FilterColor";
import {
  setInitialMinPrice,
  setInitialMaxPrice,
} from "../../store/general/generalActions";

const CheckFilterHandler = {
  type: "check",
  serialize: (value) => value.join(","),
  deserialize: (value) => (value ? value.split(",") : []),
  isDefaultValue: (filter, value) => value.length === 0,
  getDefaultValue: () => [],
};

function WidgetFilters(props) {
  const [filtersData, setFilters] = useState();
  const selectedData = useSelector((state) => state.locale.code);

  const {
    // title,
    // filtersData,

    stateFilters,
    dispatch,
    filters,
    values,
    offcanvas,
    minPrice,
    maxPrice,
    initialMaxPrice,
    initialMinPrice,
    setInitialMinPrice,
    setInitialMaxPrice,
  } = props;
  useEffect(() => {
    setFilters(filters);
  }, [filters]);

  const handleValueChange = useCallback(
    ({filter, value, remove}) => {
      if (remove) {
        dispatch({
          type: "REMOVE_FILTER_VALUE",
          filter: filter,
          value: value,
        });
      } else {
        // console.log(value, "value in prododododododododododododododododododododododododod")
        dispatch({
          type: "SET_FILTER_VALUE",
          filter: filter,
          value: value ? CheckFilterHandler.serialize(value) : "",
        });
      }
    },
    [dispatch]
  );

  const handleResetFilters = () => {
    setInitialMinPrice(initialMinPrice);
    setInitialMaxPrice(initialMaxPrice);
    dispatch({type: "RESET_FILTERS"});
  };

  const classes = classNames("widget-filters widget", {
    "widget-filters--offcanvas--always": offcanvas === "always",
    "widget-filters--offcanvas--mobile": offcanvas === "mobile",
  });
  const filtersList = (
    <>
      {filtersData ? (
        <span>
          {filtersData.map((item) =>
            item.code != "color" && item.code != "price" ? (
              <div className={classes}>
                <div className="widget-filters__list">
                  {/* {item.label} */}
                  <FilterCheck
                    filterValues={values}
                    // checked={chekedValue}
                    data={item.options}
                    value={item}
                    onChangeValue={handleValueChange}
                    title={item.label}
                  />
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </span>
      ) : (
        ""
      )}
    </>
  );
  const filtersColor = (
    <>
      {filtersData && (
        <span>
          {filtersData.map((item) => {
            return (
              item.code == "color" && (
                <div className={classes}>
                  <div className="widget-filters__list">
                    {/* {item.label} */}
                    <FilterColor
                      filterValues={values}
                      // checked={chekedValue}
                      data={item.options}
                      value={item}
                      onChangeValue={handleValueChange}
                      title={item.label}
                    />
                  </div>
                </div>
              )
            );
          })}
        </span>
      )}
    </>
  );

  return (
    <>
      {filtersList}
      {filtersColor}
      <div className={classes}>
        <div className="widget-filters__list">
          <FilterRange
            title=""
            key={"Max Price"}
            onChangeValue={handleValueChange}
            data={{
              min: parseInt(minPrice),
              max: parseInt(maxPrice),
            }} // parseInt(maxPrice)
            value={
              stateFilters.filters.price !== undefined
                ? stateFilters.filters.price.split(",")
                : [parseInt(minPrice), parseInt(maxPrice)]
            }
          />
        </div>
        <div className="widget-filters__actions d-flex mb-n2">
          <button
            type="button"
            className="btn btn-secondary f15 btn-lg"
            onClick={handleResetFilters}
          >
            <FormattedMessage id="reset" defaultMessage="Reset"/>
          </button>
        </div>
      </div>
    </>
  );
}

WidgetFilters.defaultProps = {
  offcanvas: "mobile",
};

const mapDispatchToProps = (dispatch) => ({
  setInitialMinPrice: (payload) => dispatch(setInitialMinPrice(payload)),
  setInitialMaxPrice: (payload) => dispatch(setInitialMaxPrice(payload)),
});

export default connect(false, mapDispatchToProps)(WidgetFilters);
