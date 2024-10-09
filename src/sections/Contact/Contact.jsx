import { useState } from 'react';
import './Contact.css';
import { FaFolderPlus, FaTrash } from 'react-icons/fa'; 


export default function Contact() {
  const [attachedFile, setAttachedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAttachedFile(file);
  };

  const handleFileDelete = () => {
    setAttachedFile(null); 
  };

  return (
    <div className="container mb-5 mt-5">
 

      <form method="POST" action="https://formsubmit.co/contact@arabicsc.com" encType="multipart/form-data" id="Contact">
        <label>الاسم</label>
        <input type="text" name="user_name" required />

        <label>البريد الإلكتروني</label>
        <input type="email" name="user_email" required />

        <label>رقم الهاتف</label>
        <input type="number" name="user_number" required />

        <label>الرسالة</label>
        <textarea name="message" required></textarea>
<div>

        <label>تحميل ملف</label>

        <div className="file-upload-container">
          <label className="btnfolder" htmlFor="btnfolder"><FaFolderPlus /></label>
          <input
            type="file"
            className="visb"
            id="btnfolder"
            name="attachment"
            accept="image/png, image/jpeg, image/jpg, .xlsx, .pdf, .docx, .doc"
            onChange={handleFileChange}
          />
          {attachedFile && (
            <div className="file-info">
              <p>File attached: {attachedFile.name}</p>
              <button className="delete-file-btn" onClick={handleFileDelete}><FaTrash /></button>
            </div>
          )}
        </div>
</div>

        <input type="submit" value='إرسال' />
        <input type="hidden" name="_captcha" value="false" />
      </form>
    </div>
  );
}
