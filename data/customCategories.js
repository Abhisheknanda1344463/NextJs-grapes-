// import  React, { useEffect, useState } from 'react';
// import shopApi from '../../api/shop';
// // third-party
// import Link from 'next/link';

// // application
// import Menu from './Menu';
// import { ArrowRoundedRight6x9Svg } from '../../svg';

//  export default function Cat(params) {

//     const [departments,Setdepartments]=useState();

// useEffect(()=>{

//     shopApi.getCategories().then(res=>{

//         Setdepartments(res);

//     });

// },[])


//     const linksList = departments.map((department, index) => {
//         let arrow = null;
//         let submenu = null;
//         let itemClass = '';


//             if (department.children) {
//                 arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
//                 itemClass = 'departments__item--menu';
//                 submenu = (
//                 <div className="departments__menu">
//                     <Menu items={department.submenu.menu} />
//                 </div>
//                 );
//             }

//         if (department.children) {
//             arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
//         }


//         return (
//             <li key={index} className={`departments__item ${itemClass}`}>
//                 <Link href={department.url}>
                    // <>
                    //     {department.title}
                    //     {arrow}
                    // </>
//                 </Link>
//                 {submenu}
//             </li>
//         );
//     });

// }

