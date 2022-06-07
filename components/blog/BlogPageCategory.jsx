// react
import React, {useState, useRef, useMemo} from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Helmet} from "react-helmet-async";
import queryString from "query-string";
import Head from "next/head";
import Pagination from "../NewPagination";
// application
import shopApi from "../../api/shop";
import BlockLoader from "../blocks/BlockLoader";
import PageHeader from "../shared/PageHeader";
import PostCard from "../shared/PostCard";
import theme from "../../data/theme";
import {url, apiUrlWithStore} from "../../helper";
import {MetaWrapper} from "../../components/MetaWrapper";

function buildQuery(options) {
  const params = {};
  if (options.page !== 1) {
    params.page = options.page;
  }
  return queryString.stringify(params, {encode: false});
}

const BlogPageCategory = (props) => {
  const selectedData = useSelector((state) => state.locale.code);
  const [page, setPage] = useState(props.blog.current_page);
  const [blogs, setBlogs] = useState(props.blog.data);
  const [total, setTotal] = useState(props.blog.total);
  const [currentPage, setCurrentPage] = useState(1);
  let PageSize = 9;

  const prevLocaleCodeRef = useRef();
  const prevPageRef = useRef();

  useEffect(() => {
    prevPageRef.current = page;
    prevLocaleCodeRef.current = selectedData;
  }, []);

  useEffect(() => {
    if (page > 1) {
      const query = buildQuery({page});
      const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
      window.history.replaceState(null, "", location);
    } else {
      const location = `${window.location.pathname}`;
      window.history.replaceState(null, "", location);
    }
  }, [page]);

  useEffect(() => {
    // if (
    //   prevLocaleCodeRef.current != selectedData ||
    //   prevPageRef.current != page
    // ) {
    // try {
    // fetch(
    //   apiUrlWithStore(
    //     `/db/cms/blogs?locale=${selectedData}&page=${page}&limit=6`
    //   )
    // )
    //   .then((response) => response.json())
    //   .then((res) => {
    //     setBlogs(res.data);
    //     setPage(+res.meta.current_page);
    //     setTotal(res.meta.total);
    //   });
    // }catch (e) {
    //   console.log(e)
    // }
    // shopApi.getBlogs({ locale: selectedData, page, limit: 6 })
    //   .then(res => {
    //     prevLocaleCodeRef.current = selectedData;
    //     prevPageRef.current = res.meta.current_page
    //
    //     setBlogs(res.data);
    //     setPage(+res.meta.current_page);
    //     setTotal(res.meta.total);
    //   })
    // }
  }, [selectedData]);

  const handlePageChange = (page) => {
    setPage(page);
  };
  console.log(props.blog.data.length, 'props.blog.data.length')

  const {layout, sidebarPosition, dbName, domain} = props;

  const breadcrumb = [
    {title: <FormattedMessage id="home" defaultMessage="Home"/>, url: ""},
    {title: <FormattedMessage id="blog" defaultMessage="Blog"/>, url: "/page/blogs"},
  ];

  if (!props.blog.data) {
    return <BlockLoader/>;
  }

  const schemaBlog = {
    "@context": `https://schema.org/`,
    "@type": "Blog",
    "name": "Page blogs",
    "url": `${url}/page/blogs`,
    "offers": [],
  };
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.blog.data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  const logoPath = `configuration/logo/logo.webp`;
  const postsList = currentTableData.map((post) => {
    // let pos = post.translations.find(item => item.locale === selectedData);
    // pos.image=post.image
    const postLayout = {
      classic: "grid-lg",
      grid: "grid-nl",
      list: "list-nl",
    }[layout];

    schemaBlog.offers.push({
      "@type": "BlogPosting",
      // "id": post.id.toString(),
      "image": `https://${props.domain}/storage/${props.dbName}/${logoPath}`,
      "name": post.blog_title,
      "description": post.html_content,
    });

    return (
      <div key={post.id} className="posts-list__item">
        <PostCard post={post} dbName={dbName} layout={postLayout} domain={domain}/>
      </div>
    );
  });
  return (
    <MetaWrapper
      title={`Blog Category Page — ${props.pageSlug}`}
      m_title={props.pageSlug}
      m_desc={props.pageSlug}
      m_key={props.pageSlug}
      m_img={false}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(schemaBlog)}}
        />
      </Head>
      <PageHeader header="Latest News" breadcrumb={breadcrumb}/>
      <div className="container">
        <div className="row">
          {/* {sidebarStart} */}
          <div className="col-12 col-md-12">
            <h1 className="blog-page-title">
              <FormattedMessage id="blog" defaultMessage="Blog"/>
            </h1>
            {postsList.length ? (
              <div className="block">
                <div className="posts-view">
                  <div
                    className={`posts-view__list posts-list posts-list--layout--${layout}`}
                  >
                    <div className="posts-list__body">{postsList}</div>
                  </div>
                  <div className="posts-view__pagination">
                    { currentTableData &&
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={props.blog.data.length}
                            pageSize={PageSize}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    }
                    {/*{postsList && postsList.length < 20 ? (*/}
                    {/*  <></>*/}
                    {/*) : (*/}
                    {/*  <Pagination*/}
                    {/*    current={+page}*/}
                    {/*    siblings={2}*/}
                    {/*    total={total}*/}
                    {/*    onPageChange={handlePageChange}*/}
                    {/*  />*/}
                    {/*)}*/}
                  </div>
                </div>
              </div>
            ) : (
              <div class="products-view__empty">
                <div class="products-view__empty-title">
                  <FormattedMessage
                    id="SorryNothingFoundFor"
                    defaultMessage="Sorry Nothing Was Found"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MetaWrapper>
    // <React.Fragment>
    //   <Head>
    //     <title>{`Blog Category Page — ${props.pageSlug}`}</title>
    //     <meta name="title" content={props.pageSlug}/>
    //     <meta name="description" content={props.pageSlug}/>
    //     <meta name="keywords" content={props.pageSlug}/>
    //     <meta property="og:title" name="title" content={props.pageSlug}/>
    //     <meta property="og:description" name="description" content={props.pageSlug}/>
    //     <meta property="og:keywords" name="keywords" content={props.pageSlug}/>
    //     <meta
    //       property="og:image"
    //       name="image"
    //       content={`https://${props.domain}/storage/${props.dbName}/${logoPath}`}
    //     />
    //     <meta name="twitter:card" content="summary_large_image"/>
    //     <meta name="twitter:title" content={props.pageSlug}/>
    //     <meta name="twitter:description" content={props.pageSlug}/>
    //     <meta name="twitter:image"
    //           content={`https://${props.domain}/storage/${props.dbName}/${logoPath}`}/>
    //
    //     <script
    //       type="application/ld+json"
    //       dangerouslySetInnerHTML={{__html: JSON.stringify(schemaBlog)}}
    //     />
    //   </Head>
    //   <PageHeader header="Latest News" breadcrumb={breadcrumb}/>
    //   <div className="container">
    //     <div className="row">
    //       {/* {sidebarStart} */}
    //       <div className="col-12 col-md-12">
    //         <h1 className="blog-page-title">
    //           <FormattedMessage id="blog" defaultMessage="Blog"/>
    //         </h1>
    //         {postsList.length ? (
    //           <div className="block">
    //             <div className="posts-view">
    //               <div
    //                 className={`posts-view__list posts-list posts-list--layout--${layout}`}
    //               >
    //                 <div className="posts-list__body">{postsList}</div>
    //               </div>
    //               <div className="posts-view__pagination">
    //                 {postsList && postsList.length < 20 ? (
    //                   <></>
    //                 ) : (
    //                   <Pagination
    //                     current={+page}
    //                     siblings={2}
    //                     total={total}
    //                     onPageChange={handlePageChange}
    //                   />
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         ) : (
    //           <div class="products-view__empty">
    //             <div class="products-view__empty-title">
    //               <FormattedMessage
    //                 id="SorryNothingFoundFor"
    //                 defaultMessage="Sorry Nothing Was Found"
    //               />
    //             </div>
    //           </div>
    // {/*        )}*/
    // }
    // {/*      </div>*/
    // }
    // {/*    </div>*/
    // }
    // {/*  </div>*/
    // }
    // {/*</React.Fragment>*/
    // }
  );
};

export default BlogPageCategory;
