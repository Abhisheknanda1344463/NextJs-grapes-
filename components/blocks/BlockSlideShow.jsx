// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

// application
import { apiImageUrl } from "../../helper";
import Image from "components/hoc/Image";
import StroykaSlick from "../shared/StroykaSlick";
import departmentsAria from "../../services/departmentsArea";

const slickSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
};

class BlockSlideShow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slideLength: null,
    };
  }
  departmentsAreaRef = null;

  componentDidMount() {
    this.media = window.matchMedia("(min-width: 992px)");

    if (this.media.addEventListener) {
      this.media.addEventListener("change", this.onChangeMedia);
    } else {
      this.media.addListener(this.onChangeMedia);
    }
  }

  componentWillUnmount() {
    departmentsAria.area = null;

    if (this.media.removeEventListener) {
      this.media.removeEventListener("change", this.onChangeMedia);
    } else {
      // noinspection JSDeprecatedSymbols
      this.media.removeListener(this.onChangeMedia);
    }
  }

  onChangeMedia = () => {
    if (this.media.matches) {
      departmentsAria.area = this.departmentsAreaRef;
    }
  };

  setDepartmentsAreaRef = (ref) => {
    this.departmentsAreaRef = ref;

    if (this.media.matches) {
      departmentsAria.area = this.departmentsAreaRef;
    }
  };

  render() {
    const { withDepartments } = this.props;
    function openNewTabClickBuyNow(path) {
      window.open(path, "_blank");
    }
    const slides = this.props?.slideImages?.map((slide, index) => {
      const image = slide.path; //(withDepartments ? slide.image_classic : slide.image_full);
      const MobileImage = slide.mobile_path;
      return (
        <div key={index} className="block-slideshow__slide">
          <div className="block-slideshow__slide-image block-slideshow__slide-image--desktop">
            <Image
              src={`${apiImageUrl}/storage/${image}`}
              alt="zega slide"
              layout="fill"
              // rel="preload"
            />
          </div>
          <div className="block-slideshow__slide-image block-slideshow__slide-image--mobile">
            <Image
              src={`${apiImageUrl}/storage/${MobileImage}`}
              className="slider-mobile-img"
              alt="zega slide"
              layout="fill"
              // rel="preload"
            />
          </div>
          <div className="container">
            <div className="block-slideshow__slide-content">
              <div
                className="block-slideshow__slide-title"
                dangerouslySetInnerHTML={{ __html: slide.content }}
              />
              <div
                className="block-slideshow__slide-text"
                dangerouslySetInnerHTML={{ __html: slide.text }}
              />
              {slide.slider_path.length > 0 ? (
                <div className="block-slideshow__slide-button">
                  <button
                    onClick={() => openNewTabClickBuyNow(slide.slider_path)}
                    className="btn btn-orange slideshow-btn rounded-pill"
                  >
                    <FormattedMessage
                      id="slideshow-btn"
                      defaultMessage="Buy now"
                    />
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    });

    const blockClasses = classNames("block-slideshow", {
      "block-slideshow--layout--full": !withDepartments,
      "block-slideshow--layout--with-departments": withDepartments,
    });

    return (
      <div className={blockClasses}>
        <div>
          {withDepartments && (
            <div
              className="absolute col-3 d-lg-block d-none"
              ref={this.setDepartmentsAreaRef}
            />
          )}
          <div>
            <div className={`block-slideshow__body`}>
              <StroykaSlick {...slickSettings}>{slides}</StroykaSlick>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BlockSlideShow.propTypes = {
  withDepartments: PropTypes.bool,
  /** current locale */
  locale: PropTypes.string,
};

BlockSlideShow.defaultProps = {
  withDepartments: false,
};

const mapStateToProps = ({ general: { slideImages }, locale }) => ({
  locale,
  slideImages,
});

export default connect(mapStateToProps)(React.memo(BlockSlideShow));
