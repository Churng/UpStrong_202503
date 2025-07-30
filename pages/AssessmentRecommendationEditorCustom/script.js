// 全域變數
let collectedData = [];
let imageFiles = []; // 在全域範圍初始化 imageFiles
let checkboxInitialStates = {}; // checkbox 初始狀態儲存
let recommendData = null;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

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
	//原有資料
	var oldData = null;

	//取得套用清單
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "getDefaultRecommendMatchDataListById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	let data = { workOrderId: params.workOrderID };

	formData.append("action", action);
	formData.append("session_id", session_id);
	formData.append("chsm", chsm);
	formData.append("data", JSON.stringify(data));

	// 發送 API 請求
	$.ajax({
		url: `${window.apiUrl}${window.apirecommend}`,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: function (res) {
			console.log(res);
			handleResponse(res);

			if (res.returnCode == "1" && res.returnData) {
				// 定義三個容器
				let textContainer = $("#recommendation-container1");
				let imageContainer = $("#recommendation-container2");
				let youtubeContainer = $("#recommendation-container3");

				// 檢查容器是否存在
				if (!textContainer.length || !imageContainer.length || !youtubeContainer.length) {
					console.error(
						"一個或多個容器不存在，請檢查 HTML 是否包含 #recommendation-container1, #recommendation-container2, #recommendation-container3"
					);
					return;
				}

				recommendData = res.returnData;
				$("#title").append(res.returnData.title);

				recommendData.forEach((item) => {
					let contentHTML = "";
					let targetContainer = null;

					if (item.matchTypeName === "文字") {
						// 純文字
						contentHTML = `
							 <div class="recommendation-item style01 mb-5 d-flex align-items-center" data-id="${item.id}">
                                <div class="card-body d-flex align-items-start checkbox-box shadow-sm">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <div class="text-content">
                                            <p class="card-text">${item.content}</p>
                                            <textarea class="edit-textarea form-control d-none" rows="3">${
																							item.content
																						}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="edit-bottom">
                                    <button class="btn btn-link edit-btn" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </button>
                                    <div class="edit-actions d-none">
                                        <button class="btn btn-sm btn-success save-btn">儲存</button>
                                        <button class="btn btn-sm btn-secondary cancel-btn">取消</button>
                                    </div>
                                </div>
                            </div>
						`;
						targetContainer = textContainer;
					} else if (item.matchTypeName === "圖片") {
						// 圖片
						contentHTML = `
							<div class="recommendation-item mb-5 d-flex align-items-center" data-id="${item.id}">
                                <div class="card-body d-flex align-items-start checkbox-box shadow-sm">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <img src="${item.url}" alt="${
							item.description
						}" class="img-fluid mb-3" style="width: 300px;">
                                        <div class="text-content">
                                            <p class="card-text">${item.description}</p>
                                            <textarea class="edit-textarea form-control d-none" rows="3">${
																							item.description
																						}</textarea>
                                        </div>
                                    </div>
                                </div>

								<div class="edit-bottom">
                                            <button class="btn btn-link edit-btn" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                </svg>
                                            </button>
                                            <div class="edit-actions d-none">
                                                <button class="btn btn-sm btn-success save-btn">儲存</button>
                                                <button class="btn btn-sm btn-secondary cancel-btn">取消</button>
                                            </div>
                                        </div>
                            </div>
						`;
						targetContainer = imageContainer;
					} else if (item.matchTypeName === "youtube") {
						// 嵌入 YouTube 影片
						var URL = convertToEmbed(item.url);
						contentHTML = `
							<div class="recommendation-item mb-5  d-flex align-items-center" data-id="${item.id}">
                                <div class="card-body d-flex align-items-start checkbox-box shadow-sm ">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <iframe class="mb-3 w-100" height="315" src="${URL}" 
                                            title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                        <div class="text-content">
                                            <p class="card-text">${item.description}</p>
                                            <textarea class="edit-textarea form-control d-none" rows="3">${
																							item.description
																						}</textarea>
                                        </div>
                                       
                                    </div>
                                </div>
								 <div class="edit-bottom">
                                            <button class="btn btn-link edit-btn" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                </svg>
                                            </button>
                                            <div class="edit-actions d-none">
                                                <button class="btn btn-sm btn-success save-btn">儲存</button>
                                                <button class="btn btn-sm btn-secondary cancel-btn">取消</button>
                                            </div>
                                        </div>
                            </div>
						`;
						targetContainer = youtubeContainer;
					}

					// 將內容追加到對應容器
					if (targetContainer && contentHTML) {
						targetContainer.append(contentHTML);
					} else {
						console.warn(`無效的 matchTypeName 或容器未定義: ${item.matchTypeName}`);
					}

					// 儲存初始 checkbox 狀態
					checkboxInitialStates[item.id] = item.isMatch;
				});
			} else {
				console.error("API 回應異常:", res.message);
			}
		},
		error: function (xhr, status, error) {
			console.error("API 呼叫失敗:", error);
		},
	});

	//
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

