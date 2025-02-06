// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.querySelector('.upload-button');
const previewContainer = document.querySelector('.preview-container');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 文件上传处理
function handleFileSelect(file) {
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！');
        return;
    }

    // 显示原始文件大小
    originalSize.textContent = formatFileSize(file.size);

    // 读取并显示原图
    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage.src = e.target.result;
        compressImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // 显示预览区域
    previewContainer.style.display = 'block';
}

// 压缩图片
function compressImage(imageData) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 保持原始尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 压缩
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedImage.src = compressedDataUrl;

        // 计算压缩后的大小
        const compressedSizeInBytes = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        compressedSize.textContent = formatFileSize(compressedSizeInBytes);

        // 设置下载链接
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedDataUrl;
            link.click();
        };
    };
    img.src = imageData;
}

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 事件监听
uploadButton.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    handleFileSelect(e.target.files[0]);
};

qualitySlider.oninput = function() {
    qualityValue.textContent = this.value + '%';
    if (originalImage.src) {
        compressImage(originalImage.src);
    }
};

// 拖放功能
dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0071e3';
};

dropZone.ondragleave = () => {
    dropZone.style.borderColor = '#86868b';
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#86868b';
    handleFileSelect(e.dataTransfer.files[0]);
}; 