// import "./Search.css";
// import { useState, useEffect } from "react";
// import Keyboard from "react-simple-keyboard";
// import "react-simple-keyboard/build/css/index.css";
// import axios from "axios";
// import CryptoJS from "crypto-js";

// export default function Search() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [secondApiResults, setSecondApiResults] = useState([]);
//   const [keyboardInput, setKeyboardInput] = useState("");
//   const [secondApiTotalResults, setSecondApiTotalResults] = useState(0);
//   const [secondApiTotalPages, setSecondApiTotalPages] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (searchQuery.trim() !== "") {
//       handleSearch();
//     }
//   }, [searchQuery]);

//   const handleSearch = () => {
//     const cleanedQuery = searchQuery.trim();

//     if (cleanedQuery) {
//       setIsLoading(true);
//       const secondApiUrl = "http://localhost:80/api/excel";

//       axios
//         .post(secondApiUrl, { term: cleanedQuery })
//         .then((response) => {
//           const encryptedData = response.data.data;
//           const secretKey = 'sawa2020!';
//           const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//           const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//           const secondApiData = decryptedData;

//           if (secondApiData && Array.isArray(secondApiData.Items)) {
//             const filteredResults = secondApiData.Items.filter(
//               (item) =>
//                 (item["Words.Kana"] && item["Words.Kana"].includes(cleanedQuery)) ||
//                 (item["Words.Meaning"] && item["Words.Meaning"].includes(cleanedQuery)) ||
//                 (item["Words.Short"] && item["Words.Short"].includes(cleanedQuery))
//             );

//             filteredResults.forEach((item) => {
//               if (item["الصور"] && item["الصور"].includes("drive.google.com/file/d/")) {
//                 const fileId = item["الصور"].split("/d/")[1].split("/")[0];
//                 item["الصور"] = `https://drive.google.com/thumbnail?id=${fileId}`;
//               } else {
//                 delete item["الصور"];
//               }

//               if (item["الأمثلة الصوتية"] && item["الأمثلة الصوتية"].includes("drive.google.com/file/d/")) {
//                 const fileId = item["الأمثلة الصوتية"].split("/d/")[1].split("/")[0];
//                 item["الأمثلة الصوتية"] = `https://drive.google.com/file/d/${fileId}/preview`;
//               } else {
//                 delete item["الأمثلة الصوتية"];
//               }
//             });

//             setSecondApiResults(filteredResults);
//             setSecondApiTotalResults(filteredResults.length);
//             setSecondApiTotalPages(Math.ceil(filteredResults.length / filteredResults.length));
//           } else {
//             setSecondApiResults([]);
//             setSecondApiTotalResults(0);
//             setSecondApiTotalPages(0);
//           }
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching data from second API:", error);
//           setSecondApiResults([]);
//           setSecondApiTotalResults(0);
//           setSecondApiTotalPages(0);
//           setIsLoading(false);
//         });
//     }
//   };

//   const onChange = (input) => {
//     setKeyboardInput(input);
//     setSearchQuery(input);
//   };

//   const handleKeyPress = (button) => {
//     if (button === "{space}") {
//       setKeyboardInput((prevInput) => prevInput + " ");
//       setSearchQuery((prevQuery) => prevQuery + " ");
//     }
//   };

//   const renderField = (label, value) => {
//     if (value) {
//       return (
//         <div className="field">
//           <strong>{label}:</strong> {value}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="App">
//       <div className="container mt-5">
//         <div className="SearchWord">
//           <input
//             type="text"
//             id="searchQuery"
//             name="searchQuery"
//             value={searchQuery}
//             placeholder="ادخل كلمة البحث هنا"
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           {isLoading && <span className="loading-text">...جار البحث</span>}
//         </div>
  
//         <div className="search-info">
//           <div>عدد نتائج البحث: {secondApiTotalResults}</div>
//           <div>عدد الصفحات: {secondApiTotalPages}</div>
//         </div>
  
//         <Keyboard
//           layoutName="default"
//           onChange={onChange}
//           onKeyPress={handleKeyPress}
//           layout={{
//             default: [
//               "ض ص ث ق ف غ ع ه خ ح ج د",
//               "ش س ي ب ل ا ت ن م ك ط",
//               "ئ ء ؤ ر لا ى ة و ز ظ",
//               "ذ 1 2 3 4 5 6 7 8 9 0 {bksp}",
//               "{space}",
//             ],
//           }}
//           display={{
//             "{bksp}": "حذف",
//             "{space}": "مسافة",
//           }}
//         />
  
