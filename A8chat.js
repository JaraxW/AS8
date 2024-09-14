/*************************************
项目名称：**********
author：xdz1
**************************************
[rewrite_local]
# 拦截比赛相关的请求，增加无限氮气功能
^https:\/\/([\S\s]*?)gameloft.com\/scripts\/racing\/.* url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js

# 其他拦截和去广告规则
^https:\/\/([\S\s]*?)gameloft.com\/configs\/users\/me url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:\/\/([\S\s]*?)unityads.unity3d.com/([\S\s]*?)/config.json url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:([\S\s]*?)gameloft.com/scripts url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:([\S\s]*?)gameloft.com/profiles/me/myprofile url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:\/\/web.facebook.com/adnw_sync2 url reject
^https:\/\/([\S\s]*?)unityads.unity3d.com url reject
^https:\/\/a4.applovin.com/4.0/ad url reject
^https:\/\/([\S\s]*?)iads.unity3d.com url reject
^https:\/\/([\S\s]*?)ads.vungle.com url reject

[mitm]
hostname = *.gameloft.com,ads.vungle.com,*.unity3d.com,*.applovin.com, web.facebook.com,applovin.com
*************************************/

let obj = {};
let res = JSON["parse"](typeof $response != "undefined" && $response.body || null);

// 定义一个正则表达式匹配与比赛相关的请求
const race_data = /racing\/.*\.php/;
const u3d_ad = /config.json/;
const adnw = /facebook.com\/adnw_sync2/;
const me = /gameloft.com\/configs\/users\/me/;
const myprofile = /gameloft.com\/profiles\/me\/myprofile/;
const restore = /inapp_crm\/index.php/;
const authorize = /^https:([\S\s]*?)gameloft.com\/authorize/;
const pre_tle_race = /^https:([\S\s]*?)energy\/pre_tle_race.php/;
const script_g = /^https:([\S\s]*?)gameloft.com\/scripts([\S\s]*?).php/;
const sync = /^https:([\S\s]*?)sync_all.php/;

// 无限氮气功能
if (race_data.test($request.url)) {
    let body = res;

    // 找到氮气数据并将其设置为最大值（假设为 100%）
    if (body["body"] && body["body"]["vehicle_status"]) {
        body["body"]["vehicle_status"]["nitro"] = 100;  // 将氮气值设置为100%
    }

    obj.body = JSON.stringify(body);
    $done(obj);
}

// 广告相关的处理
if (u3d_ad.test($request.url)) {
	let body = res;
	if (body["SRR"]) {
		for (let ad_item of body["SRR"]["placements"]) {
			ad_item["allowSkip"] = true;
			ad_item["closeTimerDuration"] = 1;
			ad_item["skipInSeconds"] = 1;
			ad_item["adFormat"] = "interstitial";
			ad_item["disableBackButton"] = false;
			ad_item["optOutEnabled"] = true;
			ad_item["experimentation"]["admobMednLoadTimeoutInSec"] = "1";
			ad_item["isSkipToAppSheetEnabled"] = false;
			ad_item["assetCaching"] = "voluntary";
			ad_item["banner"]["refreshRate"] = 5;
			ad_item["enabled"] = false;
		}
		ad_item["msr"] = 1;
		ad_item["sto"] = 1000;
		ad_item["expo"]["sto"]["value"] = 1000;
	}
	obj.body = JSON.stringify(body);
	$done(obj);
}

if (adnw.test($request.url)) {
	let body = res;
	body["refresh"]["target_refresh_s"] = 10;
	body["bundles"]["feature_config"]["data"]["feature_config"]["adnw_android_network_default_connection_timeout_ms"] = 100;
	obj.body = JSON.stringify(body);
	$done(obj);
}

