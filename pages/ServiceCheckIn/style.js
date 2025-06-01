if (window.consoleToggle) {
	var console = {};

	console.log = function () {};
} else {
	var iframe = document.createElement("iframe");

	iframe.style.display = "none";

	document.body.appendChild(iframe);

	console = iframe.contentWindow.console;

	window.console = console;
}

$(document).ready(function () {
	const urlSearchParams = new URLSearchParams(window.location.search);

	const params = Object.fromEntries(urlSearchParams.entries());

	//送出按鈕設定
	$(".box02 .record-box .type-box span").on("click", function () {
		$(this).toggleClass("active");
	});

	const getOrderData = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getWorkOrderDetailById";

		let chsm = "upStrongWorkOrderApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		let data = { workOrderId: params.orderid };

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		formData.append("data", JSON.stringify(data));

		$.ajax({
			url: `${window.apiUrl}${window.apiworkOrder}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				console.log(res);
				handleResponse(res);
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	getOrderData();
});
