const fs = require('fs')
const NewProductsEn = require('../models/NewProductsEn.js')
const NewProductsHy = require('../models/NewProductsHy.js')
const NewProductsRu = require('../models/NewProductsRu.js')
const {apiImageUrl} = require('../helper.js')

const FeaturedProductsEn = require('../models/FeaturedProductsEn.js')
const FeaturedProductsHy = require('../models/FeaturedProductsHy.js')
const FeaturedProductsRu = require('../models/FeaturedProductsRu.js')

const Products = require('../models/Products.js')
const ProductFlat = require('../models/ProductFlat.js')
const ProductImages = require('../models/ProductImages.js')
const RelatedProducts = require(`../models/RelatedProducts`)
const UpSellProducts = require(`../models/UpSellProducts`)
const CrosselProducts = require(`../models/CrosselProducts`)
const ProductInventories = require('../models/ProductInventories.js')
const ProductsCategories = require('../models/ProductsCategories.js')
const ProductSuperAttributes = require('../models/ProductSuperAttributes.js')
// const CoreConfigs = require('../models/Products.js')

const ProductAttributeValues = require('../models/ProductAttributeValues.js')
const Attributes = require('../models/Attributes.js')
const AttributeOptions = require('../models/AttributeOptions.js')
const {type} = require('os')


// const CategoryFilterableAttributes = require("../models/CategoryFilterableAttributes.js");

/**
 *  Utils fot that controllers
 */

function parseClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}


function makeImageClone(path) {
  return {
    path: path,
    url: `/storage/clever/${path}`,
    large_image_url: `${apiImageUrl}/cache/large/${path}`,
    medium_image_url: `${apiImageUrl}/cache/medium/${path}`,
    small_image_url: `${apiImageUrl}/cache/small/${path}`,
    original_image_url: `${apiImageUrl}/cache/original/${path}`,
  }
}


function defaultFilter({key, options}) {
  let dynamicSearchKey = null
  switch (typeof options[key]) {
    case 'boolean':
      dynamicSearchKey = 'boolean_value'
      break
    default:
      let isnum = /^\d+$/.test(options[key])
      switch (isnum) {
        case true:
          dynamicSearchKey = 'integer_value'
          break
        default:
          dynamicSearchKey = 'text_value'
          break
      }
  }

  let value = null
  if (options[key].indexOf(',') != -1) {
    dynamicSearchKey = 'integer_value'
    value = options[key].split(',')
  } else {
    value = options[key]
  }

  return {[dynamicSearchKey]: value}
}


