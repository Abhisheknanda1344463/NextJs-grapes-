// react
import React, { useState, useRef, useEffect } from 'react'
import { useSelector }                        from 'react-redux'

// third-party
import classNames from 'classnames'
import PropTypes  from 'prop-types'

// application
import BlockHeaderCustom from '../shared/BlockHeaderCustom'
import ProductCard       from '../shared/ProductCard'
import StroykaSlick      from '../shared/StroykaSlick'



const slickSettings = {
  'grid-4'   : {
    dots          : false,
    arrows        : false,
    infinite      : false,
    speed         : 400,
    slidesToShow  : 4,
    slidesToScroll: 4,
    responsive    : [
      {
        breakpoint: 992,
        settings  : {
          slidesToShow  : 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 991,
        settings  : {
          slidesToShow  : 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings  : {
          slidesToShow  : 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 479,
        settings  : {
          slidesToShow  : 1,
          slidesToScroll: 1,
        },
      },
    ],
  },
  'grid-4-sm': {
    dots          : false,
    arrows        : false,
    infinite      : false,
    speed         : 400,
    slidesToShow  : 4,
    slidesToScroll: 4,
    responsive    : [
      {
        breakpoint: 1199,
        settings  : {
          slidesToShow  : 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings  : {
          slidesToShow  : 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 474,
        settings  : {
          slidesToShow  : 1,
          slidesToScroll: 1,
        },
      },
    ],
  },
  'grid-5'   : {
    dots          : false,
    arrows        : false,
    infinite      : false,
    speed         : 400,
    slidesToShow  : 4,
    slidesToScroll: 4,
    responsive    : [
      {
        breakpoint: 1199,
        settings  : {
          slidesToShow  : 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 991,
        settings  : {
          slidesToShow  : 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings  : {
          slidesToShow  : 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 479,
        settings  : {
          slidesToShow  : 1,
          slidesToScroll: 1,
        },
      },
    ],
  },
  horizontal : {
    dots          : false,
    arrows        : false,
    infinite      : false,
    speed         : 400,
    slidesToShow  : 4,
    slidesToScroll: 4,
    responsive    : [
      {
        breakpoint: 991,
        settings  : {
          slidesToShow  : 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings  : {
          slidesToShow  : 1,
          slidesToScroll: 1,
        },
      },
    ],
  },
}

export default function BlockProductsCarousel (props) {
  const {
          rows,
          layout,
          title,
          locale,
          withSidebar,
          onGroupClick,
          groups,
          loading,
        } = props
  const slickRef = useRef(null)
  const [products, setProducts] = useState(props.products)

  const backorders = useSelector(state => state.general.coreConfigs.catalog_inventory_stock_options_backorders)
  const outOfStock = useSelector(state => state.general.coreConfigs.catalog_products_homepage_out_of_stock_items)

  const handleNextClick = () => {
    if (slickRef.current) {
      slickRef.current.slickNext()
    }
  }

  const handlePrevClick = () => {
    if (slickRef.current) {
      slickRef.current.slickPrev()
    }
  }

  const setSlickRef = (ref) => {
    slickRef.current = ref
  }
  let newProducts = products
  const productsColumns = () => {
    const columns = []
    if (rows > 0) {
      newProducts = newProducts.slice()
      while (newProducts.length > 0) {
        columns.push(newProducts.splice(0, rows))
      }
    }

    return columns
  }
  useEffect(() => {
    console.log(props.products, 'localelocale')
    setProducts(props.products)
  }, [locale])

  const columns = productsColumns().map((column, index) => {
    const productsData = column.map((product) => (
      product.qty === 0 && backorders == 0 && outOfStock == 0
        ? <></>
        : <div key={product.id} className="block-products-carousel__cell">
          <ProductCard product={product}/>
        </div>
    ))

    return (
      <div key={index} className="block-products-carousel__column">
        {productsData}
      </div>
    )
  })

  const blockClasses = classNames('block block-products-carousel', {
    'block-products-carousel--loading'  : loading,
    'block-products-carousel--has-items': columns.length > 0,
  })
  const containerClasses = classNames({
    container: !withSidebar,
  })

  return (
    <div className={blockClasses} data-layout={layout}>
      <div className={containerClasses}>
        <BlockHeaderCustom
          title={title}
          groups={groups}
          arrows
          autoplay={false}
          onNext={handleNextClick}
          onPrev={handlePrevClick}
          onGroupClick={onGroupClick}
        />

        <div className="block-products-carousel__slider">
          <div className="block-products-carousel__preloader"/>

          <StroykaSlick ref={setSlickRef} {...slickSettings[layout]}>
            {columns}
          </StroykaSlick>
        </div>
      </div>
    </div>
  )
}

BlockProductsCarousel.propTypes = {
  title       : PropTypes.string.isRequired,
  layout      : PropTypes.oneOf(['grid-4', 'grid-4-sm', 'grid-5', 'horizontal']),
  rows        : PropTypes.number,
  products    : PropTypes.array,
  groups      : PropTypes.array,
  withSidebar : PropTypes.bool,
  loading     : PropTypes.bool,
  onGroupClick: PropTypes.func,
}

BlockProductsCarousel.defaultProps = {
  layout      : 'grid-4',
  rows        : 1,
  products    : [],
  groups      : [],
  withSidebar : false,
  loading     : false,
  onGroupClick: undefined,
}
