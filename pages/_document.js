import Document, {Html, Head, Main, NextScript} from "next/document";
import {storeName} from "../helper";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    let domainName = null;
    if(ctx.req && Object.keys(ctx.req.headers)?.length > 0) {
      domainName = ctx.req.headers.host.split(".")[0]
      if (domainName == "www") {
        domainName = ctx.req.headers.host.split(".")[1];
      }
    }
    return {
      ...initialProps,
      domainName: domainName
        // ctx.req && Object.keys(ctx.req.headers)?.length > 0
        //   ? ctx.req.headers.host.split(".")[0]
        //   : "zegashop",
    };
  }

//   if (dbName.includes(".zegashop.com")) {
//   var dataName = dbName.split(".zegashop.com");
//   //// console.log(dataName);
//   databaseName = dataName[0];
//   process.env.domainName = dbName;
//
//   process.env.databaseName = databaseName;
// } else {
//   process.env.domainName = dbName;
//   databaseName = dbName.split(".")[0];
//   if (databaseName == "www") {
//     databaseName = dbName.split(".")[1];
//   }
//   process.env.databaseName = databaseName;
// }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            async
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
          />
          <link
            rel="shortcut icon"
            id="favicon"
            href={`/storage/${this.props.domainName}/configuration/favicon/favicon.webp`}
          />
          {/* <script dangerouslySetInnerHTML={{
                        __html: `!function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        `
                    }}
                    // fbq('init', ${props.fbPixel});
                    // fbq('init', 'ViewContent');
                    /> */}
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
