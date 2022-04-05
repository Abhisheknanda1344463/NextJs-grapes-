import React from "react";

function Heading({ item }) {
  let tagEntry = `<${item.tag}>${item.text}</${item.tag}>`;
  //   var style = {};
  //   const [styles, setStyles] = useState([]);
  const setStyles = {};
  item.settings.map((style) => {
    setStyles[Object.keys(style)] = Object.values(style)[0];
  });
  //////console.log(setStyles, "setStylessetStyles");
  return (
    <>
      <div>
        <div
          //   style={() => {
          //     console.log(tem.settings, "tem.settings");
          //     item.settings.map(() => {
          //       return { marginRight: 20 + "px" };
          //     });
          //   }}
          style={{ ...setStyles }}
          ////id={componentData.id}
          // onClick={() => handleClick(componentData.id)}
          //// contentEditable={true}
          dangerouslySetInnerHTML={{
            __html: tagEntry,
          }}
        />
        {/* <style jsx>{`
          ${setStyles}
        `}</style> */}
      </div>
    </>
  );
}

export default Heading;