function build({flatProducts, locale, resolve, ...rest}) {
  const promiseArray = flatProducts.map((item) => {
    return new Promise((resolve, reject) => {
      const product = parseClone(item)
      const productId = product.product_id
      const p1 = new Promise((resolve, reject1) => {
        ProductImages.find({product_id: productId})
          .then((res) => resolve({ProductImages: res}))
          .catch((err) => reject1(err))
      })
      const p2 = new Promise((resolve, reject2) => {
        ProductFlat.find({locale, product_id: productId})
          .then((res) => resolve({productFlat: res}))
          .catch((err) => reject2(err))
      })
      const p3 = new Promise((resolve, reject3) => {
        ProductInventories.find({product_id: productId})
          .then((res) => resolve({ProductInventories: res}))
          .catch((err) => reject3(err))
      })

      const p4 = new Promise((resolve, reject4) => {
        Products.find({id: productId})
          .then((res) => resolve({Products: res}))
          .catch((err) => reject4(err))
      })

      // const p5 = new Promise((resolve, reject5) => {
      //   UpSellProducts.find({ parent_id: productId })
      //     .then(res => {
      //       if (res.length > 0) {
      //         const productIds = res.map((e) => e.child_id)
      //         // console.log(productIds, "PROMOOOOOOOOOOOOOOOOOOOOO")
      //         Products.find({ id: { $in: productIds } })
      //           .limit(8)
      //           .then((products) => {
      //             const promiseArray = products.map((item) => {
      //
      //               return new Promise((resolve, reject) => {
      //                 const product = parseClone(item)
      //
      //                 const p1 = new Promise((resolve1, reject1) => {
      //                   ProductImages.find({ product_id: product.id })
      //                     .then((res) => {
      //                       resolve1({ ProductImages: res })
      //                     })
      //                     .catch((err) => reject(err))
      //                 })
      //
      //                 const p2 = new Promise((resolve2, reject2) => {
      //                   ProductFlat.find({ locale, product_id: product.id })
      //                     .then((res) => {
      //                       resolve2({ productFlat: res })
      //                     })
      //                     .catch((err) => reject(err))
      //                 })
      //
      //                 const p3 = new Promise((resolve3, reject3) => {
      //                   ProductInventories.find({ product_id: product.id })
      //                     .then((res) => {
      //                       resolve3({ ProductInventories: res })
      //                     })
      //                     .catch((err) => reject(err))
      //                 })
      //
      //                 return Promise.all([p1, p2, p3]).then((response) => {
      //                   const collection = arrayConvertToObject(response)
      //                   const imagesData = parseClone(collection.ProductImages)
      //                   const flatData = parseClone(collection.productFlat[0] || [])
      //                   const inventoriesData = parseClone(
      //                     collection.ProductInventories[0] || [],
      //                   )
      //                   if (imagesData.length == 0) {
      //                     const obj = {
      //                       ...product,
      //                       ...flatData,
      //                       ...inventoriesData,
      //                     }
      //
      //                     resolve(obj)
      //                   } else {
      //                     const { path } = imagesData[0]
      //                     const base_imag = makeImageClone(path)
      //                     const images = imagesData.map((e) => makeImageClone(e.path))
      //
      //                     const obj = {
      //                       ...product,
      //                       ...flatData,
      //                       ...inventoriesData,
      //                       base_imag,
      //                       images,
      //                     }
      //
      //                     resolve(obj)
      //                   }
      //                 })
      //               })
      //             })
      //             return Promise.all(promiseArray).then((response) => {
      //               // resolve(response)
      //               // console.log(response, "response  in upsel_crossSel product________")
      //               resolve({ UpSellProducts: response })
      //             })
      //           })
      //       } else {
      //         resolve({ UpSellProducts: res })
      //       }
      //       // resolve({ UpSellProducts: res })
      //     })
      //     .catch(err => reject5(err))
      // })
      //
      // const p6 = new Promise((resolve, reject5) => {
      //   CrosselProducts.find({ parent_id: productId })
      //     .then(res => {
      //       if (res.length > 0) {
      //         const productIds = res.map((e) => e.child_id)
      //         Products.find({ id: { $in: productIds } })
      //           .limit(8)
      //           .then((products) => {
      //             const promiseArray = products.map((item) => {
      //
      //               return new Promise((resolve, reject) => {
      //                 const product = parseClone(item)
      //
      //                 const p1 = new Promise((resolve1, reject1) => {
      //                   ProductImages.find({ product_id: product.id })
      //                     .then((res) => {
      //                       resolve1({ ProductImages: res })
      //                     })
      //                     .catch((err) => reject(err))
      //                 })
      //
      //                 const p2 = new Promise((resolve2, reject2) => {
      //                   ProductFlat.find({ locale, product_id: product.id })
      //                     .then((res) => {
      //                       resolve2({ productFlat: res })
      //                     })
      //                     .catch((err) => reject(err))
      //                 })
      //
      //                 const p3 = new Promise((resolve3, reject3) => {
      //                   ProductInventories.find({ product_id: product.id })
      //                     .then((res) => {
      //                       resolve3({ ProductInventories: res })
      //                     })
      //                     .catch((err) => reject(err))
      //                 })
      //
      //                 return Promise.all([p1, p2, p3]).then((response) => {
      //                   const collection = arrayConvertToObject(response)
      //                   const imagesData = parseClone(collection.ProductImages)
      //                   const flatData = parseClone(collection.productFlat[0] || [])
      //                   const inventoriesData = parseClone(
      //                     collection.ProductInventories[0] || [],
      //                   )
      //                   if (imagesData.length == 0) {
      //                     const obj = {
      //                       ...product,
      //                       ...flatData,
      //                       ...inventoriesData,
      //                     }
      //
      //                     resolve(obj)
      //                   } else {
      //                     const { path } = imagesData[0]
      //                     const base_imag = makeImageClone(path)
      //                     const images = imagesData.map((e) => makeImageClone(e.path))
      //
      //                     const obj = {
      //                       ...product,
      //                       ...flatData,
      //                       ...inventoriesData,
      //                       base_imag,
      //                       images,
      //                     }
      //
      //                     resolve(obj)
      //                   }
      //                 })
      //               })
      //             })
      //             return Promise.all(promiseArray).then((response) => {
      //               // resolve(response)
      //               resolve({ CrosselProducts: response })
      //             })
      //           })
      //       } else {
      //         resolve({ CrosselProducts: res })
      //       }
      //       // resolve({ UpSellProducts: res })
      //     })
      //     .catch(err => reject5(err))
      // })

      return Promise.all([p1, p2, p3, p4])
        .then((response) => {
          const collection = arrayConvertToObject(response)
          const imagesData = parseClone(collection.ProductImages)
          const flatData = parseClone(collection.productFlat[0] || [])
          const inventoriesData = parseClone(collection.ProductInventories[0] || [])
          const allProducts = parseClone(collection.Products[0] || [])
          // const upProds = parseClone(collection.UpSellProducts[0] || [])
          // const crossProds = parseClone(collection.CrosselProducts[0] || [])
          // console.log(upProds, "upProds in combine process");
          if (imagesData[0] && imagesData[0].path) {
            const {path} = imagesData[0]
            const base_imag = makeImageClone(path)
            const images = imagesData.map((e) => makeImageClone(e.path))

            const obj = {
              // ...upProds,
              // ...crossProds,
              ...allProducts,
              ...product,
              ...flatData,
              ...inventoriesData,
              base_imag,
              images,
            }
            resolve(obj)
          }
          resolve([])
        })
        .catch((err) => reject(err))
    })
  })

  return Promise.all(promiseArray).then((response) => {
    let everyThing = null
    if (rest.prices && rest.prices.length > 0) {
      // console.log(response, "rest.pricesrest.pricesrest.prices");
      var setInitialMinPrice = 0
      var setInitialMaxPrice = 0

      setInitialMinPrice = Math.min.apply(
        Math,
        response.map(function (o) {
          return o.price
        }),
      )
      setInitialMaxPrice = Math.max.apply(
        Math,
        response.map(function (o) {
          return o.price
        }),
      )
      ///   console.log(setInitialMaxPrice, "setInitialMaxPricesetInitialMaxPrice");
      everyThing = {
        data: response,
        filters: [],
        links: {},
        max_price: rest.prices[1],
        meta: {},
        total: rest.total,
        dispatches: {
          setInitialMinPrice: setInitialMinPrice,
          setInitialMaxPrice: setInitialMaxPrice,
        },
      }
    } else {
      everyThing = {
        [rest.type]: response,
      }
    }
    resolve(everyThing)
  })
}


