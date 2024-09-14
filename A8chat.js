/*************************************

项目名称：**********
author：xdz1

**************************************
[rewrite_local]
#! ^https:([\S\s]*?)gameloft.com/scripts/general/sync_all.php url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8.js
#! ^https:([\S\s]*?)gameloft.com/scripts/energy/pre_tle_race.php url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8.js
^https:([\S\s]*?)gameloft.com/configs/users/me url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8.js
^https:([\S\s]*?)unityads.unity3d.com/([\S\s]*?)/config.json url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8.js

^https:([\S\s]*?)gameloft.com/scripts url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8.js
^https:([\S\s]*?)gameloft.com/profiles/me/myprofile url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8.js

# ! ^https://iap-eur.gameloft.com/inapp_crm/index.php url script-response-body http://192.168.8.229:8088/A8.js
#! ^https:([\S\s]*?)gameloft.com/authorize url script-request-body http://192.168.8.229:8088/A8.js
#! 下面是去广告
#! ^https://web.facebook.com/adnw_sync2 url reject
#! ^https:([\S\s]*?)unityads.unity3d.com url reject
#! ^https://a4.applovin.com/4.0/ad url reject
#! ^https:([\S\s]*?)iads.unity3d.com url reject
#! ^https:([\S\s]*?)ads.vungle.com url reject
[mitm]
hostname = *.gameloft.com,ads.vungle.com,*.unity3d.com,*.applovin.com, web.facebook.com,applovin.com

*************************************/

let obj = {};
let res = JSON["parse"]
(typeof $response != "undefined" &&
    $response.body ||
    null
);

const u3d_ad = /config.json/;
if (u3d_ad.test($request.url) ) {
	let body = res;
	if (body["SRR"]) {
		for (let ad_item of body["SRR"]["placements"] ) {
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

const adnw = /facebook.com\/adnw_sync2/;
if (adnw.test($request.url) ) {
	let body = res;
	body["refresh"]["target_refresh_s"] = 10;
	body["bundles"]["feature_config"]["data"]["feature_config"]["adnw_android_network_default_connection_timeout_ms"] = 100;
	obj.body = JSON.stringify(body);
	$done(obj);
}

// gameloft.com/configs/users/me
const me = /gameloft.com\/configs\/users\/me/;

if (me.test($request.url) ) {
	let body = res;
	body["game"]["parameters"]["init"]["onboardingGift"] = {};
	body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
	body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
	body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
	body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
		"MinimumReward": 30000,
		"creditsForAdsCap": 37500
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

const myprofile = /gameloft.com\/profiles\/me\/myprofile/;

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

const authorize = /^https:([\S\s]*?)gameloft.com\/authorize/;

if (authorize.test($request.url)) {
	let regex = /username([\S\s]+?)[\&]/;
	let body = $request.body.replace(regex, "username=anonymous%2FOtMyt5EPkvgRcxM%3AdjNjQ3MjEwM1fMT%dr2BkYZ71D&");
	regex = /password([\S\s]+?)[\&]/;
	body = body.replace(regex, "password=GIHI7x9ofH5q55vJ&");
	$done({body});
}

// sync start
let pre_tle_race = /^https:([\S\s]*?)energy\/pre_tle_race.php/;
if (pre_tle_race.test($request.url)) {
	if ($response === undefined) {
	} else if (res && res["body"]) {
		let body = res;

		let timestamp = new Date().getTime();
		timestamp = Math.floor((timestamp + (1000 * 60 * 60 * 24 * 364)) / 1000);

		body["body"]["infractions_sync"]["body"]["infractions"] = "";

		body["body"]["boosters_sync"]["body"]["active"] = {
			"extra_tank": {
				"min": timestamp
			},
			"performance": {
				"min": timestamp
			},
			"nitro": {
				"min": timestamp
			},
			"credits": {
				"min": timestamp
			}
		};
		
		// 无限extra_tank、performance、nitro
		body["body"]["boosters_sync"] = {
			"extra_tank": 999999,
			"performance": 999999,
			"nitro": 999999
		};

		obj.body = JSON.stringify(body);
	}
	$done(obj);
}

// sync start gameloft.com/scripts
const script_g = /^https:([\S\s]*?)gameloft.com\/scripts([\S\s]*?).php/;
const sync = /^https:([\S\s]*?)sync_all.php/;
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

			cars_parts[i + ""] = {
				"tyres": 10,
				"suspension": 10,
				"drive train": 10,
				"exhaust": 10,
				"acceleration": 10,
				"top_speed": 10,
				"handling": 10,
				"nitro": 10,
				"updated_ts": 1712265302
			};
			cars.push(i);
		}

		body["body"]["upgrades_full_sync"]["body"]["upgrades"] = cars