// 📌 可重用的區塊類型
const containerClasses = [".textarea-box", ".addpic-box", ".ytlink-box"];

/**
 * 🗑️ 根據區塊類型更新所有垃圾桶按鈕狀態
 */
function updateTrashButtons(sectionType) {
	const allSections = document.querySelectorAll(sectionType);
	const count = allSections.length;

	allSections.forEach((section) => {
		const trashBtn = section.querySelector(".btn-icon .bi-trash")?.parentElement;
		if (trashBtn) {
			trashBtn.style.pointerEvents = count === 1 ? "none" : "auto";
			trashBtn.style.opacity = count === 1 ? "0.5" : "1";
		}
	});
}

/**
 * 🔁 新增區塊功能
 */
function addNewSection(currentSection) {
	const newSection = currentSection.cloneNode(true);

	// 清空內容依類型處理
	if (newSection.classList.contains("textarea-box")) {
		newSection.querySelector("textarea").value = "";
	} else if (newSection.classList.contains("addpic-box")) {
		newSection.querySelector("textarea").value = "";
		newSection.querySelector(".char-counter").textContent = "0/100";

		const addpicIcon = newSection.querySelector(".addpic-icon");
		const previewImage = addpicIcon.querySelector(".preview-image");
		if (previewImage) previewImage.remove();

		addpicIcon.querySelector(".bi-plus").style.display = "block";

		const fileInput = addpicIcon.querySelector("#imageUpload");
		if (fileInput) fileInput.value = "";
	} else if (newSection.classList.contains("ytlink-box")) {
		newSection.querySelector(".ytlink-input").value = "";
		newSection.querySelector(".yttext-input").value = "";
	}

	// 顯示新增按鈕
	const addButton = newSection.querySelector(".bi-plus-circle-fill");
	if (addButton) addButton.style.display = "block";

	// 插入新區塊
	currentSection.after(newSection);

	// 聚焦輸入欄
	const inputElement = newSection.querySelector("textarea") || newSection.querySelector(".ytlink-input");
	if (inputElement) inputElement.focus();

	// 綁定圖片上傳事件
	bindImageUpload(newSection, "imageUpload");

	// 🗑️ 更新垃圾桶狀態
	const sectionType = containerClasses.find((cls) => newSection.matches(cls));
	if (sectionType) updateTrashButtons(sectionType);
}

/**
 * 👂 統一點擊事件處理
 */
