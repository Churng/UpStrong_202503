// 全域變數
let collectedData = [];
let imageFiles = []; // 在全域範圍初始化 imageFiles

// 檢查是否為 YouTube 分享網址並轉為嵌入格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0];
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

// 頁面載入時初始化
$(document).ready(function () {
	const textarea = document.getElementById("limitedTextarea");
	const charCounter = document.querySelector(".char-counter");

	textarea.addEventListener("input", function () {
		const currentLength = this.value.length;
		const maxLength = parseInt(this.getAttribute("maxlength"));

		charCounter.textContent = `${currentLength}/${maxLength}`;

		if (currentLength > maxLength) {
			textarea.classList.add("border-danger", "border-2");
			charCounter.classList.remove("text-muted", "bg-light");
			charCounter.classList.add("text-danger", "bg-white");
		} else {
			textarea.classList.remove("border-danger", "border-2");
			charCounter.classList.remove("text-danger", "bg-white");
			charCounter.classList.add("text-muted", "bg-light");
		}
	});
});

// 統一的點擊事件處理器
document.addEventListener("click", function (e) {
	const button = e.target.closest(".btn-icon");
	if (!button) return;

	const containerClasses = [".textarea-box", ".addpic-box", ".ytlink-box"];
	let currentSection = null;

	for (const className of containerClasses) {
		currentSection = button.closest(className);
		if (currentSection) break;
	}

	if (!currentSection) {
		console.error("找不到任何匹配的容器元素");
		return;
	}

	const isAddButton = button.querySelector(".bi-plus-circle-fill");
	const isTrashButton = button.querySelector(".bi-trash");

	if (isAddButton) {
		addNewSection(currentSection);
		isAddButton.style.display = "none";
	}

	if (isTrashButton) {
		const prevSection = currentSection.previousElementSibling;
		currentSection.remove();
		if (prevSection) {
			const prevAddBtn = prevSection.querySelector(".bi-plus-circle-fill");
			if (prevAddBtn) prevAddBtn.style.display = "block";
		}
	}
});

// 新增區塊函數
function addNewSection(currentSection) {
	const newSection = currentSection.cloneNode(true);

	// 重置 textarea 內容
	if (newSection.classList.contains("textarea-box")) {
		newSection.querySelector("textarea").value = "";
	} else if (newSection.classList.contains("addpic-box")) {
		newSection.querySelector("textarea").value = "";
		newSection.querySelector(".char-counter").textContent = "0/100";

		// 重置圖片預覽區域
		const addpicIcon = newSection.querySelector(".addpic-icon");
		const previewImage = addpicIcon.querySelector(".preview-image");
		if (previewImage) {
			previewImage.remove();
		}
		addpicIcon.querySelector(".bi-plus").style.display = "block";

		// 重置檔案輸入
		const fileInput = addpicIcon.querySelector("#imageUpload");
		if (fileInput) {
			fileInput.value = ""; // 清除已選檔案
		}
	} else if (newSection.classList.contains("ytlink-box")) {
		newSection.querySelector(".ytlink-input").value = "";
	}

	const addButton = newSection.querySelector(".bi-plus-circle-fill");
	addButton.style.display = "block";

	currentSection.after(newSection);

	const inputElement = newSection.querySelector("textarea") || newSection.querySelector(".ytlink-input");
	if (inputElement) inputElement.focus();

	// 重新綁定新區塊的圖片上傳事件
	bindImageUpload(newSection, "imageUpload");
}

// 字數計數功能（addpic-box）
document.addEventListener("input", function (e) {
	if (e.target.classList.contains("addpic-textarea")) {
		const textarea = e.target;
		const counter = textarea.nextElementSibling;
		counter.textContent = `${textarea.value.length}/100`;
	}
});

// 點擊 addpic-icon 觸發檔案選擇
document.addEventListener("click", function (e) {
	const addpicIcon = e.target.closest(".addpic-icon");
	if (!addpicIcon) return;

	e.stopPropagation();
	const fileInput = addpicIcon.querySelector("#imageUpload");
	if (fileInput) fileInput.click();
});

// 圖片上傳處理
function bindImageUpload(container, inputId) {
	const input = container.querySelector(`#${inputId}`);
	if (!input) return;

	input.addEventListener("change", function (e) {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (event) {
				const addpicIcon = e.target.closest(".addpic-icon");
				const existingImg = addpicIcon.querySelector(".preview-image");
				if (existingImg) existingImg.remove();

				const img = document.createElement("img");
				img.src = event.target.result;
				img.classList.add("preview-image");
				addpicIcon.appendChild(img);

				addpicIcon.querySelector(".bi-plus").style.display = "none";

				const description = addpicIcon.closest(".addpic-box").querySelector(".addpic-textarea").value;
				imageFiles.push({
					file: file,
					description: description,
				});

				collectedData.push({
					content: "",
					description: description,
					url: event.target.result,
					action: "set",
				});
			};
			reader.readAsDataURL(file);
		}
	});
}
// 初始綁定圖片上傳
bindImageUpload(document.querySelector(".addpic-box"), "imageUpload");

// 收集資料
function collectAllData() {
	collectedData = [];
	imageFiles = []; // 重置圖片檔案陣列

	document.querySelectorAll(".textarea-box").forEach((box) => {
		const content = box.querySelector(".recommendation-textarea").value;
		if (content) {
			collectedData.push({
				content: content,
				description: "",
				url: "",
				action: "set",
			});
		}
	});

	document.querySelectorAll(".ytlink-box").forEach((box) => {
		const url = box.querySelector(".ytlink-input").value;
		if (url) {
			collectedData.push({
				content: "",
				description: "",
				url: convertToEmbed(url),
				action: "set",
			});
		}
	});

	return collectedData;
}

// Next 按鈕 AJAX 請求
// 修改 Next 按鈕事件處理器
document.querySelector(".next-button").addEventListener("click", function () {
	const dataToSend = collectAllData();
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());

	// 逐一傳送每筆資料
	dataToSend.forEach((dataItem) => {
		sendSingleData(dataItem, params.workOrderID);
	});

	// 如果有圖片，也單獨傳送
	imageFiles.forEach((image, index) => {
		sendSingleImage(image, params.workOrderID, index);
	});
});

// 單筆資料傳送函數
function sendSingleData(dataItem, workOrderId) {
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "setRecommendMatchDataById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	// 單筆資料結構
	let singleData = {
		workOrderId: workOrderId,
		content: dataItem.content,
		description: dataItem.description,
		url: dataItem.url,
		action: dataItem.action,
	};

	formData.append("action", action);
	formData.append("session_id", session_id);
	formData.append("chsm", chsm);
	formData.append("data", JSON.stringify(singleData));

	$.ajax({
		url: `${window.apiUrl}${window.apirecommend}`,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function (res) {
			return;
			console.log("單筆資料 API 回應:", res);
			handleResponse(res);
		},
		error: function (xhr, status, error) {
			console.error("單筆資料 API 呼叫失敗:", error);
		},
	});
}

// 單張圖片傳送函數
function sendSingleImage(image, workOrderId, index) {
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "setRecommendMatchDataById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	formData.append("action", action);
	formData.append("session_id", session_id);
	formData.append("chsm", chsm);
	formData.append("workOrderId", workOrderId);
	formData.append("recommendPhoto", image.file);
	formData.append("recommendPhotoDescription", image.description);

	$.ajax({
		url: `${window.apiUrl}${window.apirecommend}`,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function (res) {
			console.log("圖片上傳 API 回應:", res);
		},
		error: function (xhr, status, error) {
			console.error("圖片上傳 API 呼叫失敗:", error);
		},
	});
}
