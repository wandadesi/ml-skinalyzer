// import { useEffect, useState } from "react";
// import { db } from "../firebase"; // pastikan path ini sesuai dengan file firebase.js
// import { collection, getDocs } from "firebase/firestore";

// interface IRResult {
//   name: string;
//   price: string;
//   how_to_use: string;
//   image_url: string;
// }

// export default function Rekomendasi() {
//   const [products, setProducts] = useState<IRResult[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "analyses"));
//         const allResults: IRResult[] = [];

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const ir_results = data.ir_results;

//           if (Array.isArray(ir_results)) {
//             ir_results.forEach((item: any) => {
//               allResults.push({
//                 name: item.name,
//                 price: item.price,
//                 how_to_use: item.how_to_use,
//                 image_url: item.image_url,
//               });
//             });
//           }
//         });

//         setProducts(allResults);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <h3 className="font-montserrat! text-lg font-semibold text-blue-600 mb-6 text-left">
//         Recommended Products for Your Skin
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {products.map((product, index) => (
//           <div key={index} className="border border-blue-200 rounded-lg p-4 flex items-start gap-4 text-left">
//             <img
//               src={product.image_url}
//               alt={product.name}
//               className="w-28 h-auto object-contain"
//             />
//             <div>
//               <h4 className="font-montserrat! text-base font-semibold mb-1">
//                 {product.name}
//               </h4>
//               <p className="font-montserrat! text-sm text-gray-700 mb-2">{product.price}</p>
//               <p className="font-montserrat! text-sm font-semibold mb-1">How to use</p>
//               <ul className="font-montserrat! text-sm list-disc list-inside text-gray-700 space-y-1">
//                 {product.how_to_use.split("\n").map((step, i) => (
//                   <li key={i}>{step.trim()}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