function buildProductsListCollection({flat, savings, price, ...rest}) {
  /**
   *  @info switch cases for filters
   *  @params savings and prices are the uniq filters, for them working another logic
   *
   * */

  if (flat) {
    const {prices, flatProducts} = rest
    let object
    if (price) {
      const [from, to] = price.split(',')

      /// console.log(from, to, prices, rest, "prices");
      const flatProductsFiltered = flatProducts.filter((flatProduct) => {
        console.log(flatProduct.price, 'flatProduct.price')
        if (
          flatProduct.price >= from &&
          flatProduct.price <= parseFloat(to) + 5
        ) {
          return flatProduct
        }
      })
      build({
        ...rest,
        flatProducts: flatProductsFiltered,
      })
    }

    build(rest)
  } else {
    build(rest)
  }
}


// ##########################################################################################

function arrayConvertToObject(response) {
  return response.reduce((prev, next) => {
    const keys = Object.keys(next)
    if (keys.length > 1) {
      const array = keys.reduce((a, n) => {
        return {
          ...a,
          [n]: next[n],
        }
      }, {})
      return {...prev, ...array}
    } else {
      return {...prev, [keys]: next[keys]}
    }
  }, {})

  // // old version, for case if kay only single
  // return response.reduce((prev, next) => {
  //   const [key] = Object.keys(next);
  //   return { ...prev, [key]: next[key] }
  // }, {})
}


function Get_New_And_Futured_Products({locale, limit, currency, ...rest}) {
  return new Promise((resolve, reject) => {
    const futuredProducts = new Promise((resolve, reject) => {
      ProductFlat.find({new: 1, locale})
        .limit(limit)
        .then((flatProducts) => {
          build({flatProducts, locale, resolve, type: 'featured', ...rest})
        })
    })
    const newProducts = new Promise((resolve, reject) => {
      ProductFlat.find({featured: 1, locale})
        .limit(limit)
        .then((flatProducts) => {
          build({flatProducts, locale, resolve, type: 'new', ...rest})
        })
    })
    const minPriceGenerator = new Promise((resolve, reject) => {
      ProductFlat.find({min_price: '0.0000', locale}).then((flatProducts) => {
        build({flatProducts, locale, resolve, type: 'elipse', ...rest})
      })
    })
    return Promise.all([futuredProducts, newProducts, minPriceGenerator]).then(
      (response) => {
        const productsCollection = arrayConvertToObject(response)
        resolve(productsCollection)
        // console.log(productsCollection, "vvvvvvvvvvvv---------------")
      },
    )
  })
}


// function Get_New_Products(options) {
//   const modulesInfo = {
//     "en": NewProductsEn,
//     "hy": NewProductsHy,
//     "ru": NewProductsRu,
//   }
//   const Module = modulesInfo[options.locale];
//
//   return new Promise((resolve, reject) => {
//     Module
//       .find()
//       .then(products => {
//         resolve(products[0].data)
//       })
//       .catch((err) => reject(err));
//   })
// }
//
// function Get_featured_Products(options) {
//   const modulesInfo = {
//     "en": FeaturedProductsEn,
//     "hy": FeaturedProductsHy,
//     "ru": FeaturedProductsRu,
//   }
//   const Module = modulesInfo[options.locale];
//
//   return new Promise((resolve, reject) => {
//     Module
//       .find()
//       .then(products => {
//         resolve(products[0].data)
//       })
//       .catch((err) => reject(err));
//   })
// }

function Get_Product_list(options) {
  //limit, category_id, currency,
  const {locale: defaultLocale, limit, page, ...rest} = options
  console.log(
    defaultLocale,
    'Get_Product_listGet_Product_listGet_Product_list',
  )
  var locale
  if (defaultLocale.length > 0) {
    locale = defaultLocale[0]
  } else {
    locale = defaultLocale
  }
  let searchKeys = {}
  console.log(options, 'options')
  for (let key in options) {
    if (
      key != 'limit' &&
      key != 'category_id' &&
      key != 'currency' &&
      key != 'locale' &&
      key != 'page'
    ) {
      switch (key) {
        case 'savings':
          break
        case 'price':
          // const [from, to] = options["price"].split(",");
          // searchKeys = {
          //   ...searchKeys,
          //   prices: { $gte: from + ".0000", $lte: to + ".0000" },
          // };
          break
        default:
          searchKeys = {
            ...searchKeys,
            ...defaultFilter({key, options, searchKeys}),
          }
      }
    }
  }

  return new Promise((resolve, reject) => {
    ProductsCategories.find({category_id: options.category_id}).then(
      (res) => {
        const productIdsByCategory = res.map((e) => e.product_id)
        console.log(searchKeys, 'searchKeys')
        const paramsArray = Object.keys(JSON.parse(JSON.stringify(searchKeys)))
        console.log(paramsArray, 'searchKeys')
        const buildQueryParams = paramsArray.reduce((acc, next) => {
          if (
            typeof searchKeys[next] == 'object' &&
            searchKeys[next]?.length > 0
          ) {
            return {...acc, [next]: {$in: searchKeys[next]}}
          } else {
            return {...acc, [next]: searchKeys[next]}
          }
        }, {})
        console.log(
          buildQueryParams,
          'buildQueryParamsbuildQueryParamsbuildQueryParams',
        )

        if (Object.keys(buildQueryParams)[0] !== 'text_value') {
          var productIds
          console.log(buildQueryParams, 'buildQueryParams')
          ProductAttributeValues.find({...buildQueryParams}).then((res) => {
            console.log(productIdsByCategory, 'productIdsByCategory')
            productIds = productIdsByCategory.filter((id) => {
              const find = res.find((e) => e.product_id == id)
              if (find) {
                return id
              }
            })
            console.log(productIds, 'productIds')
            const productsPromise = new Promise((resolve, reject) => {
              Products.find({id: {$in: productIds}}).then((products) =>
                resolve({products}),
              )
            })

            const minMaxPricePromise = new Promise((resolve, reject) => {
              /**
               *  @info: Min max price Only category Id , wihtout all filtered attributes, need to overwrite
               *
               * */
              let object
              let date_now = null
              console.log(productIds, 'aaaaaaaaaaaa')
              if (productIds.length > 0) {
                object = {
                  locale: locale,
                  product_id: {$in: productIds},
                }
              } else {
                object = {
                  locale: locale,
                }
              }
              console.log(productIds.length, object, 'aaaaaaaaaaaa')
              // console.log(options["price"], 'options["price"]options["price"]');
              if (options['price']) {
                const [from, to] = options['price'].split(',')
                // console.log(from, to);
                object = {
                  ...object,
                  price: {
                    $gte: from + '.0000',
                    $lte: parseFloat(to) + 10 + '.0000',
                  },
                }
              }
              console.log(object)
              if (options['savings']) {
                const d = new Date(),
                  month = '' + (d.getMonth() + 1),
                  day = '' + d.getDate(),
                  year = d.getFullYear()
                if (month.length < 2) month = '0' + month
                if (day.length < 2) day = '0' + day
                date_now = new Date(`${year}-${month}-${day}`).getTime()
                date_now = '' + date_now
                date_now = parseInt(date_now.slice(0, -3))
                /// console.log(date_now, "date now in product");

                object = {
                  ...object,
                  special_price: {$ne: null},
                }

                ProductFlat.where('special_price_from')
                  .lte(date_now)
                  .where('special_price_to')
                  .gte(date_now)
                  .countDocuments({...object})
                  .exec((count_error, count) => {
                    const pageCount = Math.ceil(count / limit)
                    const skip = (+page - 1) * limit
                    console.log(count, 'count')
                    ProductFlat.find({
                      ...object,
                    })
                      .skip(skip)
                      .limit(+limit)
                      .where('special_price_from')
                      .lte(date_now)
                      .where('special_price_to')
                      .gte(date_now)
                      .then((flatProducts) => {
                        const prices = flatProducts
                          .map((item) => parseInt(item.price))
                          .filter((e) => e)

                        resolve({
                          total: 20,
                          flatProducts,
                          prices: [0, prices[prices.length - 1] || 1000],
                          price: options['price'],
                        })
                      })
                  })
              } else {
                ProductFlat.countDocuments({...object}).exec(
                  (count_error, count) => {
                    const pageCount = Math.ceil(count / limit)
                    const skip = (+page - 1) * limit

                    ProductFlat.find({...object})
                      .skip(skip)
                      .limit(+limit)
                      .then((flatProducts) => {
                        const prices = flatProducts
                          .map((item) => parseInt(item.price))
                          .filter((e) => e)

                        resolve({
                          total: pageCount,
                          flatProducts,
                          prices: [0, prices[prices.length - 1] || 1000],
                          price: options['price'],
                        })
                      })
                  },
                )
              }
            })
            //  console.log(productsPromise, "optionsoptions");
            return Promise.all([productsPromise, minMaxPricePromise]).then(
              (response) => {
                const productsAndMinMaxPrice = arrayConvertToObject(
                  parseClone(response),
                )

                if (options['savings'] || options['price']) {
                  buildProductsListCollection({
                    locale,
                    resolve,
                    flat: true,
                    price: productsAndMinMaxPrice.price,
                    savings: options['savings'],
                    ...productsAndMinMaxPrice,
                  })
                } else {
                  buildProductsListCollection({
                    page,
                    locale,
                    resolve,
                    // price: options["price"],
                    flat: false,
                    ...productsAndMinMaxPrice,
                  })
                }
              },
            )
          })
        } else {
          ProductFlat.find({
            name: {$regex: Object.values(buildQueryParams)[0], $options: 'i'},
            // name: { $regex: ".*" + Object.values(buildQueryParams)[0] + ".*" },
          }).then((flatProducts) => {
            build({flatProducts, locale, resolve, type: 'data', ...rest})
          })
        }
      },
    )
  })
}


