// 2023/05/12 避免在外部引入此js的時候，使用(document).readyc或$(window).on('load'，會有偶爾js載入順序不完全的問題發生。
// 2023/09/05 改寫$(document).on('click', '#controlShowPanel', function() {方法，讓其對動態產生，或未來產生的元件做綁定。
document.addEventListener("DOMContentLoaded", () => {
	new (class Header {
		constructor() {
			$(document).on("click", "#controlShowPanel", function () {
				openControler();
			});
			setTimeout(initUserType, 100);
		}

		initUserType() {}
	})();
});

// 依據使用者身分判斷顯示的浮動視窗
function initUserType() {
	// 首先隱藏所有菜單
	$("#noneLoginPopup").hide();

	// 從 sessionStorage 獲取 userType
	const userType = sessionStorage.getItem("userType");
	const coachMenu = document.getElementById("coachMenu");
	const caseMenu = document.getElementById("caseMenu");
	const controlShowPanel = document.getElementById("controlShowPanel");
	const profileMenu = document.getElementById("profileMenu");
	const profileButton = document.getElementById("profileButton");

	console.log("userType:" + userType);
	console.log("coachMenu:", coachMenu, "caseMenu:", caseMenu);
	if (!userType) {
		console.warn("未能取得 userType");
		// 可以選擇顯示預設選單或隱藏所有
		coachMenu.style.display = "none";
		caseMenu.style.display = "none";
		return;
	}

	// 根據 userType= 1:個案、2:教練、else:其他 顯示相應的視窗
	if (userType === "1") {
		// 個案
		caseMenu.style.display = "flex";
		caseMenu.style.alignItems = "center";
		coachMenu.style.display = "none";
		profileMenu.style.display = "block";
		profileButton.style.display = "none";

		// debugLog('userType=' + userType);
		$(document).on("click", "#controlShowPanel", function () {
			openControler("userPopup");
		});
	} else if (userType === "2") {
		// 教練
		coachMenu.style.display = "flex";
		caseMenu.style.alignItems = "center";
		caseMenu.style.display = "none";
		controlShowPanel.style.display = "none";
		profileMenu.style.display = "block";
		profileButton.style.display = "none";
		// console.log('userType=' + userType);
		$(document).on("click", "#controlShowPanel", function () {
			openControler("couchPopup");
		});
	} else if (!userType || userType === "null") {
		$(document).on("click", "#controlShowPanel", function () {
			openControler("noneLoginPopup");
		});
	}
} // end initUserType

// 在登出函數中刪除 sessionId 並導向其他頁面
function logout() {
	sessionStorage.removeItem("sessionId");
	sessionStorage.removeItem("userType");
	// console.log("session_id: ", sessionStorage.getItem('sessionId'));
	// console.log("userType: ", sessionStorage.getItem('userType'));
	window.location.assign("../LoginPage/index.html");
}

// 切換nav開關
let navOpen = false;
function toggleNav() {
	if (navOpen) {
		closeNav();
	} else {
		openNav();
	}
	navOpen = !navOpen;
}

// 開啟nav
function openNav() {
	document.getElementById("mySidenav").style.display = "block";
	let menuImg = document.getElementById("menu_nav_button");
	menuImg.src = "../../assets/menu_focus.svg";

	$("body").css("overflow", "hidden"); // 打開nav時禁用滾動
}

// 關閉nav
function closeNav() {
	document.getElementById("mySidenav").style.display = "none";
	let menuImg = document.getElementById("menu_nav_button");
	menuImg.src = "../../assets/menu.svg";

	$("body").css("overflow", "auto"); // 關閉nav時啟用滾動
}

let popupOpen = true;

function openControler() {
	const userTypeString = sessionStorage.getItem("userType");
	const userType = !userTypeString || userTypeString === "null" ? null : parseInt(userTypeString);

	if (!noneLoginPopup) {
		console.error("❌ 找不到 noneLoginPopup 元素！");
		return;
	}

	console.log("userType 是：", userType);

	if (userType === null) {
		if (popupOpen) {
			noneLoginPopup.style.display = "block";
		} else {
			noneLoginPopup.style.display = "none";
		}
		popupOpen = !popupOpen;
	} else {
		noneLoginPopup.style.display = "none";
		popupOpen = true;
	}
}

// 點擊空白區域關閉浮動視窗
$(document).on("click", function (event) {
	if (!$(event.target).is("#controlShowPanel") && !popupOpen) {
		$(".rightPanelRoot").hide();
		popupOpen = true;
	}
});
