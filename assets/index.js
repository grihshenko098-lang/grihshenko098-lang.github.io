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

    // Проверяем размер (IMGBB принимает до 32 МБ, но лучше сжать)
    if (file.size > 2 * 1024 * 1024) {
        // Сжимаем через canvas, если > 2 МБ
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX) {
                        height *= MAX / width;
                        width = MAX;
                    }
                } else {
                    if (height > MAX) {
                        width *= MAX / height;
                        height = MAX;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Конвертируем в JPEG с качеством 0.7
                const compressed = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
                sendToImgbb(compressed);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        // Если маленькое — отправляем файл напрямую
        const formData = new FormData();
        formData.append("key", "99995f1922de96ce94f5af06288ff671");
        formData.append("image", file);
        sendFormData(formData);
    }
});

function sendToImgbb(base64Image) {
    const formData = new FormData();
    formData.append("key", "99995f1922de96ce94f5af06288ff671");
    formData.append("image", base64Image);

    sendFormData(formData);
}

function sendFormData(formData) {
    fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const url = data.data.url;
            upload.setAttribute("selected", url);
            upload.classList.add("upload_loaded");
            upload.querySelector(".upload_uploaded").src = url;
            localStorage.setItem('userImage', url);
        } else {
            throw new Error("Upload failed");
        }
    })
    .catch(err => {
        console.error(err);
        upload.classList.add("error_shown");
    })
    .finally(() => {
        upload.classList.remove("upload_loading");
    });
    }