function Get_Products_By_Slug(params, options) {
  const {locale, token} = options
  const {productSlug} = params
  return new Promise((resolve, reject) => {
    ProductFlat.findOne({
      $or: [
        {locale: locale, url_key: productSlug},
        // { locale: "en", url_key: productSlug },
      ],
    }) // make flat by locale request
      .then((item) => {
        const productFlat = parseClone(item)
        const {product_id} = productFlat
        const p1 = new Promise((resolve, reject1) => {
          ProductImages.find({product_id})
            .then((res) => {
              resolve({ProductImages: res})
            })
            .catch((err) => reject1(err))
        })

        const p2 = new Promise((resolve, reject2) => {
          Products.findOne({id: product_id})
            .then((res) => {
              resolve({Products: res})
            })
            .catch((err) => reject2(err))
        })

        const p3 = new Promise((resolve, reject3) => {
          ProductInventories.find({product_id})
            .then((res) => {
              resolve({ProductInventories: res})
            })
            .catch((err) => reject3(err))
        })

        const p4 = new Promise((resolve, reject4) => {
          ProductsCategories.find({product_id})
            .then((res) => {
              resolve({cats: res.map((e) => e.category_id)})
            })
            .catch((err) => reject4(err))
        })

        // overwrite only if configurable product, check is that need simple products
        const variants = new Promise((resolve, reject4) => {
          Products.find({parent_id: product_id}).then((products) => {
            const productsIds = products.map((product) => product.id)

            const images = new Promise((resolve, reject) => {
              ProductImages.find({product_id: {$in: productsIds}})
                .then((images) => {
                  resolve({variantsImages: images})
                })
                .catch((err) => reject(err))
            })

            const flates = new Promise((resolve, reject) => {
              ProductFlat.find({
                locale: locale,
                product_id: {$in: productsIds},
              }).then((flats) => {
                // console.log(flats, "productsIdsproductsIdsproductsIds");
                resolve({variantsFlates: flats})
              })
            })

            const inventories = new Promise((resolve, reject) => {
              ProductInventories.find({product_id: {$in: productsIds}})
                .then((inventories) => {
                  resolve({variantsInventories: inventories})
                })
                .catch((err) => reject(err))
            })

            return Promise.all([images, flates, inventories]).then(
              (response) => {
                const collection = arrayConvertToObject(parseClone(response))

                const variants = []
                for (let i = 0; i < collection.variantsFlates.length; i++) {
                  const currentProduct = collection.variantsFlates[i]

                  const imagesFind = collection.variantsImages.filter(
                    (e) => e.product_id == currentProduct.product_id,
                  )
                  const InventoriesFind = collection.variantsInventories.find(
                    (e) => e.product_id === currentProduct.product_id,
                  )

                  const {path} = imagesFind[0]
                  const base_imag = makeImageClone(path)
                  const images = imagesFind.map((e) => makeImageClone(e.path))
                  delete currentProduct['product']

                  const object = {
                    ...currentProduct,
                    images,
                    base_imag,
                    ...InventoriesFind,
                  }
                  variants.push(object)
                }

                resolve({variants})
              },
            )
          })
        })

        return Promise.all([p1, p2, p3, p4, variants]).then((response) => {
          const collection = arrayConvertToObject(response)

          const variants = collection.variants
          const cats = parseClone(collection.cats)
          const flatData = parseClone(productFlat || [])
          const products = parseClone(collection.Products)
          const imagesData = parseClone(collection.ProductImages)
          const inventoriesData = parseClone(
            collection.ProductInventories[0] || [],
          )
          const {path} = imagesData[0]
          const base_imag = makeImageClone(path)
          const images = imagesData.map((e) => makeImageClone(e.path))
          ////  flatData["parent_id"] = flatData["product"].parent_id;
          delete flatData['product']

          const obj = {
            ...products,
            ...flatData,
            ...inventoriesData,
            cats,
            images,
            base_imag,
            variants: variants,
          }

          resolve(obj)
        })
      })
  }).catch((err) => reject(err))
}


