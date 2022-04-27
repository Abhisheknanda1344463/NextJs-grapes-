import NextImage from "next/image";
import { url } from "../../helper";
import store from "../../store";

/**
 * HOC COMPONENT, checking if need to add path of start image
 * @params Image object src, alt, width etc.
 *
 * @response Wrraped Image
 *
 * Magic happens here
 * */

export default function Image(props) {
  const { onError = () => { } } = props;
  const {
    general: { domain },
  } = store.getState();

  // if(typeof props.src == 'string') {
  //     const imgData = {...props}
  //     const isCahce = imgData.src.indexOf('/cache/')
  //     if(isCahce != -1) {
  //         props.src = imgData.src.replace('/cache/', `/zega-accessories/cache/`)
  //     }
  // } else if(typeof props.src.src == 'string') {
  //     const imgData = {...props}
  //     const isCahce = imgData.src.src.indexOf('/cache/')
  //     if(isCahce != -1) {
  //         props.src.src = imgData.src.src.replace('/cache/', `/zega-accessories/cache/`)
  //     }
  // }

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    if (props && props.src && props.src.src) {
      // '//' it is for live after refresh
      return (
        <NextImage
          {...props}
          priority={true}
          src={`/themes/${process.env.themeFolder}${props.src.src}`}
          onError={onError}
        />
      );
    } else {
      // '/' it is for live after refresh
      // it's for images, refresh bug, wihtout replaces there is conflict with product card images and slide images
      //
      props.src = '/' + props.src
      // remove by Manvel searching case /;
      // props.src = props.src;
      props.src = props.src.replace("////", "//");
      props.src = props.src.replace("///", "//");
      return <NextImage {...props} onError={onError} priority={true} />;
    }
  } else {
    return <NextImage onError={onError} {...props} priority={true} />;
  }
}