document.addEventListener("click", function (e) {
	const button = e.target.closest(".btn-icon");
	if (!button) return;

	// 找出所在的區塊
	let currentSection = null;
	for (const className of containerClasses) {
		currentSection = button.closest(className);
		if (currentSection) break;
	}

	if (!currentSection) {
		console.error("❌ 找不到任何匹配的容器元素");
		return;
	}

	const isAddButton = button.querySelector(".bi-plus-circle-fill");
	const isTrashButton = button.querySelector(".bi-trash");

	// 判斷區塊類型並取得數量
	const sectionType = containerClasses.find((cls) => currentSection.matches(cls));
	const allSections = document.querySelectorAll(sectionType);
	const sectionCount = allSections.length;

	if (isAddButton) {
		addNewSection(currentSection);
		button.style.display = "none";
		updateAddButtons(sectionType);
	}

	function updateAddButtons(sectionType) {
		const allSections = document.querySelectorAll(sectionType);
		allSections.forEach((section, index) => {
			const addIcon = section.querySelector(".bi-plus-circle-fill");
			const addButton = addIcon?.closest("button");

			if (addButton) {
				// 只讓最後一個的新增按鈕顯示
				addButton.style.display = index === allSections.length - 1 ? "block" : "none";
			}
		});
	}
	if (isTrashButton && sectionCount > 1) {
		const prevSection = currentSection.previousElementSibling;
		currentSection.remove();

		// 回顯前一個區塊的新增按鈕
		if (prevSection) {
			const prevAddBtn = prevSection.querySelector(".bi-plus-circle-fill");
			if (prevAddBtn) prevAddBtn.style.display = "block";
		}

		// 更新垃圾桶狀態
		updateTrashButtons(sectionType);
		updateAddButtons(sectionType);
	}
});

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
					url: "",
					action: "set",
				});
			};
			reader.readAsDataURL(file);
		}
	});
}
// 初始綁定圖片上傳
bindImageUpload(document.querySelector(".addpic-box"), "imageUpload");