function Get_Related_Products(options) {
  // currency: AMD / will work on it
  const {locale, limit, currency, category_id, product_id} = options
  // console.log(category_id, 'category id in product controller')
  return new Promise((resolve, reject) => {

    RelatedProducts.find({
      parent_id: {$in: product_id.split(',')},
    })
      .then((res) => {
        // console.log(res.length, 'related res in test')
        if (res.length > 0) {
          const productIds = res.map((e) => e.child_id)
          Products.find({id: {$in: productIds}})
            .limit(8)
            .then((products) => {
              const promiseArray = products.map((item) => {

                return new Promise((resolve, reject) => {
                  const product = parseClone(item)

                  const p1 = new Promise((resolve1, reject1) => {
                    ProductImages.find({product_id: product.id})
                      .then((res) => {
                        resolve1({ProductImages: res})
                      })
                      .catch((err) => reject(err))
                  })

                  const p2 = new Promise((resolve2, reject2) => {
                    ProductFlat.find({locale, product_id: product.id})
                      .then((res) => {
                        resolve2({productFlat: res})
                      })
                      .catch((err) => reject(err))
                  })

                  const p3 = new Promise((resolve3, reject3) => {
                    ProductInventories.find({product_id: product.id})
                      .then((res) => {
                        resolve3({ProductInventories: res})
                      })
                      .catch((err) => reject(err))
                  })

                  return Promise.all([p1, p2, p3]).then((response) => {
                    const collection = arrayConvertToObject(response)
                    const imagesData = parseClone(collection.ProductImages)
                    const flatData = parseClone(collection.productFlat[0] || [])
                    const inventoriesData = parseClone(
                      collection.ProductInventories[0] || [],
                    )
                    if (imagesData.length == 0) {
                      const obj = {
                        ...product,
                        ...flatData,
                        ...inventoriesData,
                      }

                      resolve(obj)
                    } else {
                      const {path} = imagesData[0]
                      const base_imag = makeImageClone(path)
                      const images = imagesData.map((e) => makeImageClone(e.path))

                      const obj = {
                        ...product,
                        ...flatData,
                        ...inventoriesData,
                        base_imag,
                        images,
                      }

                      resolve(obj)
                    }
                  })
                })
              })

              return Promise.all(promiseArray).then((response) => {
                resolve(response)
              })
            })
        } else {
          ProductsCategories.find({
            category_id: {$in: category_id.split(',')},
          }).then((res) => {
            // console.log(res, 'else res in test')
            const productIds = res.map((e) => e.product_id)
            // console.log(productIds, 'else product id in product controller')
            Products.find({id: {$in: productIds}})
              .limit(8)
              .then((products) => {
                const promiseArray = products.map((item) => {
                  if (item.product_id === product_id) {
                    return
                  }
                  // console.log(item, 'else item product in test')

                  return new Promise((resolve, reject) => {
                    const product = parseClone(item)

                    const p1 = new Promise((resolve1, reject1) => {
                      ProductImages.find({product_id: product.id})
                        .then((res) => {
                          resolve1({ProductImages: res})
                        })
                        .catch((err) => reject(err))
                    })

                    const p2 = new Promise((resolve2, reject2) => {
                      ProductFlat.find({locale, product_id: product.id})
                        .then((res) => {
                          resolve2({productFlat: res})
                        })
                        .catch((err) => reject(err))
                    })

                    const p3 = new Promise((resolve3, reject3) => {
                      ProductInventories.find({product_id: product.id})
                        .then((res) => {
                          resolve3({ProductInventories: res})
                        })
                        .catch((err) => reject(err))
                    })

                    return Promise.all([p1, p2, p3]).then((response) => {
                      const collection = arrayConvertToObject(response)
                      const imagesData = parseClone(collection.ProductImages)
                      const flatData = parseClone(collection.productFlat[0] || [])
                      const inventoriesData = parseClone(
                        collection.ProductInventories[0] || [],
                      )
                      if (imagesData.length == 0) {
                        const obj = {
                          ...product,
                          ...flatData,
                          ...inventoriesData,
                        }

                        resolve(obj)
                      } else {
                        const {path} = imagesData[0]
                        const base_imag = makeImageClone(path)
                        const images = imagesData.map((e) => makeImageClone(e.path))

                        const obj = {
                          ...product,
                          ...flatData,
                          ...inventoriesData,
                          base_imag,
                          images,
                        }

                        resolve(obj)
                      }
                    })
                  })
                })

                return Promise.all(promiseArray).then((response) => {
                  resolve(response)
                })
              })
              .catch((err) => reject(err))
          })
        }
      })
  })
}


function Get_Up_Sell_Products(options) {
  const {locale, limit, currency, product_id} = options
  return new Promise((resolve, reject) => {

    UpSellProducts.find({
      parent_id: {$in: product_id.split(',')},
    })
      .then((res) => {
        // console.log(res.length, 'upsell res in test')
        if (res.length > 0) {
          const productIds = res.map((e) => e.child_id)
          // console.log(productIds, "prod id in upsell")
          Products.find({id: {$in: productIds}})
            .limit(8)
            .then((products) => {
              const promiseArray = products.map((item) => {

                return new Promise((resolve, reject) => {
                  const product = parseClone(item)

                  const p1 = new Promise((resolve1, reject1) => {
                    ProductImages.find({product_id: product.id})
                      .then((res) => {
                        resolve1({ProductImages: res})
                      })
                      .catch((err) => reject(err))
                  })

                  const p2 = new Promise((resolve2, reject2) => {
                    ProductFlat.find({locale, product_id: product.id})
                      .then((res) => {
                        resolve2({productFlat: res})
                      })
                      .catch((err) => reject(err))
                  })

                  const p3 = new Promise((resolve3, reject3) => {
                    ProductInventories.find({product_id: product.id})
                      .then((res) => {
                        resolve3({ProductInventories: res})
                      })
                      .catch((err) => reject(err))
                  })

                  return Promise.all([p1, p2, p3]).then((response) => {
                    const collection = arrayConvertToObject(response)
                    const imagesData = parseClone(collection.ProductImages)
                    const flatData = parseClone(collection.productFlat[0] || [])
                    const inventoriesData = parseClone(
                      collection.ProductInventories[0] || [],
                    )
                    if (imagesData.length == 0) {
                      const obj = {
                        ...product,
                        ...flatData,
                        ...inventoriesData,
                      }

                      resolve(obj)
                    } else {
                      const {path} = imagesData[0]
                      const base_imag = makeImageClone(path)
                      const images = imagesData.map((e) => makeImageClone(e.path))

                      const obj = {
                        ...product,
                        ...flatData,
                        ...inventoriesData,
                        base_imag,
                        images,
                      }

                      resolve(obj)
                    }
                  })
                })
              })


              return Promise.all(promiseArray).then((response) => {
                // console.log(response, "response  in upsel product________")
                resolve(response)
              })
            })
        } else {
          resolve(res)
        }
      })
  })
}


