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
	var step = "01";

	let params = new URLSearchParams(window.location.search);
	const testparams = Object.fromEntries(params.entries());
	let data = { workOrderId: testparams.workOrderID };

	let paramStep = params.get("step");

	let paramBigStep = params.get("bigstep");

	let targetScore = 0;

	function formatDate(date) {
		const year = date.getFullYear();

		const month = String(date.getMonth() + 1).padStart(2, "0");

		const day = String(date.getDate()).padStart(2, "0");

		return `${year}/${month}/${day}`;
	}

	$(".next").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }];
			if ($("input[name='lv']:checked").val() == 4) {
				let payload = [];
				$("input[name='lv4']:checked").each((idx, e) => {
					payload.push(Number($(e).val()));
				});

				newData[0].value.push({ 4: payload });
			} else {
				newData[0].value.push(Number($("input[name='lv']:checked").val()));
			}

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;
			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;
			update();
		} else if (step == "02") {
			const date = new Date();
			const formattedDate = formatDate(date);

			let oldDataItem = oldData.item[paramBigStep].item[Number(step) - 1].item[0].value;

			let newData = {};
			let levelData = {};

			const dateBoxValues = $(".date-box .past-box")
				.map((_, el) => $(el).text().trim())
				.get();
			``;
			const leftLvBoxValue = $(".left-box .lv-box .target-box").text().trim();
			const rightLvBox = $(".right-box .lv-box");

			rightLvBox.find(".past-box").each((index, element) => {
				const date = dateBoxValues[index];
				const value = $(element).text().trim();
				// levelData[date] = value;
			});

			// levelData[formattedDate] = leftLvBoxValue;
			// levelData['value'] = $(`input[data-list-id=0]`).val();

			const result = [];
			const lengthOfList = 12;

			for (i = 0; i < lengthOfList; i++) {
				const targetValue = Number($(`.table-box[data-target=${i}] .select-box`).text().trim()); //目標值下拉選單
				const targetValue2 = $(`input[data-list-id=0]`).val(); //功能分級輸入值

				const pastValues = $(`.table-box[data-past=${i}] .past-box`)
					.map((_, el) => $(el).text().trim())
					.get(); //回傳過來的目標值
				// const nonZeroPastValues = pastValues.filter(value => Number(value) !== 0);//回傳過來的目標值

				const nonZeroPastValues = i === 0 ? targetValue2 : pastValues.filter((value) => Number(value) !== 0); //回傳過來的目標值

				// if (nonZeroPastValues.length > 0 || targetValue !== 0) {
				// if (nonZeroPastValues.length > 0) {
				const obj = {};
				if (i === 0) {
					obj["target"] = targetValue2;
				} else {
					// obj['target'] = oldDataItem[i] ? oldDataItem[i]['target'] : 0;
					obj["target"] = targetValue ? targetValue : 0;
				}

				dateBoxValues.forEach((date, idx) => {
					if (pastValues[idx] !== 0) {
						if (i === 0) {
							obj[date] = pastValues[idx];
						} else {
							obj[date] = Number(pastValues[idx]);
						}
					}
				});

				//當天
				if (i === 0) {
					obj[formattedDate] = targetValue2;
				} else {
					if (targetValue !== 0) {
						obj[formattedDate] = targetValue; //手動選擇的目標值(只放不是0的)
					}
				}

				if (i === 7) {
					$(`input[data-list-id=7]`).each((inx, e) => {
						if ($(e).is(":checked")) {
							obj["value"] = Number($(e).val());
						}
					});
				}

				if (i === 8) {
					obj["value"] = $(`input[data-list-id=8]`).val();
				}

				newData[i] = obj;

				result.push(obj);
				// }
			}
			//       newData[0] = levelData;//第1列

			// 檢查資料結構是否存在，如果不存在則創建
			if (
				oldData?.item?.[paramBigStep] &&
				Array.isArray(oldData.item[paramBigStep]?.item) &&
				oldData.item[paramBigStep]?.item[Number(step) - 1]?.item &&
				Array.isArray(oldData.item[paramBigStep]?.item[Number(step) - 1]?.item)
			) {
				oldData.item[paramBigStep].item[Number(step) - 1].item[0].value = newData;
			}

			// oldData.item[paramBigStep].item[Number(step) - 1].item[0].value = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update();
		}
	});

	$(".prev").on("click", function () {
		if (step == "01") {
			let newData = [{ value: [] }];

			if ($("input[name='lv']:checked").val() == 4) {
				let payload = [];

				$("input[name='lv4']:checked").each((idx, e) => {
					payload.push(Number($(e).val()));
				});

				newData[0].value.push({ 4: payload });
			} else {
				newData[0].value.push(Number($("input[name='lv']:checked").val()));
			}

			oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		} else if (step == "02") {
			// let newData = [

			//   { value: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] },

			// ];

			// $(".table-box.date-box .past-box").each((idx, e) => {

			//   $('[data-past="0"] .past-box').each((idxx, ee) => {

			//     newData[0].value[0][$(e).text()] = $(ee).text().replace(/\s/g, "");

			//   });

			// });

			// newData[0].value[0]["target"] = $(".lv-box .target-box").text();

			// $(".table-box.date-box .past-box").each((idx, e) => {

			//   $(`[data-pastscore=${idx}]`).each((idxx, ee) => {

			//     newData[0].value[idxx + 1][$(e).text()] = Number($(ee).text());

			//   });

			//   for (let i = 0; i < 12; i++) {

			//     if (i > $(".table-box.date-box .past-box").length)

			//       newData[0].value[i][$(e).text()] = 0;

			//   }

			// });

			// for (let i = 0; i < 12; i++) {

			//   if (i > $(".table-box.date-box .past-box").length)

			//     newData[0].value[i]["target"] = 0;

			// }

			// $(`[data-target] .select-box`).each((idx, e) => {

			//   if ($(e).text() != 0) {

			//     if (newData[0].value[idx + 1]) {

			//       newData[0].value[idx + 1]["target"] = Number($(e).text());

			//     }

			//   }

			// });

			// oldData.item[paramBigStep].item[Number(step) - 1].item = newData;

			// oldData.item[paramBigStep].item[Number(step) - 1].if_complete = true;

			update("prev");
		}
	});

	//評分標準說明

	$(".score-box").on("click", function () {
		$(".tips-box-bg").css("display", "block");
	});

	$(".tips-box .close-box").on("click", function () {
		$(".tips-box-bg").css("display", "none");
	});

	//彈出視窗
	var testdata = null;

	$(".select-box").on("click", function (e) {
		$(".popup-box-bg").css("display", "block");

		testdata = null;

		testdata = $(this);

		if (testdata.text()) {
			$(`#level${testdata.text()}`).prop("checked", true);
		}
	});

	$(".popup-box .close-box").on("click", function () {
		$(".popup-box-bg").css("display", "none");
	});

	$(".button-box button").on("click", function () {
		if (testdata.text()) {
			console.log(testdata.text());

			targetScore = targetScore + Number($("[name='level']:checked").val() - Number(testdata.text()));
		} else {
			targetScore = targetScore + Number($("[name='level']:checked").val());
		}

		testdata.text($("[name='level']:checked").val());

		$("#level1").prop("checked", true);

		$(".popup-box-bg").css("display", "none");

		$(".left-box .score .target-box").text(`${targetScore}分`);
	});

	const getStep = () => {
		if (paramStep) {
			step = `0${paramStep}`;

			$(".title span span").html(`0${paramStep}`);

			$(".step01").css("display", "none");

			$(`.step0${paramStep}`).css("display", "block");
		}

		$(`[name="lv"]`).click(() => {
			$(`[name="lv4"]`).prop("checked", false);
		});
	};

	const sortInnerObject = (obj) => {
		const { target, ...rest } = obj;

		const sortedRest = Object.keys(rest)

			.sort()

			.reduce((acc, key) => {
				acc[key] = rest[key];

				return acc;
			}, {});

		return { target, ...sortedRest };
	};

	var oldData = null;
	//預設資料
	const getCheckListRecord = () => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "getCheckListRecord";

		let chsm = "upStrongCheckListApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				handleResponse(res);
				if (res.returnCode) {
					if (res.assessmentor) {
						$(".coach-name span:first").text(res.assessmentor);
					}
					console.log(res);

					oldData = res.returnData;

					let data01 = res.returnData.item[paramBigStep].item[0]; //粗大動作功能分級 01/02

					let data02 = res.returnData.item[paramBigStep].item[1].item[0].value; //粗大動作功能分級 02/02

					console.log(data02);

					if (typeof data01.item[0].value[0] !== "object") {
						$(`#lv${data01.item[0].value[0]}`).attr("checked", true);
					} else {
						$.each(data01.item[0].value[0], (level, checkboxValues) => {
							$(`#lv${level}`).attr("checked", true);

							checkboxValues.map((i) => {
								$(`#lv${level}_0${i}`).attr("checked", true);
							});
						});
					}

					$(".right-box .table-box").html("");
					const sortedTableData = Object.keys(data02).reduce((acc, key) => {
						acc[key] = sortInnerObject(data02[key]);
						return acc;
					}, {});

					const transformedData = Object.entries(sortedTableData).flatMap(([idx, obj]) =>
						Object.keys(obj).map((key, idxx) => ({
							id: idx,

							date: key,

							value: Object.values(obj)[idxx],

							pastnum: idxx,
						}))
					);

					$(transformedData).each((idx, e) => {
						console.log("test:", e);

						if (e.date == "target") {
							//目標值
							if (e.id == 0) {
								$(".left-box .lv-box .target-box").text(e.value);
							} else {
								$(`[data-target=${e.id}] .select-box`).text(e.value);
							}
						} else if (e.date == "value") {
							//輸入框
							if (e.id == 7) {
								$(`#radio0${e.value}`).attr("checked", true);
							}
							if (e.id == 8) {
								$(`[data-list-id=8]`).val(e.value);
							}
						} else if (e.date != "target") {
							if (e.id == 0) {
								$(".right-box .date-box").append(`
                  <span class="past-box">${e.date}</span>
                `);
								$(`[data-past=${e.id}]`).append(`
                  <span class="past-box">${e.value}</span>
                `);
								$(`[data-list-id=0]`).val(e.value);
							} else {
								$(`[data-past=${e.id}]`).append(`
                  <span class="past-box" data-pastScore="${e.pastnum}">${e.value !== null ? e.value : 0}</span>
                `);
							}
						}
					});

					//填充空白
					// console.log(Object.keys(data02))
					// let lengthOfRecord = Object.keys(data02[0]).length;

					let firstKey = Object.keys(data02)[0];
					let lengthOfRecord = Object.keys(data02[firstKey]).length;

					$(".right-box .table-box").each((idx, e) => {
						if (idx === 0 || idx === 1) {
							// if(idx === 0 || idx === 1 || idx === 2 || idx === 3) {

							return;
						}

						if (!data02[idx - 1]) {
							console.log(idx, data02[idx - 1]);

							for (let i = 0; i < lengthOfRecord - 1; i++) {
								$(e).append(`

                    <span class="past-box" data-test=${i}>0</span>

                  `);
							}
						}
					});

					//總分

					$("[data-target] .target-box").each((idx, e) => {
						if (idx != 0) {
							targetScore = targetScore + Number($(e).text());
						}
					});

					$(".right-box .score .past-box").each((idx, e) => {
						for (let i = 0; i < Object.keys(data02).length - 1; i++) {
							$(`[data-pastscore=${i + 1}]`).each((idxx, ee) => {
								if (i == idx) {
									$(e).text(Number($(e).text()) + Number($(ee).text()));
								}
							});
						}
					});

					$("[data-pastscore]").each((idx, e) => {});

					$(".left-box .score .target-box").text(`${targetScore}分`);
				}
			},
		});
	};

	getStep();

	getCheckListRecord();

	//存檔API
	const update = (type) => {
		let formData = new FormData();

		let session_id = sessionStorage.getItem("sessionId");

		let action = "updateCheckListRecord";

		let chsm = "upStrongCheckListApi"; // api文件相關

		chsm = $.md5(session_id + action + chsm);

		formData.append("session_id", session_id);

		formData.append("action", action);

		formData.append("chsm", chsm);

		formData.append("data", JSON.stringify(oldData));

		console.log("SendData:" + JSON.stringify(oldData));

		$.ajax({
			url: `${window.apiUrl}${window.apicheckList}`,

			type: "POST",

			data: formData,

			processData: false,

			contentType: false,

			success: function (res) {
				if (res.returnCode) {
					if (type != "prev") {
						if (step != "02") {
							$(".title span span").html(`0${Number(step) + 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) + 1}`).css("display", "block");

							step = `0${Number(step) + 1}`;

							const url = new URL(window.location.href);

							url.searchParams.set("step", Number(step));

							window.history.replaceState(null, "", url);
						} else {
							window.location.href = `../../AssessmentPage/question/Index06.html?workOrderID=${testparams.workOrderID}`;
						}
					} else {
						if (step != "01") {
							$(".title span span").html(`0${Number(step) - 1}`);

							$(`.step0${Number(step)}`).css("display", "none");

							$(`.step0${Number(step) - 1}`).css("display", "block");

							step = `0${Number(step) - 1}`;
						} else {
							window.location.href = `../../AssessmentPage/question/Index05.html?workOrderID=${testparams.workOrderID}`;
						}
					}
				}
			},

			error: function (e) {
				alert(e);
			},
		});
	};

	$(".home-box").click(() => {
		window.location.href = `../../AssessmentPage/index.html?workOrderID=${testparams.workOrderID}`;
	});
});
