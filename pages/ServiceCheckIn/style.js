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

	console.log(params);

	//送出按鈕設定
	$(".box02 .record-box .type-box span").on("click", function () {
		$(this).toggleClass("active");
	});

	//預設資料
	const getOrderData = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getWorkOrderSignInDetailById";

		let chsm = "upStrongWorkOrderApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		let data = { workOrderId: params.workOrderID };

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
				if (res.returnCode == "1" && res.returnData) {
					let data = res.returnData;
					let item = data.workOrderSignInDetailData;

					// Box-1
					$("#input-hr-rest").val(item.PulseAtRest);
					$("#input-hr-exercise").val(item.PulseTrainingPercentMaxHr);
					$("#input-bp-rest").val(item.BpAtRest);
					$("#input-bp-exercise").val(item.BpDuringTraining);
					$("#input-spo2").val(item.OxygenSaturationSpo2);
					$("#input-rr").val(item.RespiratoryRate);
					$("#input-temp").val(item.BodyTemperature);

					//進食
					$("#SC-EatingLastScore").val(item.EatingLastScore);
					$("#SC-EatingCurrentScore").val(item.EatingCurrentScore);

					//穿衣
					$("#SC-DressingLastScore").val(item.DressingLastScore);
					$("#SC-DressingCurrentScore").val(item.DressingCurrentScore);

					//穿褲
					$("#SC-PantsDressingLastScore").val(item.PantsDressingLastScore);
					$("#SC-PantsDressingCurrentScore").val(item.PantsDressingCurrentScore);

					//床邊坐起
					$("#SC-BedsideSittingLastScore").val(item.BedsideSittingLastScore);
					$("#SC-BedsideSittingCurrentScore").val(item.BedsideSittingCurrentScore);

					//站起
					$("#SC-StandingLastScore").val(item.StandingLastScore);
					$("#SC-StandingCurrentScore").val(item.StandingCurrentScore);

					//床椅移位
					$("#SC-BedWheelchairTransferLastScore").val(item.BedWheelchairTransferLastScore);
					$("#SC-BedWheelchairTransferCurrentScore").val(item.BedWheelchairTransferCurrentScore);

					//輪椅選擇
					$("#SC-UseManualWheelchairCurrentScore").val(item.UseManualWheelchairCurrentScore);
					$("#SC-UsePowerWheelchairCurrentScore").val(item.UsePowerWheelchairCurrentScore);
					$("#SC-UseManualWheelchairLastScore").val(item.UseManualWheelchairLastScore);
					$("#SC-UsePowerWheelchairLastScore").val(item.UsePowerWheelchairLastScore);

					if (item.UsePowerWheelchair === true) {
						$("#SC-UsePowerWheelchair").prop("checked", true);
						$("#SC-UseManualWheelchair").prop("checked", false);
					} else if (item.UseManualWheelchair === true) {
						$("#SC-UsePowerWheelchair").prop("checked", false);
						$("#SC-UseManualWheelchair").prop("checked", true);
					} else {
						$("#SC-UsePowerWheelchair").prop("checked", false);
						$("#SC-UseManualWheelchair").prop("checked", false);
					}
					//步行
					$("#SC-WalkingLastScore").val(item.WalkingLastScore);
					$("#SC-WalkingCurrentScore").val(item.WalkingCurrentScore);

					//如廁
					$("#SC-ToiletLastScore").val(item.ToiletLastScore);
					$("#SC-ToiletCurrentScore").val(item.ToiletCurrentScore);

					//沐浴
					$("#SC-BathingLastScore").val(item.BathingLastScore);
					$("#SC-BathingCurrentScore").val(item.BathingCurrentScore);

					//爬樓梯
					$("#SC-StairClimbingLastScore").val(item.StairClimbingLastScore);
					$("#SC-StairClimbingCurrentScore").val(item.StairClimbingCurrentScore);
				}
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	};

	getOrderData();

	//送出
	$("#submit").on("click", function () {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "setWorkOrderSignInDetailById";

		let chsm = "upStrongWorkOrderApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		let data = {
			workOrderId: params.workOrderID,
			PulseAtRest: $("#input-hr-rest").val(),
			PulseTrainingPercentMaxHr: $("#input-hr-exercise").val(),
			BpAtRest: $("#input-bp-rest").val(),
			BpDuringTraining: $("#input-bp-exercise").val(),
			OxygenSaturationSpo2: $("#input-spo2").val(),
			RespiratoryRate: $("#input-rr").val(),
			BodyTemperature: $("#input-temp").val(),

			EatingCurrentScore: $("#SC-EatingCurrentScore").val(),
			DressingCurrentScore: $("#SC-DressingCurrentScore").val(),
			PantsDressingCurrentScore: $("#SC-PantsDressingCurrentScore").val(),
			BedsideSittingCurrentScore: $("#SC-BedsideSittingCurrentScore").val(),
			StandingCurrentScore: $("#SC-StandingCurrentScore").val(),
			BedWheelchairTransferCurrentScore: $("#SC-BedWheelchairTransferCurrentScore").val(),
			UseManualWheelchairCurrentScore: $("#SC-UseManualWheelchairCurrentScore").val(),
			UsePowerWheelchairCurrentScore: $("#SC-UsePowerWheelchairCurrentScore").val(),

			UsePowerWheelchair: $("#SC-UsePowerWheelchair").prop("checked"),
			UseManualWheelchair: $("#SC-UseManualWheelchair").prop("checked"),

			WalkingCurrentScore: $("#SC-WalkingCurrentScore").val(),
			ToiletCurrentScore: $("#SC-ToiletCurrentScore").val(),
			BathingCurrentScore: $("#SC-BathingCurrentScore").val(),
			StairClimbingCurrentScore: $("#SC-StairClimbingCurrentScore").val(),
		};

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
				// if (res.returnCode == "1" && res.returnData) {
				// 	let data = res.returnData;
				// 	let item = data.workOrderSignInDetailData;

				// 	// Box-1
				// 	$("#input-hr-rest").val(item.PulseAtRest);
				// 	$("#input-hr-exercise").val(item.PulseTrainingPercentMaxHr);
				// 	$("#input-bp-rest").val(item.BpAtRest);
				// 	$("#input-bp-exercise").val(item.BpDuringTraining);
				// 	$("#input-spo2").val(item.OxygenSaturationSpo2);
				// 	$("#input-rr").val(item.RespiratoryRate);
				// 	$("#input-temp").val(item.BodyTemperature);

				// 	//進食
				// 	$("#SC-EatingLastScore").val(item.EatingLastScore);
				// 	$("#SC-EatingCurrentScore").val(item.EatingCurrentScore);

				// 	//穿衣
				// 	$("#SC-DressingLastScore").val(item.DressingLastScore);
				// 	$("#SC-DressingCurrentScore").val(item.DressingCurrentScore);

				// 	//穿褲
				// 	$("#SC-PantsDressingLastScore").val(item.PantsDressingLastScore);
				// 	$("#SC-PantsDressingCurrentScore").val(item.PantsDressingCurrentScore);

				// 	//床邊坐起
				// 	$("#SC-BedsideSittingLastScore").val(item.BedsideSittingLastScore);
				// 	$("#SC-BedsideSittingCurrentScore").val(item.BedsideSittingCurrentScore);

				// 	//站起
				// 	$("#SC-StandingLastScore").val(item.StandingLastScore);
				// 	$("#SC-StandingCurrentScore").val(item.StandingCurrentScore);

				// 	//床椅移位
				// 	$("#SC-BedWheelchairTransferLastScore").val(item.BedWheelchairTransferLastScore);
				// 	$("#SC-BedWheelchairTransferCurrentScore").val(item.BedWheelchairTransferCurrentScore);

				// 	//輪椅選擇
				// 	$("#SC-UseManualWheelchairCurrentScore").val(item.UseManualWheelchairCurrentScore);
				// 	$("#SC-UsePowerWheelchairCurrentScore").val(item.UsePowerWheelchairCurrentScore);
				// 	$("#SC-UseManualWheelchairLastScore").val(item.UseManualWheelchairLastScore);
				// 	$("#SC-UsePowerWheelchairLastScore").val(item.UsePowerWheelchairLastScore);

				// 	if (item.UsePowerWheelchair === true) {
				// 		$("#SC-UsePowerWheelchair").prop("checked", true);
				// 		$("#SC-UseManualWheelchair").prop("checked", false);
				// 	} else if (item.UseManualWheelchair === true) {
				// 		$("#SC-UsePowerWheelchair").prop("checked", false);
				// 		$("#SC-UseManualWheelchair").prop("checked", true);
				// 	} else {
				// 		$("#SC-UsePowerWheelchair").prop("checked", false);
				// 		$("#SC-UseManualWheelchair").prop("checked", false);
				// 	}
				// 	//步行
				// 	$("#SC-WalkingLastScore").val(item.WalkingLastScore);
				// 	$("#SC-WalkingCurrentScore").val(item.WalkingCurrentScore);

				// 	//如廁
				// 	$("#SC-ToiletLastScore").val(item.ToiletLastScore);
				// 	$("#SC-ToiletCurrentScore").val(item.ToiletCurrentScore);

				// 	//沐浴
				// 	$("#SC-BathingLastScore").val(item.BathingLastScore);
				// 	$("#SC-BathingCurrentScore").val(item.BathingCurrentScore);

				// 	//爬樓梯
				// 	$("#SC-StairClimbingLastScore").val(item.StairClimbingLastScore);
				// 	$("#SC-StairClimbingCurrentScore").val(item.StairClimbingCurrentScore);
				// }
			},

			error: function () {
				$("#error").text("An error occurred. Please try again later.");
			},
		});
	});
});