function Get_Cross_Sell_Products(options) {
  const {locale, limit, currency, product_id} = options
  return new Promise((resolve, reject) => {

    CrosselProducts.find({
      parent_id: {$in: product_id.split(',')},
    })
      .then((res) => {
        // console.log(res.length, 'crossSell res in test')
        if (res.length > 0) {
          const productIds = res.map((e) => e.child_id)
          Products.find({id: {$in: productIds}})
            .limit(8)
            .then((products) => {
              const promiseArray = products.map((item) => {

                return new Promise((resolve, reject) => {
                  const product = parseClone(item)

                  const p1 = new Promise((resolve1, reject1) => {
                    ProductImages.find({product_id: product.id})
                      .then((res) => {
                        resolve1({ProductImages: res})
                      })
                      .catch((err) => reject(err))
                  })

                  const p2 = new Promise((resolve2, reject2) => {
                    ProductFlat.find({locale, product_id: product.id})
                      .then((res) => {
                        resolve2({productFlat: res})
                      })
                      .catch((err) => reject(err))
                  })

                  const p3 = new Promise((resolve3, reject3) => {
                    ProductInventories.find({product_id: product.id})
                      .then((res) => {
                        resolve3({ProductInventories: res})
                      })
                      .catch((err) => reject(err))
                  })

                  return Promise.all([p1, p2, p3]).then((response) => {
                    const collection = arrayConvertToObject(response)
                    const imagesData = parseClone(collection.ProductImages)
                    const flatData = parseClone(collection.productFlat[0] || [])
                    const inventoriesData = parseClone(
                      collection.ProductInventories[0] || [],
                    )
                    if (imagesData.length == 0) {
                      const obj = {
                        ...product,
                        ...flatData,
                        ...inventoriesData,
                      }

                      resolve(obj)
                    } else {
                      const {path} = imagesData[0]
                      const base_imag = makeImageClone(path)
                      const images = imagesData.map((e) => makeImageClone(e.path))

                      const obj = {
                        ...product,
                        ...flatData,
                        ...inventoriesData,
                        base_imag,
                        images,
                      }

                      resolve(obj)
                    }
                  })
                })
              })
              return Promise.all(promiseArray).then((response) => {
                resolve(response)
              })
            })
        } else {
          resolve(res)
        }
      })
  })
}


