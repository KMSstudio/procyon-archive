// // @/app/components/unique/JeboSection.js

// "use client";

// import { useEffect, useState } from "react";

// export default function JeboSection({ jeboFolders }) {
//   const [expanded, setExpanded] = useState(null);
//   const [subfiles, setSubfiles] = useState({});

//   const toggleFolder = async (folderName) => {
//     if (expanded === folderName) {
//       setExpanded(null);
//       return;
//     }

//     if (!subfiles[folderName]) {
//       const res = await fetch(`/api/drive/list?path=jebo/${folderName}`);
//       const data = await res.json();
//       setSubfiles((prev) => ({ ...prev, [folderName]: data }));
//     }

//     setExpanded(folderName);
//   };

//   return (
//     <section id="jebo-section">
//       <h2>제보 리스트</h2>
//       {jeboFolders.length === 0 && <p>제보가 없습니다.</p>}
//       <ul>
//         {jeboFolders.map((folder) => (
//           <li key={folder.name}>
//             <button onClick={() => toggleFolder(folder.name)}>
//               {expanded === folder.name ? "▼" : "▶"} {folder.name}
//             </button>

//             {expanded === folder.name && (
//               <ul style={{ marginLeft: "20px" }}>
//                 {subfiles[folder.name]?.map((file) => (
//                   <li key={file.name}>
//                     📄 {file.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }