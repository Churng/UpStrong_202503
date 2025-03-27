// 檢查是否為分享網址格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0]; // 提取 video_id
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

$(document).ready(function () {
	var oldData = null;
	let recommendData = null;
	let checkboxInitialStates = {}; // To store initial checkbox states

	//取得套用清單
	let formData = new FormData();
	let session_id = sessionStorage.getItem("sessionId");
	let action = "getDefaultRecommendMatchDataListById";
	let chsm = "upStrongRecommendApi";
	chsm = $.md5(session_id + action + chsm);

	console.log(session_id);
	console.log(chsm);

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
				let recommendationContainer = $("#recommendation-container");
				recommendData = res.returnData;
				$("#title").append(res.returnData.title); //標題

				recommendData.forEach((item) => {
					let contentHTML = "";
					if (item.matchTypeName === "文字") {
						//純文字
						contentHTML = `
                            <div class="recommendation-item style01 mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <p class="card-text">${item.content}</p>
                                    </div>
                                </div>
                            </div>
                        `;
					} else if (item.matchTypeName === "圖片") {
						//圖片
						contentHTML = `
                            <div class="recommendation-item mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <img src="${item.url}" alt="${
							item.description
						}" class="img-fluid mb-3" style="width: 300px;">
                                        <p class="card-text">${item.description}</p>
                                    </div>
                                </div>
                            </div>
                        `;
					} else if (item.matchTypeName === "youtube") {
						//嵌入Youtube影片
						var URL = convertToEmbed(item.url);
						contentHTML = `
                            <div class="recommendation-item mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
                                    <input type="checkbox" class="isMatch-checkbox" id="${item.id}" 
                                        name="${item.id}" value="${item.checkListId}" 
                                        data-id="${item.id}" ${item.isMatch ? "checked" : ""}>
                                    <label for="${item.id}"></label>
                                    <div class="card-box">
                                        <iframe class="mb-3 w-100" height="315" src="${URL}" 
                                            title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                        <p class="card-text">${item.description}</p>
                                    </div>
                                </div>
                            </div>
                        `;
					}

					// 將內容塞到html
					recommendationContainer.append(contentHTML);

					// Store initial checkbox state
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

	$(".next").on("click", function () {
		// 找出所有狀態有變化的checkbox
		const changedCheckboxes = $(".isMatch-checkbox").filter(function () {
			const checkboxId = $(this).data("id");
			return checkboxInitialStates[checkboxId] !== $(this).is(":checked");
		});

		// 如果沒有checkbox被改變，直接跳轉
		if (changedCheckboxes.length === 0) {
			window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
			return;
		}

		const requests = [];

		changedCheckboxes.each(function () {
			const checkbox = $(this);
			const recommendId = checkbox.data("id").toString();
			const isNowChecked = checkbox.is(":checked");
			const originalItem = recommendData.find((item) => item.id.toString() === recommendId);

			if (!originalItem) return;

			const requestData = {
				workOrderId: params.workOrderID,
				action: isNowChecked ? "set" : "delete",
			};

			if (isNowChecked) {
				// 處理set操作的資料
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
				// 處理delete操作的資料
				Object.assign(requestData, {
					recommendId: recommendId,
				});
			}

			requests.push(sendRecommendationRequest(requestData));

			// 執行所有請求
			Promise.all(requests)
				.then(() => {
					window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
				})
				.catch((error) => {
					console.error("更新失敗:", error);
					alert("部分更新失敗，請稍後再試");
				});
		});
	});

	// 封裝API請求函數
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
});
