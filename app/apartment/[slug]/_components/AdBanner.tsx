// import { useEffect } from 'react';
//
// const AdBanner = (props) => {
//     useEffect(() => {
//         try {
//             (window.adsbygoogle = window.adsbygoogle || []).push({});
//         } catch (err) {
//             console.log(err);
//         }
//     }, []);
//
//     return (
//         <ins
//             className="adsbygoogle adbanner-customize max-w-[375px]"
//             style={{
//                 display: 'block',
//                 overflow: 'hidden',
//                 width: 'auto'
//             }}
//             data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
//             {...props}
//         />
//     );
// };
// export default AdBanner;