//         <h2>نتائج البحث</h2>
  
//         {isLoading ? (
//           <div className="loading"></div>
//         ) : (
//           <div className="table-container">
//             {secondApiResults.length === 0 ? (
//               <div className="no-results">لم يتم العثور على نتائج</div>
//             ) : (
//               secondApiResults.map((item, index) => (
//                 <div key={index} className="entry">
//                   {renderField("Kana", item["Words.Kana"])}
//                   {renderField("Meaning Summary", item["Words.Meaning"])}
//                   {renderField("Short Meaning Summary", item["Words.Short"])}
//                   {renderField("Kanji", item["Words.Writings"])}
//                   {renderField("الكلمة", item["الكلمة"])}
//                   {renderField("المعنى", item["المعنى"])}
//                   {renderField("النطق", item["النطق"])}
//                   {renderField("التعريف", item["التعريف"])}
//                   {renderField("الأمثلة", item["الأمثلة"])}
//                   {renderField("التصنيف النحوي", item["التصنيف النحوي"])}
//                   {renderField("الاشتقاقات و التصريفات", item["الاشتقاقات و التصريفات"])}
//                   {renderField("الملاحظات الثقافية", item["الملاحظات الثقافية"])}
//                   {renderField("المصادر و المراجع", item["المصادر و المراجع"])}
//                   {item["الأمثلة الصوتية"] ? (
//                     <iframe src={item["الأمثلة الصوتية"]} width="50%" height="60" allow="autoplay"></iframe>
//                   ) : null}
//                   {renderField("المرادف", item["المرادف"])}
//                   {renderField("العبارات الاصطلاحية", item["العبارات الاصطلاحية"])}
//                   {renderField("الاستعمالات الشائعة", item["الاستعمالات الشائعة"])}
//                   {renderField("الرمز و الأصل اللغوي", item["الرموز والأصل اللغوي"])}
//                   {renderField("الصور" , item["الصور"] ? (  <img src={item["الصور"]} alt="Search Result" style={{ width: "100px", height: "100px" }} /> ) : null)} 
//                   {renderField("التعليمات و الملاحظات", item["التعليمات و الملاحظات"])}
//                   {renderField("الفئة", item["الفئة"])}
//                   {renderField("الأمثلة السياقية", item["الأمثلة السياقية"])}
//                   {renderField("الاختصارات", item["الاختصارات"])}
//                   {renderField("التنبيهات النحوية", item["التنبيهات النحوية"])}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }  

