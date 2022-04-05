import React from "react";
import classNames from "classnames";
import { Check12x9Svg } from "../../svg";
import { colorType } from "../../services/color";

function ConfigurableFilters({
  handleChangeConfig,
  configurablesData,
  state,
  locale,
  colorCheck,
}) {
  const isDisabled = (e, code) => {
    // console.log(e, '--e')
    // console.log(code, '--code')
    let products = [...e.products];
    // console.log(products, '--products')
    for (let attr of configurablesData.attributes) {
      // console.log(attr.code, '--attr.code')

      if (attr.code === code) {
        break;
      }
      products = products.filter((prod) =>
        state.selectedConfigs[attr.code].products.includes(prod)
      );
      // console.log(products, '--new products')
      // console.log('__________________________________________________')
    }
    return !products.length;
  };

  return (
    <div className="configurable-attributes">
      {configurablesData.attributes.map((attr) => {
        if (attr.options.length > 1) {
          if (attr.code !== "color") {
            return (
              <div className="attr_fms attr_space">
                <div className="attr_label_size">{attr.label}</div>
                {attr.code !== "color" &&
                  attr.options.length > 0 &&
                  !attr.options[0].swatch_value && (
                    <div className="other-list-main-fms">
                      {attr.options.map((e, i) => {
                        const { translations } = e;
                        var names = translations.find(
                          (item) => item.locale == locale
                        );
                        return (
                          <label
                            htmlFor={attr.code + e.id}
                            key={i}
                            id={e.id + attr.code}
                          >
                            <input
                              hidden
                              id={attr.code + e.id}
                              className="other-radio__input"
                              type="radio"
                              name={attr.code}
                              value={e.id}
                              checked={
                                state.selectedConfigs[attr.code].id === e.id
                              }
                              onChange={() => {
                                handleChangeConfig(
                                  e.products,
                                  attr.id,
                                  attr.code,
                                  e
                                );
                              }}
                              disabled={isDisabled(e, attr.code)}
                            />

                            <span className="label-attr__code">
                              {names.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          } else {
            return (
              <div className="attr_color_fms attr_space">
                <div className="attr_label_size">{attr.label}</div>
                {attr.options && attr.options.length > 1 && (
                  <div className="color-attr_fm">
                    {attr.options.map((e, i) => {
                    ////  console.log(e.products, attr.id, attr.code, e);
                      return (
                        <div
                          key={i}
                          className="filter-color__item"
                          id={e.id + attr.code}
                        >
                          <span
                            className={classNames(
                              "filter-color__check input-check-color",
                              {
                                "input-check-color--white":
                                  colorType(e.swatch_value) === "white",
                                "input-check-color--light":
                                  colorType(e.swatch_value) === "light",
                              }
                            )}
                            style={{ color: `${e.swatch_value}`.toLowerCase() }}
                          >
                            <label className="input-check-color__body">
                              <input
                                hidden
                                id={attr.code + e.id}
                                className="input-check-color__input"
                                name={attr.code}
                                type="radio"
                                value={e.id}
                                checked={
                                  state.selectedConfigs[attr.code].id === e.id
                                }
                                // checked={() => handleCheck(attr.code, e.id)}
                                onChange={() => {
                                  handleChangeConfig(
                                    e.products,
                                    attr.id,
                                    attr.code,
                                    e
                                  );
                                }}
                                disabled={isDisabled(e, attr.code)}
                              />
                              <span className="input-check-color__box" />
                              <Check12x9Svg className="input-check-color__icon" />
                              <span className="input-check-color__stick" />
                            </label>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        }
      })}
    </div>
  );
}

export default ConfigurableFilters;
