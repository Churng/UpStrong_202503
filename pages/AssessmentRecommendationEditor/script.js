// 檢查是否為分享網址格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0]; // 提取 video_id
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

$(document).ready(function () {
	//跳轉頁面
	if ($(".next-button").length === 0) {
		console.error("找不到 .next-button 元素，請檢查 HTML 是否正確");
		return;
	}
	$(".next-button").on("click", function () {
		window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
	});

	var oldData = null;
	let recommendData = null;

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

				// console.log("回傳資料:"+ res) //回傳資料
				// recommendData.sort((a, b) => a.order - b.order); //根據order排序
				recommendData.forEach((item) => {
					let contentHTML = "";
					if (item.matchTypeName === "文字") {
						//純文字
						contentHTML = `
                            <div class="recommendation-item style01  mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start checkbox-box">
								<input type="checkbox" id="check_${item.id}" name="check_${item.id}" value="${item.checkListId}" ${
							item.isMatch ? "checked" : ""
						}>
                                <label for="check_${item.id}"></label>
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
									<input type="checkbox" id="check_${item.id}" name="check_${item.id}" value=""${item.checkListId}"" ${
							item.isMatch ? "checked" : ""
						}>
                                	<label for="check_${item.id}"></label>
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
                            <div class="recommendation-item  mb-5 shadow-sm">
                                 <div class="card-body d-flex align-items-start checkbox-box">
									<input type="checkbox" id="check_${item.id}" name="check_${item.id}" value="${item.checkListId}" ${
							item.isMatch ? "checked" : ""
						}>
                                	<label for="check_${item.id}"></label>
									<div class="card-box">
                                    <iframe class="mb-3 w-100" height="315" src="${URL}" title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                    <p class="card-text">${item.description}</p></div>
                                   
                                </div>
                            </div>
                        `;
					}

					// 將內容塞到html
					recommendationContainer.append(contentHTML);
				});
			} else {
				console.error("API 回應異常:", res.message);
			}
		},
		error: function (xhr, status, error) {
			// 處理錯誤
			console.error("API 呼叫失敗:", error);
		},
	});

	// $(".next").on("click", function () {
	// 	// 收集所有被勾選的項目
	// 	let data = [];

	// 	// 遍歷所有 checkbox
	// 	$('input[type="checkbox"]:checked').each(function () {
	// 		const id = $(this).attr("id").replace("check_", "");
	// 		const checkListId = $(this).val();
	// 		const item = recommendData.find((item) => item.id == id);

	// 		if (item) {
	// 			// 符合您要求的格式，但保留完整原始資料
	// 			data.push({
	// 				action: "set",
	// 				id: item.id, // 或 checkListId，依後端需求
	// 				recommendId: item.id, // 預設值
	// 				checkListId: checkListId,
	// 				checkItemName: item.checkItemName,
	// 				matchType: item.matchTypeName,
	// 				content: item.content,
	// 				description: item.description,
	// 				recommendOrder: item.recommendOrder,
	// 				url: item.url,
	// 				matchCondition: item.matchCondition,
	// 			});
	// 		}
	// 	});

	// 	// 準備最終傳送資料
	// 	let postData = {
	// 		data,
	// 	};

	// 	console.log("傳送資料:", postData);
	// 	update(postData);
	// });
	// const update = (data) => {
	// 	let formData = new FormData();
	// 	let session_id = sessionStorage.getItem("sessionId");
	// 	let action = "setRecommendMatchDataById";
	// 	let chsm = "upStrongRecommendApi";
	// 	chsm = $.md5(session_id + action + chsm);

	// 	formData.append("session_id", session_id);
	// 	formData.append("action", action);
	// 	formData.append("chsm", chsm);
	// 	formData.append("data", JSON.stringify(data));

	// 	$.ajax({
	// 		url: `${window.apiUrl}${window.apirecommend}`,
	// 		type: "POST",
	// 		data: formData,
	// 		processData: false,
	// 		contentType: false,
	// 		success: function (res) {
	// 			console.log(res);

	// 			if (res.returnCode == "1") {
	// 				window.location.href = `../AssessmentRecommendationEditorCustom/index.html?workOrderID=${params.workOrderID}`;
	// 			} else {
	// 				console.error("API 回應異常:", res.message);
	// 			}
	// 		},
	// 		error: function (e) {
	// 			console.error("API 呼叫失敗:", e);
	// 			alert("更新失敗，請稍後再試");
	// 		},
	// 	});
	// };
});