import "./Search.css";
import { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [secondApiResults, setSecondApiResults] = useState([]);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [secondApiTotalResults, setSecondApiTotalResults] = useState(0);
  const [secondApiTotalPages, setSecondApiTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = () => {
    const cleanedQuery = searchQuery.trim();

    if (cleanedQuery) {
      setIsLoading(true);
      const secondApiUrl = "https://dictionary-backend-zrxn.onrender.com/api/excel";

      axios
        .post(secondApiUrl, { term: cleanedQuery })
        .then((response) => {
          const encryptedData = response.data.data;
          const secretKey = 'sawa2020!';
          const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          const secondApiData = decryptedData;

          if (secondApiData && Array.isArray(secondApiData.Items)) {
            const filteredResults = secondApiData.Items.filter(
              (item) =>
                (item["Words.Kana"] && item["Words.Kana"].includes(cleanedQuery)) ||
                (item["Words.Meaning"] && item["Words.Meaning"].includes(cleanedQuery)) ||
                (item["Words.Short"] && item["Words.Short"].includes(cleanedQuery))
            );

            filteredResults.forEach((item) => {
              if (item["الصور"] && item["الصور"].includes("drive.google.com/file/d/")) {
                const fileId = item["الصور"].split("/d/")[1].split("/")[0];
                item["الصور"] = `https://drive.google.com/thumbnail?id=${fileId}`;
              } else {
                delete item["الصور"];
              }

              if (item["الأمثلة الصوتية"] && item["الأمثلة الصوتية"].includes("drive.google.com/file/d/")) {
                const fileId = item["الأمثلة الصوتية"].split("/d/")[1].split("/")[0];
                item["الأمثلة الصوتية"] = `https://drive.google.com/file/d/${fileId}/preview`;
              } else {
                delete item["الأمثلة الصوتية"];
              }
            });

            setSecondApiResults(filteredResults);
            setSecondApiTotalResults(filteredResults.length);
            setSecondApiTotalPages(Math.ceil(filteredResults.length / filteredResults.length));
          } else {
            setSecondApiResults([]);
            setSecondApiTotalResults(0);
            setSecondApiTotalPages(0);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data from second API:", error);
          setSecondApiResults([]);
          setSecondApiTotalResults(0);
          setSecondApiTotalPages(0);
          setIsLoading(false);
        });
    }
  };

  const onChange = (input) => {
    setKeyboardInput(input);
    setSearchQuery(input);
  };

  const handleKeyPress = (button) => {
    if (button === "{space}") {
      setKeyboardInput((prevInput) => prevInput + " ");
      setSearchQuery((prevQuery) => prevQuery + " ");
    }
  };

  const renderField = (label, value) => {
    if (value) {
      return (
        <div className="field">
          <strong>{label}:</strong> {value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="App">
      <div className="container mt-5">
        <div className="SearchWord">
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            value={searchQuery}
            placeholder="ادخل كلمة البحث هنا"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoading && <span className="loading-text">...جار البحث</span>}
        </div>
  
        <div className="search-info">
          <div>عدد نتائج البحث: {secondApiTotalResults}</div>
          <div>عدد الصفحات: {secondApiTotalPages}</div>
        </div>
  
        <Keyboard
          layoutName="default"
          onChange={onChange}
          onKeyPress={handleKeyPress}
          layout={{
            default: [
              "ض ص ث ق ف غ ع ه خ ح ج د",
              "ش س ي ب ل ا ت ن م ك ط",
              "ئ ء ؤ ر لا ى ة و ز ظ",
              "ذ 1 2 3 4 5 6 7 8 9 0 {bksp}",
              "{space}",
            ],
          }}
          display={{
            "{bksp}": "حذف",
            "{space}": "مسافة",
          }}
        />
  
        <h2>نتائج البحث</h2>
  
        {isLoading ? (
          <div className="loading"></div>
        ) : (
          <div className="table-container">
            {secondApiResults.length === 0 ? (
              <div className="no-results">لم يتم العثور على نتائج</div>
            ) : (
              secondApiResults.map((item, index) => (
                <div key={index} className="entry">
                  <span className="kana">{renderField("Kana", item["Words.Kana"])}</span>
                  {renderField("Meaning Summary", item["Words.Meaning"])}
                  {renderField("Short Meaning Summary", item["Words.Short"])}
                 <span className="kana">{renderField("Kanji", item["Words.Writings"])}</span>
                  {renderField("الكلمة", item["الكلمة"])}
                  {renderField("المعنى", item["المعنى"])}
                  {renderField("النطق", item["النطق"])}
                  {renderField("التعريف", item["التعريف"])}
                  {renderField("الأمثلة", item["الأمثلة"])}
                  {renderField("التصنيف النحوي", item["التصنيف النحوي"])}
                  {renderField("الاشتقاقات و التصريفات", item["الاشتقاقات و التصريفات"])}
                  {renderField("الملاحظات الثقافية", item["الملاحظات الثقافية"])}
                  {renderField("المصادر و المراجع", item["المصادر و المراجع"])}
                  {item["الأمثلة الصوتية"] ? (
                    <iframe src={item["الأمثلة الصوتية"]} width="50%" height="60" allow="autoplay"></iframe>
                  ) : null}
                  {renderField("المرادف", item["المرادف"])}
                  {renderField("العبارات الاصطلاحية", item["العبارات الاصطلاحية"])}
                  {renderField("الاستعمالات الشائعة", item["الاستعمالات الشائعة"])}
                  {renderField("الرمز و الأصل اللغوي", item["الرموز والأصل اللغوي"])}
                  {renderField("الصور" , item["الصور"] ? (  <img src={item["الصور"]} alt="Search Result" style={{ width: "100px", height: "100px" }} /> ) : null)} 
                  {renderField("التعليمات و الملاحظات", item["التعليمات و الملاحظات"])}
                  {renderField("الفئة", item["الفئة"])}
                  {renderField("الأمثلة السياقية", item["الأمثلة السياقية"])}
                  {renderField("الاختصارات", item["الاختصارات"])}
                  {renderField("التنبيهات النحوية", item["التنبيهات النحوية"])}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}  