function Get_Configurable_Config(configurableId) {
  return new Promise((resolve, reject) => {
    // there are problem in Admin, attributes collection is empty
    Products.findOne({id: configurableId}).then((items) => {
      const product = parseClone(items)

      ProductSuperAttributes.find({product_id: product.id}).then(
        (productSuperAttribute) => {
          const superAttributes = parseClone(productSuperAttribute)
          const attrinutesKeysList = superAttributes.map((attrObj) => {
            const key = Object.keys(attrObj).find((key) => {
              if (key != '_id' && key != 'product_id') {
                return key
              }
            })
            return key
          })

          return new Promise((resolve, reject) => {
            Attributes.find({code: {$in: attrinutesKeysList}}).then(
              (items) => {
                const attributes = parseClone(items)
                const attributesId = attributes.map((e) => e.id)

                return new Promise((resolve, reject) => {
                  AttributeOptions.find({
                    attribute_id: {$in: attributesId},
                  }).then((items) => {
                    resolve(parseClone(items))
                  })
                }).then((options) => {
                  resolve({
                    attributesId,
                    attributes,
                    options,
                  })
                })
              },
            )
          }).then(
            ({attributesId, attributes: responseAttributes, options}) => {
              // in each option need be [product_id]

              // // overwrite promise All
              // // ProductAttributeValues
              // // Products

              ProductAttributeValues.find({
                attribute_id: {$in: attributesId},
              }).then((res) => {
                const productsAttributesValues = parseClone(res)
                // console.log(
                //   productsAttributesValues,
                //   "productsAttributesValuesproductsAttributesValues"
                // );
                Products.find({parent_id: product.id}).then((items) => {
                  const simplesProducts = parseClone(items)
                  const simplesProductsIds = simplesProducts.map((e) => e.id)
                  // ########################################## attributes

                  let index = {}
                  let attributes = responseAttributes.map((attr) => {
                    const {code} = attr

                    const customOptionsCollection = []
                    const attributeValuesFiltered = productsAttributesValues
                      .filter((values) => values.attribute_id == attr.id)
                      .filter((attribute) => {
                        if (simplesProductsIds.includes(attribute.product_id)) {
                          return attribute
                        }
                      })

                    // ############ index
                    for (let i = 0; i < attributeValuesFiltered.length; i++) {
                      const attributeValue = attributeValuesFiltered[i]
                      let optionId = null
                      const keys = Object.keys(attributeValue)
                      for (let i = 0; i < keys.length; i++) {
                        const key = keys[i]
                        if (
                          key != '_id' &&
                          key != 'product_id' &&
                          key != 'attribute_id' &&
                          key != 'id' &&
                          attributeValue[key]
                        ) {
                          optionId = attributeValue[key]
                          break
                        }
                      }
                      if (index[attributeValue.product_id]) {
                        index[attributeValue.product_id][
                          attributeValue.attribute_id
                          ] = optionId
                      } else {
                        index[attributeValue.product_id] = {
                          [attributeValue.attribute_id]: optionId,
                        }
                      }
                    }

                    const attributeValues = attributeValuesFiltered.map(
                      (attribute) => {
                        let optionId = null

                        const keys = Object.keys(attribute)
                        for (let i = 0; i < keys.length; i++) {
                          const key = keys[i]
                          if (
                            key != '_id' &&
                            key != 'product_id' &&
                            key != 'attribute_id' &&
                            key != 'id' &&
                            attribute[key]
                          ) {
                            optionId = attribute[key]
                            break
                          }
                        }

                        const found = options.find(
                          (option) => option.id == optionId,
                        )
                        if (found) {
                          return found
                        }
                      },
                    )

                    const results = attributeValues.filter((element) => {
                      return element !== undefined
                    })
                    results.forEach((option) => {
                      if (
                        !customOptionsCollection.find(
                          (opt) =>
                            opt.attribute_id == option.attribute_id &&
                            opt.id == option.id,
                        )
                      ) {
                        const products = []
                        for (let key in index) {
                          if (
                            key &&
                            index[key] &&
                            index[key][option.attribute_id] &&
                            index[key][option.attribute_id] == option.id
                          ) {
                            products.push(parseInt(key))
                          }
                        }
                        customOptionsCollection.push({
                          ...option,
                          products: products,
                        })
                      }
                    })

                    const {product_id} = superAttributes.find((superAttr) => {
                      const keys = Object.keys(superAttr)
                      if (keys.includes(code)) {
                        return superAttr
                      }
                    })

                    return {
                      id: attr.id,
                      code: attr.code,
                      label: attr.admin_name,
                      options: customOptionsCollection,
                      swatch_type: null,
                      product_id,
                    }
                  })

                  // ########################################## varaints image
                  const imageVariants = new Promise((resolve, reject) => {
                    ProductImages.find({
                      product_id: {$in: items.map((e) => e.id)},
                    }).then((images) => {
                      const imagesCollection = images.reduce((acc, next) => {
                        if (acc[next.product_id]?.length > 0) {
                          const newArray = acc[next.product_id]
                          newArray.unshift(makeImageClone(next.path))
                          return {...acc, [next.product_id]: [newArray]}
                        }
                        return {
                          ...acc,
                          [next.product_id]: [makeImageClone(next.path)],
                        }
                      }, {})
                      resolve({images: imagesCollection})
                    })
                  })

                  // ########################################## varaints price
                  const imagePriceVariantes = new Promise((resolve, reject) => {
                    ProductFlat.find({
                      product_id: {$in: items.map((e) => e.id)},
                    })
                      .then((flats) => {
                        const titleDescVariantes = flats.reduce((acc, next) => {
                          return {
                            ...acc,
                            [next.product_id]: {
                              title: next.name,
                              description: next.description,
                            },
                          }
                        }, {})

                        const priceVariantes = flats.reduce((acc, next) => {
                          return {
                            ...acc,
                            [next.product_id]: {
                              final_price: {
                                formated_price:
                                  'static string by david check that with Ruben',
                                price:
                                  'static string by david check that with Ruben',
                              },
                              regular_price: {
                                formated_price:
                                  'static string by david check that with Ruben',
                                price:
                                  'static string by david check that with Ruben',
                              },
                            },
                          }
                        }, {})

                        resolve({
                          variant_prices: priceVariantes,
                          variant_title_desc: titleDescVariantes,
                        })
                      })
                      .catch((err) => reject(err))
                  })

                  return Promise.all([imageVariants, imagePriceVariantes]).then(
                    (res) => {
                      const response = arrayConvertToObject(res)

                      const mainResponse = {
                        attributes: attributes,
                        chooseText: 'Choose an option',
                        index: index,
                        variant_images: response.images,
                        variant_prices: response.variant_prices,
                        variant_title_desc: response.variant_title_desc,
                        variant_videos: [],
                        regular_price: {
                          formated_price: '$1.00',
                          price: '1.0000',
                        },

                        // need to do dynamic by beckend
                        // regular_price: {formated_price: "$1.00", price: "1.0000"},
                        // variant_videos: {526: [], 527: []}
                      }

                      resolve({data: mainResponse})
                    },
                  )
                })
              })
            },
          )
        },
      )
    })
  })
}


// i am frontend developer...)))

function Get_Product_Type() {
  return new Promise((resolve, reject) => {
    let productID = null
    let parentID = null
    const products = new Promise((resolve, reject) => {
      Products.find()
        .then((item) => {
          resolve(item)
          // resolve({ productID:item.product_id } )
        })
        .catch((err) => reject(err))
    })
    // const productFlats = new Promise((resolve, reject2) => {
    //   ProductFlat.find()
    //     .then((res) => {
    //       console.log(res, 'productsFlat into')
    //       resolve(res)
    //     })
    //     .catch((err) => reject2(err))
    // })
    // return Promise.all([products, productFlats])
    //   .then(resp => {
    //     // resolve(resp)
    //   })
  }).catch((err) => reject(err))
}


exports.Get_Product_Type = Get_Product_Type
exports.Get_Configurable_Config = Get_Configurable_Config
exports.Get_Related_Products = Get_Related_Products
exports.Get_Up_Sell_Products = Get_Up_Sell_Products
exports.Get_Cross_Sell_Products = Get_Cross_Sell_Products
exports.Get_Products_By_Slug = Get_Products_By_Slug
exports.Get_Product_list = Get_Product_list
exports.Get_New_And_Futured_Products = Get_New_And_Futured_Products

// exports.Get_New_Products = Get_New_Products
// exports.Get_featured_Products = Get_featured_Products
