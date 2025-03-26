// 檢查是否為分享網址格式
function convertToEmbed(url) {
	if (url.includes("youtu.be")) {
		const videoId = url.split("/").pop().split("?")[0]; // 提取 video_id
		return `https://www.youtube.com/embed/${videoId}`;
	}
	return url;
}

$(document).ready(function () {
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

			if (res.returnCode == "1" && res.returnData) {
				let recommendationContainer = $("#recommendation-container");
				let recommendData = res.returnData;
				$("#title").append(res.returnData.title); //標題

				// console.log("回傳資料:"+ res) //回傳資料
				// recommendData.sort((a, b) => a.order - b.order); //根據order排序
				recommendData.forEach((item) => {
					console.log(item);

					let contentHTML = "";
					if (item.matchTypeName === "文字") {
						//純文字
						contentHTML = `
                            <div class="recommendation-item  mb-5 shadow-sm">
                                <div class="card-body d-flex align-items-start">
									<input type="checkbox" name="" id="" class="recommendation-checkbox">
									<div class="card-box">
									   <h5 class="card-title">${item.checkItemName}</h5>
                                    <p class="card-text">${item.content}</p>
                                    <p class="card-text">${item.description}</p>
									</div>
                                 
                                </div>
                            </div>
                        `;
					} else if (item.type === "圖片") {
						//圖片
						contentHTML = `
                        <div class="recommendation-item mb-5 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${item.content}</h5>
                                    <img src="${item.url}" alt="${item.description}" class="img-fluid mb-3" style="width: 300px;">
                                    <p class="card-text">${item.description}</p>
                                </div>
                            </div>
                        `;
					} else if (item.type === "youtube") {
						//嵌入Youtube影片
						var URL = convertToEmbed(item.url);
						contentHTML = `
                            <div class="recommendation-item  mb-5 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${item.content}</h5>
                                    <iframe class="mb-3 w-100" height="315" src="${URL}" title="YouTube video" frameborder="0" allowfullscreen style="width: 300px;"></iframe>
                                    <p class="card-text">${item.description}</p>
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
});
