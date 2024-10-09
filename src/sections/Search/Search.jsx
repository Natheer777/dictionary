import "./Search.css";
import { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function Search() {
  const [sentencePairs, setSentencePairs] = useState([]);
  const [filteredPairs, setFilteredPairs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [secondApiResults, setSecondApiResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = axios.create({
    baseURL: 'https://api.ajls.online'
  });
  useEffect(() => {
    api
    .get("/getSentence")
    .then((response) => {
  
      // فك التشفير باستخدام CryptoJS
      const decryptedData = CryptoJS.AES.decrypt(response.data.data, "sawa2020!").toString(CryptoJS.enc.Utf8);
  
      // console.log("Decrypted data (raw):", decryptedData); // تحقق من البيانات قبل محاولة تفسيرها كـ JSON
  
      if (!decryptedData) {
        console.error("Failed to decrypt data.");
        return;
      }
  
      let parsedData;
      try {
        parsedData = JSON.parse(decryptedData); // محاولة تفسير البيانات كـ JSON
      } catch (error) {
        console.error("Error parsing decrypted data:", error);
        return;
      }
  
      if (Array.isArray(parsedData)) {
        const pairs = parsedData.reduce((acc, current, index, array) => {
          if (index % 2 === 0 && array[index + 1]) {
            let japaneseSentences = [current.sentence];
            let arabicSentences = [array[index + 1].sentence];
  
            const japaneseDelimiters = ["。", "？"];
            const arabicDelimiters = [".", "؟"];
  
            japaneseDelimiters.forEach((delimiter) => {
              japaneseSentences = japaneseSentences.flatMap((sentence) =>
                splitSentenceWithExceptions(sentence, delimiter)
              );
            });
  
            arabicDelimiters.forEach((delimiter) => {
              arabicSentences = arabicSentences.flatMap((sentence) =>
                splitSentenceWithExceptions(sentence, delimiter)
              );
            });
  
            const combinedSentences = [];
  
            let maxLength = Math.max(
              japaneseSentences.length,
              arabicSentences.length
            );
            for (let i = 0; i < maxLength; i++) {
              combinedSentences.push({
                japanese: japaneseSentences[i] || "",
                arabic: arabicSentences[i] || "",
              });
            }
  
            acc.push(...combinedSentences);
          }
          return acc;
        }, []);
  
        setSentencePairs(pairs);
      } else {
        console.error("Expected an array but got:", parsedData);
      }
    })
    .catch((error) => {
      console.error("Error fetching sentences:", error);
    });
  }, []);
  

  const splitSentenceWithExceptions = (sentence, delimiter) => {
    if (
      sentence.includes("...") ||
      sentence.includes("..") ||
      sentence.includes("…")
    ) {
      return [sentence];
    }

    if (sentence.includes(delimiter)) {
      return sentence
        .split(delimiter)
        .filter(Boolean)
        .map((part) => part + delimiter);
    }

    return [sentence];
  };

  const handleSearch = () => {
    console.log("Search button clicked!");
  
    const cleanedQuery = searchQuery.trim();
    if (cleanedQuery) {
      setIsLoading(true);
  
      // Encrypt the search query
      const secretKey = "sawa2020!";
      const encryptedQuery = CryptoJS.AES.encrypt(cleanedQuery, secretKey).toString();
  
      // Fetch sentences from the first API
      const getSentenceApiPromise = api
        .get("/getSentence")
        .then((response) => {
          // console.log("First API Response:", response.data);
  
          // Decrypt the response data
          const decryptedData = CryptoJS.AES.decrypt(response.data.data, secretKey).toString(CryptoJS.enc.Utf8);
  
          let parsedData;
          try {
            parsedData = JSON.parse(decryptedData);
            console.log("Parsed Data:", parsedData);
          } catch (error) {
            console.error("Error parsing decrypted data:", error);
            return [];
          }
  
          if (Array.isArray(parsedData)) {
            const pairs = parsedData.reduce((acc, current, index, array) => {
              if (index % 2 === 0 && array[index + 1]) {
                let japaneseSentences = [current.sentence];
                let arabicSentences = [array[index + 1].sentence];
  
                const japaneseDelimiters = ["。", "？"];
                const arabicDelimiters = [".", "؟"];
  
                japaneseDelimiters.forEach((delimiter) => {
                  japaneseSentences = japaneseSentences.flatMap((sentence) =>
                    splitSentenceWithExceptions(sentence, delimiter)
                  );
                });
  
                arabicDelimiters.forEach((delimiter) => {
                  arabicSentences = arabicSentences.flatMap((sentence) =>
                    splitSentenceWithExceptions(sentence, delimiter)
                  );
                });
  
                const combinedSentences = [];
                let maxLength = Math.max(japaneseSentences.length, arabicSentences.length);
                for (let i = 0; i < maxLength; i++) {
                  combinedSentences.push({
                    japanese: japaneseSentences[i] || "",
                    arabic: arabicSentences[i] || "",
                  });
                }
  
                acc.push(...combinedSentences);
              }
              return acc;
            }, []);
  
            return pairs.filter(
              (pair) =>
                pair.japanese.toLowerCase().includes(cleanedQuery.toLowerCase()) ||
                pair.arabic.toLowerCase().includes(cleanedQuery.toLowerCase())
            );
          } else {
            console.error("Expected an array but got:", parsedData);
            return [];
          }
        })
        .catch((error) => {
          console.error("Error fetching sentences from the first API:", error);
          return [];
        });
  
      // Fetch results from the second API
      const secondApiUrl = "https://api.ajls.online/api/excel";
      const secondApiPromise = axios
        .post(secondApiUrl, { term: encryptedQuery }) // Send encrypted query
        .then((response) => {
  
          const encryptedData = response.data.data;
          const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
          if (decryptedData && Array.isArray(decryptedData.Items)) {
            const results = decryptedData.Items.filter(
              (item) =>
                (item["المعنى"] && item["المعنى"].includes(cleanedQuery)) ||
                (item["التصنيف النحوي"] && item["التصنيف النحوي"].includes(cleanedQuery)) ||
                (item["الأمثلة"] && item["الأمثلة"].includes(cleanedQuery)) ||
                (item["kana"] && item["kana"].includes(cleanedQuery)) ||
                (item["meaning"] && item["meaning"].includes(cleanedQuery)) ||
                (item["short"] && item["short"].includes(cleanedQuery)) ||
                (item["writings"] && item["writings"].includes(cleanedQuery)) ||
                (item["الكلمة"] && item["الكلمة"].includes(cleanedQuery)) ||
                (item["النطق"] && item["النطق"].includes(cleanedQuery)) ||
                (item["التعريف"] && item["التعريف"].includes(cleanedQuery)) ||
                (item["الاشتقاقات والتصريفات"] && item["الاشتقاقات والتصريفات"].includes(cleanedQuery)) ||
                (item["الملاحظات الثقافية"] && item["الملاحظات الثقافية"].includes(cleanedQuery)) ||
                (item["المصادر والمراجع"] && item["المصادر والمراجع"].includes(cleanedQuery)) ||
                (item["المرادف"] && item["المرادف"].includes(cleanedQuery)) ||
                (item["العبارات الاصطلاحية"] && item["العبارات الاصطلاحية"].includes(cleanedQuery)) ||
                (item["الاستعمالات الشائعة"] && item["الاستعمالات الشائعة"].includes(cleanedQuery)) ||
                (item["الرمز والأصل اللغوي"] && item["الرمز والأصل اللغوي"].includes(cleanedQuery)) ||
                (item["التعليقات والملاحظات"] && item["التعليقات والملاحظات"].includes(cleanedQuery)) ||
                (item["الفئة"] && item["الفئة"].includes(cleanedQuery)) ||
                (item["الأمثلة السياقية"] && item["الأمثلة السياقية"].includes(cleanedQuery)) ||
                (item["الاختصارات"] && item["الاختصارات"].includes(cleanedQuery)) ||
                (item["التنبيهات النحوية"] && item["التنبيهات النحوية"].includes(cleanedQuery))
            ).map((item) => {
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
  
              return item;
            });
  
            return results;
          } else {
            console.log("Invalid data format from second API:", decryptedData);
            return [];
          }
        })
        .catch((error) => {
          console.error("Error in second API:", error);
          return [];
        });
  
      // Combine results from both APIs
        Promise.all([getSentenceApiPromise, secondApiPromise])
        .then(([firstApiResults, secondApiResults]) => {
          setFilteredPairs(firstApiResults);
          setSecondApiResults(secondApiResults);
          setHasSearched(true);
          setIsLoading(false);
  
          if (secondApiResults.length === 0) {
            console.log("No results found in second API for:", cleanedQuery);
            api
              .post("/addSuggestions", {
                Suggestion: cleanedQuery,
              })
              .then(() => {
                console.log("تم إرسال الاقتراح:", cleanedQuery);
              })
              .catch((err) => {
                console.error("حدث خطأ عند إرسال الاقتراح:", err);
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching data from APIs:", error);
          setFilteredPairs([]);
          setSecondApiResults([]);
          setIsLoading(false);
        });
    }
  };
  
  const onChange = (input) => {
    setSearchQuery(input);
  };

  const highlightText = (text, searchTerm) => {
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
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
        <button className="btn" onClick={handleSearch}>
          بحث
        </button>
      </div>

      {/* عرض حالة التحميل */}
      {isLoading && (
        <p className="loading-spinner text-center fw-bold mt-3">
          جاري البحث...
        </p>
      )}

      {/* عرض النتائج بعد البحث */}
      {hasSearched && (
        <div className="mt-4">
          {/* حالة عدم وجود نتائج */}
          {filteredPairs.length === 0 && secondApiResults.length === 0 ? (
            <div>
              لا توجد نتائج. <br />
              تم حفظ الكلمة وستتم إضافتها إلى القاموس في وقت لاحق
            </div>
          ) : (
            <>
              {/* نتائج API الثاني */}
              {secondApiResults.length > 0 && (
                <div>
                  {secondApiResults.map((item, index) => (
                    <div key={index} className="result-item">
                      {renderField("المعنى", item["المعنى"])}
                      {renderField("التصنيف النحوي", item["التصنيف النحوي"])}
                      {renderField("الأمثلة", item["الأمثلة"])}

                      {/* عرض أمثلة أخرى إذا كانت موجودة */}
                      {filteredPairs.length > 0 && (
                        <ul className="list-group list-group-flush">
                          {filteredPairs.map((pair, pairIndex) => (
                            <li key={pairIndex} className="list-group-item">
                              {pairIndex === 0 && <strong>أمثلة أخرى:</strong>}
                              <div className="japanese_sentence">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(pair.japanese, searchQuery),
                                  }}
                                />
                                <br />
                              </div>
                              <span
                                className="arabic_sentence"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(pair.arabic, searchQuery),
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {renderField("Kana", item["kana"])}
                      {renderField("Kanji", item["writings"])}
                      {renderField("النطق", item["النطق"])}
                      {renderField("التعريف", item["التعريف"])}
                      {renderField("الاشتقاقات و التصريفات", item["الاشتقاقات و التصريفات"])}
                      {renderField("الملاحظات الثقافية", item["الملاحظات الثقافية"])}
                      {renderField("المصادر و المراجع", item["المصادر و المراجع"])}

                      {/* عرض الأمثلة الصوتية */}
                      {item["الأمثلة الصوتية"] && (
                        <iframe
                          src={item["الأمثلة الصوتية"]}
                          width="50%"
                          height="60"
                          allow="autoplay"
                        ></iframe>
                      )}

                      {renderField("المرادف", item["المرادف"])}
                      {renderField("العبارات الاصطلاحية", item["العبارات الاصطلاحية"])}
                      {renderField("الاستعمالات الشائعة", item["الاستعمالات الشائعة"])}
                      {renderField("الرمز و الأصل اللغوي", item["الرموز والأصل اللغوي"])}

                      {/* عرض الصور */}
                      {item["الصور"] && (
                        <img
                          src={item["الصور"]}
                          alt="Search Result"
                          style={{ width: "100px", height: "100px" }}
                        />
                      )}

                      {renderField("التعليمات و الملاحظات", item["التعليمات و الملاحظات"])}
                      {renderField("الفئة", item["الفئة"])}
                      {renderField("الأمثلة السياقية", item["الأمثلة السياقية"])}
                      {renderField("الاختصارات", item["الاختصارات"])}
                      {renderField("التنبيهات النحوية", item["التنبيهات النحوية"])}
                    </div>
                  ))}
                </div>
              )}

              {/* عرض الأمثلة فقط إذا لم يكن هناك نتائج من API الثاني */}
              {filteredPairs.length > 0 && secondApiResults.length === 0 && (
                <div>
                  <ul className="list-group list-group-flush">
                    {filteredPairs.map((pair, index) => (
                      <li key={index} className="list-group-item">
                        {index === 0 && <strong>أمثلة أخرى:</strong>}
                        <div className="japanese_sentence">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(pair.japanese, searchQuery),
                            }}
                          />
                          <br />
                        </div>
                        <span
                          className="arabic_sentence"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(pair.arabic, searchQuery),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  </div>
);
}