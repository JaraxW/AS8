/*************************************
项目名称：**********
author：GPT
**************************************
[rewrite_local]
#! ^https:([\S\s]*?)gameloft.com/scripts/general/sync_all.php url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8unlock.js
#! ^https:([\S\s]*?)gameloft.com/scripts/energy/pre_tle_race.php url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8unlock.js
^https:([\S\s]*?)gameloft.com/configs/users/me url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8unlock.js
^https:([\S\s]*?)unityads.unity3d.com/([\S\s]*?)/config.json url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8unlock.js

^https:([\S\s]*?)gameloft.com/scripts url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8unlock.js
^https:([\S\s]*?)gameloft.com/profiles/me/myprofile url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8unlock.js

# ! ^https://iap-eur.gameloft.com/inapp_crm/index.php url script-response-body http://192.168.8.229:8088/A8unlock.js
#! ^https:([\S\s]*?)gameloft.com/authorize url script-request-body http://192.168.8.229:8088/A8unlock.js
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
let res = JSON["parse"](typeof $response !== "undefined" && $response.body || null);

const u3d_ad = /config.json/;
if (u3d_ad.test($request.url)) {
    let body = res;
    if (body["SRR"]) {
        body["SRR"]["placements"].forEach(ad_item => {
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
        });
        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

const adnw = /facebook.com\/adnw_sync2/;
if (adnw.test($request.url)) {
    let body = res;
    body["refresh"]["target_refresh_s"] = 10;
    body["bundles"]["feature_config"]["data"]["feature_config"]["adnw_android_network_default_connection_timeout_ms"] = 100;
    obj.body = JSON.stringify(body);
    $done(obj);
}

const me = /gameloft.com\/configs\/users\/me/;
if (me.test($request.url)) {
    let body = res;
    // 保留原有逻辑
    body["game"]["parameters"]["init"]["onboardingGift"] = {};
    body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
    body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
        "MinimumReward": 30000,
        "creditsForAdsCap": 37500
    };

    let cars = [];
    let qu = [40, 43, 141, 208, 380, 381, 331];
    for (let i = 1; i <= 399; i++) {
        if (!qu.includes(i)) {
            cars.push(i);
        }
    }
    body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

    // 保留原来的内购解锁逻辑
    body["offline_store"]["prices"].forEach(item => {
        item["hidden"] = false;
    });

    body["iap"]["prices"].forEach(item => {
        item["hidden"] = false;
        item["billing_methods"].forEach(method => {
            method["price"] = 0.01;
        });
    });

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
    let body = $request.body;
    body = body.replace(/username([\S\s]+?)[\&]/, "username=anonymous%2FOtMyt5EPkvgRcxM%3AdjNjQ3MjEwM1fMT%dr2BkYZ71D&");
    body = body.replace(/password([\S\s]+?)[\&]/, "password=GIHI7x9ofH5q55vJ&");
    $done({ body });
}

const pre_tle_race = /^https:([\S\s]*?)energy\/pre_tle_race.php/;
if (pre_tle_race.test($request.url)) {
    if (res && res["body"]) {
        let body = res;
        let timestamp = Math.floor((new Date().getTime() + 1000 * 60 * 60 * 24 * 364) / 1000);

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

const script_g = /^https:([\S\s]*?)gameloft.com\/scripts([\S\s]*?).php/;
const sync = /^https:([\S\s]*?)sync_all.php/;
if (sync.test($request.url) || script_g.test($request.url)) {
    if (res && res["body"]) {
        let body = res;
        let timestamp = Math.floor((new Date().getTime() + 1000 * 60 * 60 * 24 * 364) / 1000);

        let cars = [];
        let cars_parts = {};
        for (let i = 1; i <= 399; i++) {
            cars_parts[i] = {
                "tyres": 10,
                "suspension": 10,
                "drive train": 10,
                "exhaust": 10,
                "top_speed": 10,
                "nitro": 10,
                "acceleration": 10,
                "handling": 10,
                "updated_ts": 1712265302
            };
            cars.push(i);
        }

        if (body["body"]["upgrades_full_sync"]) {
            body["body"]["upgrades_full_sync"]["body"]["upgrades"] = cars_parts;
        }

        if (body["body"]["progressive_ads_sync"]) {
            body["body"]["progressive_ads_sync"]["body"]["duration"] = 372800;
        }

        if (body["body"]["server_items_full_sync"]) {
            body["body"]["server_items_full_sync"]["body"]["cars"] = cars;
        }

        body["body"]["prokits_car_parts_full_sync"] = {
            "body": {
                "cars_parts": cars_parts,
                "up_to_date": false,
                "sync_key": "1712288961"
            }
        };

        body["body"]["infractions_sync"]["body"]["infractions"] = "";
        body["body"]["boosters_sync"]["body"]["active"] = {
            "extra_tank": { "min": timestamp },
            "performance": { "min": timestamp },
            "nitro": { "min": timestamp },
            "credits": { "min": timestamp }
        };
        body["body"]["adjoe_sync"] = { "body": {} };
        body["body"]["vip_full_sync"]["body"]["level"] = 15;

        obj.body = JSON.stringify(body);
        $done(obj);
    }
}