$(".next")
	.off("click")
	.on("click", function (e) {
		e.preventDefault();

		// 處理 checkbox 勾選狀態變更資料
		const $checkboxes = $(".isMatch-checkbox");
		let changedItems = [];

		$checkboxes.each(function () {
			const $checkbox = $(this);
			const checkboxId = $checkbox.data("id").toString();
			const isNowChecked = $checkbox.is(":checked");
			const wasInitiallyChecked = checkboxInitialStates[checkboxId];

			if (isNowChecked !== wasInitiallyChecked) {
				changedItems.push({
					checkbox: $checkbox,
					recommendId: checkboxId,
					isNowChecked: isNowChecked,
				});
				checkboxInitialStates[checkboxId] = isNowChecked;
			}
		});

		// 處理新增的圖文／影片資料
		const formDataList = collectAllData();

		// 如果兩邊都沒資料變更，直接跳轉
		if (changedItems.length === 0 && formDataList.length === 0) {
			window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.workOrderID}`;
			return;
		}

		// 依序處理 checkbox 勾選變更的 API
		processRequestsSequentially(changedItems)
			.then(() => {
				// 再依序處理其他圖文/影片資料
				return Promise.all(
					formDataList.map((dataItem) => {
						return sendSingleData(dataItem, params.workOrderID);
					})
				);
			})
			.then(() => {
				console.log("所有資料傳送完成");

				window.location.href = `../AssessmentRecommendation/index.html?workOrderID=${params.workOrderID}`;
			})
			.catch((error) => {
				console.error("處理過程中發生錯誤:", error);
				alert("部分資料更新失敗，請稍後再試");
			});
	});

// 處理 checkbox API 的流程
function processRequestsSequentially(items) {
	return items.reduce((promise, item) => {
		return promise.then(() => {
			const originalItem = recommendData.find((data) => data.id.toString() === item.recommendId);
			if (!originalItem) return Promise.resolve();

			const requestData = {
				workOrderId: params.workOrderID,
				action: item.isNowChecked ? "set" : "delete",
			};

			if (item.isNowChecked) {
				let checkListIds = "";
				if (Array.isArray(originalItem.checkListId)) {
					checkListIds = originalItem.checkListId.join("&");
				} else if (originalItem.checkListId) {
					checkListIds = originalItem.checkListId.toString();
				}

				Object.assign(requestData, {
					isMatch: true,
					content: originalItem.content || "",
					url: originalItem.url || "",
					description: originalItem.description || "",
					checkListId: checkListIds,
					checkItemName: originalItem.checkItemName || "",
					matchType: originalItem.matchType || "",
					recommendOrder: originalItem.recommendOrder !== undefined ? originalItem.recommendOrder : 0,
					matchCondition: originalItem.matchCondition || "",
					sourceRecommendId: originalItem.sourceRecommendId || "",
				});
			} else {
				Object.assign(requestData, {
					recommendId: item.recommendId,
				});
			}

			return sendRecommendationRequest(requestData);
		});
	}, Promise.resolve());
}

// API 請求 for checkbox 處理
function sendRecommendationRequest(data) {
	return new Promise((resolve, reject) => {
		let formData = new FormData();
		formData.append("session_id", sessionStorage.getItem("sessionId"));
		formData.append("action", "setRecommendMatchDataById");
		formData.append(
			"chsm",
			$.md5(sessionStorage.getItem("sessionId") + "setRecommendMatchDataById" + "upStrongRecommendApi")
		);
		formData.append("data", JSON.stringify(data));

		$.ajax({
			url: `${window.apiUrl}${window.apirecommend}`,
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function (res) {
				if (res.returnCode === "1") {
					resolve();
				} else {
					reject(res.message);
				}
			},
			error: function (error) {
				reject(error);
			},
		});
	});
}

// 收集文字、圖片、YouTube資料
function collectAllData() {
	let collectedData = [];

	document.querySelectorAll(".textarea-box").forEach((box, index) => {
		const content = box.querySelector(".recommendation-textarea").value;
		if (content) {
			collectedData.push({
				id: "",
				isMatch: true,
				content,
				description: "",
				url: "",
				checkListId: "",
				checkItemName: "",
				matchType: "1",
				recommendOrder: index + 1,
				matchCondition: "",
				action: "set",
				workOrderId: params.workOrderID,
			});
		}
	});

	document.querySelectorAll(".addpic-box").forEach((box, index) => {
		const description = box.querySelector(".addpic-textarea").value;
		const fileInput = box.querySelector("#imageUpload");
		const imageFile = fileInput.files[0];

		if (imageFile || description) {
			let item = {
				id: "",
				isMatch: true,
				content: "",
				description: description || "",
				url: "",
				checkListId: "",
				checkItemName: "",
				matchType: "2",
				recommendOrder: index + 1,
				matchCondition: "",
				action: "set",
				workOrderId: params.workOrderID,
			};
			if (imageFile) item.recommendPhoto = imageFile;

			collectedData.push(item);
		}
	});

	document.querySelectorAll(".ytlink-box").forEach((box, index) => {
		const url = box.querySelector(".ytlink-input").value;
		const videodescription = box.querySelector(".yttext-input").value;
		if (url) {
			collectedData.push({
				id: "",
				isMatch: true,
				content: "",
				description: videodescription,
				url: convertToEmbed(url),
				checkListId: "",
				checkItemName: "",
				matchType: "3",
				recommendOrder: index + 1,
				matchCondition: "",
				action: "set",
				workOrderId: params.workOrderID,
			});
		}
	});

	return collectedData;
}

// 單筆資料上傳，含圖片處理
function sendSingleData(dataItem, workOrderId) {
	return new Promise((resolve, reject) => {
		let formData = new FormData();
		const session_id = sessionStorage.getItem("sessionId");
		const action = "setRecommendMatchDataById";
		const chsm = $.md5(session_id + action + "upStrongRecommendApi");

		formData.append("session_id", session_id);
		formData.append("action", action);
		formData.append("chsm", chsm);

		if (dataItem.recommendPhoto instanceof File) {
			formData.append("recommendPhoto", dataItem.recommendPhoto);
			let dataWithoutFile = { ...dataItem };
			delete dataWithoutFile.recommendPhoto;
			formData.append("data", JSON.stringify(dataWithoutFile));
			console.log("圖片檔案：", dataItem.recommendPhoto);
		} else {
			formData.append("data", JSON.stringify(dataItem));
		}

		$.ajax({
			url: `${window.apiUrl}${window.apirecommend}`,
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function (res) {
				console.log(res);
				if (res.returnCode === "1") {
					resolve(res); // ✅ 成功 resolve
				} else {
					reject(new Error("API 回傳錯誤訊息：" + res.msg));
				}
			},
			error: function (xhr, status, error) {
				console.error("API呼叫失敗:", error);
				reject(error); // ✅ 失敗 reject
			},
		});
	});
}
