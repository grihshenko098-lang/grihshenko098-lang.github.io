// ============ КОНФИГУРАЦИЯ CLOUDINARY ============
const CLOUD_NAME = "vkaokrwb";   // Например: dabc123
const UPLOAD_PRESET = "mobywatel_preset";
// =================================================

var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
});

imageInput.addEventListener('change', (event) => {
    const file = imageInput.files[0];
    if (!file) return;

    upload.classList.add("upload_loading");
    upload.classList.remove("upload_loaded");
    upload.classList.remove("error_shown");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(res => {
        console.log("Статус Cloudinary:", res.status);
        return res.json();
    })
    .then(data => {
        console.log("Ответ Cloudinary:", data);
        if (data.secure_url) {
            const url = data.secure_url;
            upload.setAttribute("selected", url);
            upload.classList.add("upload_loaded");
            upload.querySelector(".upload_uploaded").src = url;
            // Сохраняем в localStorage, чтобы передать на id.html
            localStorage.setItem('userImage', url);
            console.log("✅ Фото загружено:", url);
        } else {
            throw new Error(data.error?.message || "Ошибка загрузки");
        }
    })
    .catch(err => {
        console.error("❌ Ошибка загрузки на Cloudinary:", err);
        upload.classList.add("error_shown");
        alert("Не удалось загрузить фото. Проверь интернет и попробуй ещё раз.");
    })
    .finally(() => {
        upload.classList.remove("upload_loading");
    });
});