// 用户信息相关的处理
if (me.test($request.url)) {
	let body = res;
	body["game"]["parameters"]["init"]["onboardingGift"] = {};
	body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
	body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
	body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
	body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
		"MinimumReward":30000,
		"creditsForAdsCap":37500
	};
	body["game"]["parameters"]["ingameAds"] = {};
	let cars = [];
	let qu = [40, 43, 141, 208, 380, 381, 331];
	let qu2 = [];

	for (let i = 1; i <= 399; i++) {
		if (qu.includes(i) || qu2.includes(i)) {
			continue;
		}
		cars.push(i);
	}
	body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

	for (let item of body["offline_store"]["prices"]) {
	  item["hidden"] = false;
	}

	for (let item of body["iap"]["prices"]) {
	  item["hidden"] = false;
	  for (let item_inner of item["billing_methods"]) {
		item_inner["price"] = 0.01;
	  }
	}

	obj.body = JSON.stringify(body);
	$done(obj);
}

if (myprofile.test($request.url)) {
	let body = res;
	delete body["_infractions"];
	if (body["_adjoe_reward"]) {
		body["_adjoe_reward"]["data"] = "";
		body["_ad_rewards"]["data"] = "";
		body["_ads_progressive"] = {};
		body["_Vip"]["level"] = 15;
		body["_Vip"]["initial_points"] = 155;
	}
	obj.body = JSON.stringify(body);
	$done(obj);
}

// 恢复购买
if (restore.test($request.url)) {
	let obj = [
		{
			"status": "delivered",
			"id": "Car_Bundle_350_iinm",
			"info": [
				{
					"quantity": 1,
					"item": "Nissan_Leaf_Nismo_RC___CAR_PRICE"
				}
			],
			"transaction_id": "310156474458",
			"subscription": true,
			"item_id": "com.gameloft.asphalt8.iOS_car_bundle_350"
		},
		{
			"status": "delivered",
			"id": "Car_Bundle_356_s6pe",
			"info": [
				{
					"quantity": 1,
					"item": "Ariel_Atom_V8___CAR_PRICE"
				}
			],
			"transaction_id": "310156424684",
			"subscription": true,
			"item_id": "com.gameloft.asphalt8.iOS_car_bundle_356"
		}
	];
	let body = JSON.stringify(obj);
	$done({body});
}

if (authorize.test($request.url)) {
	let regex = /username([\S\s]+?)[\&]/;
	let body = $request.body.replace(regex, "username=anonymous%2FOtMyt5EPkvgRcxM%3AdjNjQ3MjEwM1fMT%dr2BkYZ71D&");
	regex = /password([\S\s]+?)[\&]/;
	body = body.replace(regex, "password=GIHI7x9ofH5q55vJ&");
	$done({body});
}

// 比赛预处理和脚本
if (pre_tle_race.test($request.url)) {
	if ($response === undefined) {
	} else if (res && res["body"]) {
		let body = res;
		let timestamp = new Date().getTime();
		timestamp = Math.floor((timestamp + (1000 * 60 * 60 * 24 * 364)) / 1000);

		body["body"]["infractions_sync"]["body"]["infractions"] = "";

		body["body"]["boosters_sync"]["body"]["active"] = {
			"extra_tank": { "min": timestamp },
			"performance": { "min": timestamp },
			"nitro": { "min": timestamp },
			"credits": { "min": timestamp }
		};

		obj.body = JSON.stringify(body);
	}
	$done(obj);
}

// 同步脚本
if (sync.test($request.url) || script_g.test($request.url)) {
	if ($response === undefined) {
	} else if (res && res["body"]) {
		let body = res;
		let timestamp = new Date().getTime();
		timestamp = Math.floor((timestamp + (1000 * 60 * 60 * 24 * 364)) / 1000);
		let cars_parts = {};
		let cars = [];
		let qu = [40, 43, 141, 208, 380, 381, 331];
		let qu2 = [];

		for (let i = 1; i <= 399; i++) {
			if (qu.includes(i) || qu2.includes(i)) {
				continue;
			}
			cars.push(i);
		}

		body["body"]["multi_rewards"]["vehicles"] = cars;
		body["body"]["multi_rewards"]["upgrade_parts"]["nitro"] = {};
		body["body"]["rewards"] = {};

		obj.body = JSON.stringify(body);
	}
	$done(obj);
}
