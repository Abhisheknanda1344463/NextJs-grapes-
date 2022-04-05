const Attributes = require("../models/Attributes.js");
const AttributeOptions = require("../models/AttributeOptions.js");
const CategoryFilterableAttributes = require("../models/CategoryFilterableAttributes.js");

function Get_Filters(props) {
  const { lang, category_id } = props;
  return new Promise((resolve, reject) => {
    CategoryFilterableAttributes.find({ category_id: category_id }).then(
      (response) => {
        const attributesIds = response.map((e) => parseInt(e.attribute_id));
        Attributes.find({ id: { $in: attributesIds } }).then((attributes) => {
          AttributeOptions.find({ attribute_id: { $in: attributesIds } }).then(
            (items) => {
              const options = JSON.parse(JSON.stringify(items));
              const formattedAttributes = attributes.map((item) => {
                return new Promise((resolve1, reject) => {
                  const attribute = JSON.parse(JSON.stringify(item));
                  ///       console.log(attribute, "attributeattributeattribute");
                  const { translations } = attribute;
                  const name = translations.find((item) => item.locale == lang);

                  if (!name) {
                    resolve1([]);
                  }
                  attribute.label = name.name;
                  const formattedOptions = options.filter((option) => {
                    if (option.attribute_id == item.id) {
                      const find = option.translations.find(
                        (option) => option.locale == lang
                      );
                      option.label = find.label;

                      delete option["translations"];
                      return option;
                    }
                  });
                  attribute.options = formattedOptions;

                  delete attribute["translations"];
                  delete attribute["_id"];

                  resolve1(attribute);
                });
              });
              return Promise.all(formattedAttributes).then((response) => {
                resolve(response);
              });
            }
          );
        });
      }
    );
  });
}

exports.Get_Filters = Get_Filters;
