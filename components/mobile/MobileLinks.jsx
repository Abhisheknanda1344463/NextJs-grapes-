// react
import React from 'react'

// third-party
import PropTypes from 'prop-types'

// application
import AppLink from '../shared/AppLink'
import Collapse from '../shared/Collapse'
import { ArrowRoundedDown12x7Svg, CategorySVG, PagesSVG } from '../../svg'
import { FormattedMessage } from 'react-intl'



function MobileLinks(props) {
  const { links, level, onItemClick } = props


  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }
  const linksList = links.map((link, index) => {
    let item
    item = (
      <Collapse
        toggleClass="mobile-links__item--open"
        render={({ toggle, setItemRef, setContentRef }) => {
          let arrow
          let subLinks
          let linkOrButton
          if (link.type != 'header' && link.type != 'footer') link.type = 'link'
          if (
            (link.childs && link.childs.length > 0) ||
            (link.children && link.children.length > 0)
          ) {
            arrow = (
              <button
                className="mobile-links__item-toggle"
                type="button"
                onClick={toggle}
              >
                <ArrowRoundedDown12x7Svg className="mobile-links__item-arrow" />
              </button>
            )

            subLinks = (
              <div className={`mobile-links__item-sub-links`} ref={setContentRef}>
                <MobileLinks
                  links={link.childs || link.children}
                  level={level + 1}
                  onItemClick={onItemClick}
                />
              </div>
            )
          }

          if (link.type == 'button') {
            linkOrButton = (
              <button
                type="button"
                className="mobile-links__item-link"
                onClick={() => { handleItemClick(link) }}
              >
                {/*{link.translations.find(item => item.locale === selectedData).name} */}
                {link.name || link.label}
              </button>
            )
          } else {
            let href
            if (link.type === 'header' && link?.id || link.type === 'footer' && link?.id) {
              href = link.url_key
                ? '/page/' + link?.url_key
                : link?.custom_url
                  ? '/page/' + link?.custom_url
                  : link?.page_id ? '/page/' + link?.page_id : ''
            } else if (link?.category_icon_path && link?.slug) {
              href = `/catalog/${link?.slug ? link?.slug : ''}`
            } else {
              href = link.url_key
                ? '/' + link.url_key
                : link.custom_url
                  ? '/' + link.custom_url
                  : link?.page_id ? '/page/' + link?.page_id : ''
            }

            linkOrButton = (
              <>

                {link?.label?.props.id != 'categoies' ? (
                  <>
                    <span className="link-label-fms " onClick={toggle}>
                      <PagesSVG />
                      {link.label}
                    </span>
                    <AppLink
                      href={href}
                      className="mobile-links__item-link"
                      onClick={() => {
                        alert(link)
                        handleItemClick(link)
                        toggle()
                      }}
                    >
                      <button
                        type="button"
                        className="mobile-links__item-link "
                        onClick={() => {
                          handleItemClick(link)
                          toggle()
                        }}
                      >
                        {link.name}{' '}
                      </button>
                    </AppLink>
                  </>
                )
                  : (
                    <span className="link-label-fms" onClick={toggle}>
                      <CategorySVG />
                      <FormattedMessage
                        id="Menu.category"
                        defaultMessage="Category"
                      />
                    </span>
                  )}
              </>
            )
          }

          return (
            <div className={`mobile-links__item ${link.id === 1 ? 'mobile-links__item--open' : ''}`} ref={setItemRef}>
              {
                link.id === 1
                  ? <></>
                  : (
                    <div className="mobile-links__item-title">
                      {linkOrButton}
                      {arrow}
                    </div>
                  )
              }
              {subLinks}
            </div>
          )
        }}
      />
    )

    return <li key={index}>{item}</li>
  })

  return (
    <ul className={`mobile-links mobile-links--level--${level}`}>
      {linksList}
    </ul>
  )
}


MobileLinks.propTypes = {
  links: PropTypes.array,
  level: PropTypes.number,
  onItemClick: PropTypes.func,
}

MobileLinks.defaultProps = {
  links: [],
  level: 0,
}

export default MobileLinks
