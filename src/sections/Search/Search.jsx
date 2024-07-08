import "./Search.css";
import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import axios from "axios";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [secondApiResults, setSecondApiResults] = useState([]);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [secondApiTotalResults, setSecondApiTotalResults] = useState(0);
  const [secondApiTotalPages, setSecondApiTotalPages] = useState(0);

  const handleSearch = () => {
    const secondApiUrl =
      "https://dictionary-backend-zrxn.onrender.com/api/excel"; // عنوان الـ API الثاني

    axios
      .post(secondApiUrl, { term: searchQuery })
      .then((response) => {
        const secondApiData = response.data;
        console.log("Second API Response Data:", secondApiData);

        if (secondApiData && Array.isArray(secondApiData.Items)) {
          const filteredResults = secondApiData.Items.filter(
            (item) =>
              (item["Words.Kana"] &&
                item["Words.Kana"].includes(searchQuery)) ||
              (item["Words.Meaning"] &&
                item["Words.Meaning"].includes(searchQuery)) ||
              (item["Words.Short"] && item["Words.Short"].includes(searchQuery))
          );

          // تعديل روابط الصور
          filteredResults.forEach((item) => {
            if (item.img && item.img.includes("drive.google.com/file/d/")) {
              const fileId = item.img.split("/d/")[1].split("/")[0];
              item.img = `https://drive.google.com/uc?export=download&id=${fileId}`;
            }
          });

          setSecondApiResults(filteredResults);
          setSecondApiTotalResults(filteredResults.length);
          setSecondApiTotalPages(Math.ceil(filteredResults.length / 10));
        }
      })
      .catch((error) => {
        console.error("Error fetching data from second API:", error);
        setSecondApiResults([]);
        setSecondApiTotalResults(0);
        setSecondApiTotalPages(0);
      });
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
          <button id="searchButton" onClick={handleSearch}>
            بحث
          </button>
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
        <div className="table-container">
          <table className="mt-5 mb-5">
            <thead>
              <tr>
                <th>Kana</th>
                <th>Meaning Summary</th>
                <th>Short Meaning Summary</th>
                <th>Kanji</th>
                <th>الكلمة</th>
                <th>المعنى</th>
                <th>النطق</th>
                <th>التعريف</th>
                <th>الأمثلة</th>
                <th>التصنيف النحوي</th>
                <th>الاشتقاقات و التصريفات</th>
                <th>الملاحظات الثقافية</th>
                <th>المصادر و المراجع</th>
                <th>الأمثلة الصوتية</th>
                <th>المرادف</th>
                <th>العبارات الاصطلاحية</th>
                <th>الاستعمالات الشائعة</th>
                <th>الرمز و الأصل اللغوي</th>
                <th>الصور</th>
                <th>التعليمات و الملاحظات</th>
                <th>الفئة</th>
                <th>الأمثلة السياقية</th>
                <th>الاختصارات</th>
                <th>التنبيهات النحوية</th>
              </tr>
            </thead>
            <tbody>
              {secondApiResults.length === 0 ? (
                <tr>
                  <td colSpan="25">لم يتم العثور على نتائج</td>
                </tr>
              ) : (
                secondApiResults.map((item, index) => (
                  <tr key={index}>
                    <td>{item["Words.Kana"]}</td>
                    <td>{item["Words.Meaning"]}</td>
                    <td>{item["Words.Short"]}</td>
                    <td>{item["Words.Writings"]}</td>
                    <td>{item["الكلمة"]}</td>
                    <td>{item["المعنى"]}</td>
                    <td>{item["النطق"]}</td>
                    <td>{item["التعريف"]}</td>
                    <td>{item["الأمثلة"]}</td>
                    <td>{item["التصنيف النحوي"]}</td>
                    <td>{item["الاشتقاقات و التصريفات"]}</td>
                    <td>{item["الملاحظات الثقافية"]}</td>
                    <td>{item["المصادر و المراجع"]}</td>
                    <td>
                      {item["الأمثلة الصوتية"] &&
                      item["الأمثلة الصوتية"].startsWith("https") ? (
                        <audio controls>
                          <source
                            src={item["الأمثلة الصوتية"]}
                            type="audio/mpeg"
                          />
                          المتصفح الخاص بك لا يدعم عنصر الصوت.
                        </audio>
                      ) : (
                        "لا توجد أمثلة صوتية"
                      )}
                    </td>

                    <td>{item["المرادف"]}</td>
                    <td>{item["العبارات الاصطلاحية"]}</td>
                    <td>{item["الاستعمالات الشائعة"]}</td>
                    <td>{item["الرمز و الأصل اللغوي"]}</td>
                    <td>
                      {item["الصور"] ? (
                        <img
                          src={item["الصور"]}
                          alt="Search Result"
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        "لا توجد صورة"
                      )}
                    </td>

                    <td>{item["التعليمات و الملاحظات"]}</td>
                    <td>{item["الفئة"]}</td>
                    <td>{item["الأمثلة السياقية"]}</td>
                    <td>{item["الاختصارات"]}</td>
                    <td>{item["التنبيهات النحوية"]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
