/*************************************
项目名称：**********
author：xdz1
**************************************
[rewrite_local]
#! ^https:([\S\s]*?)gameloft.com/scripts/general/sync_all.php url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
#! ^https:([\S\s]*?)gameloft.com/scripts/energy/pre_tle_race.php url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:([\S\s]*?)gameloft.com/configs/users/me url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:([\S\s]*?)unityads.unity3d.com/([\S\s]*?)/config.json url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js

^https:([\S\s]*?)gameloft.com/scripts url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js
^https:([\S\s]*?)gameloft.com/profiles/me/myprofile url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8chat.js

# ! ^https://iap-eur.gameloft.com/inapp_crm/index.php url script-response-body http://192.168.8.229:8088/A8chat.js
#! ^https:([\S\s]*?)gameloft.com/authorize url script-request-body http://192.168.8.229:8088/A8chat.js
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
let res = JSON.parse(typeof $response !== "undefined" && $response.body || null);

// 广告相关的处理逻辑
const u3d_ad = /config.json/;
if (u3d_ad.test($request.url)) {
    let body = res;
    if (body["SRR"]) {
        body["SRR"]["placements"].forEach(ad_item => {
            Object.assign(ad_item, {
                allowSkip: true,
                closeTimerDuration: 1,
                skipInSeconds: 1,
                adFormat: "interstitial",
                disableBackButton: false,
                optOutEnabled: true,
                experimentation: { admobMednLoadTimeoutInSec: "1" },
                isSkipToAppSheetEnabled: false,
                assetCaching: "voluntary",
                banner: { refreshRate: 5 },
                enabled: false
            });
        });
        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

// Facebook广告相关逻辑
const adnw = /facebook.com\/adnw_sync2/;
if (adnw.test($request.url)) {
    let body = res;
    body["refresh"]["target_refresh_s"] = 10;
    body["bundles"]["feature_config"]["data"]["feature_config"]["adnw_android_network_default_connection_timeout_ms"] = 100;
    obj.body = JSON.stringify(body);
    $done(obj);
}

// 解锁内购和解锁全部车辆的逻辑
const me = /gameloft.com\/configs\/users\/me/;
if (me.test($request.url)) {
    let body = res;

    // 解锁内购逻辑
    body["offline_store"]["prices"].forEach(item => {
        item["hidden"] = false;
    });
    body["iap"]["prices"].forEach(item => {
        item["hidden"] = false;
        item["billing_methods"].forEach(method => {
            method["price"] = 0.01;
        });
    });

    // 解锁全部车辆逻辑
    let cars = [];
    let excludeCars = [40, 43, 141, 208, 380, 381, 331]; // 排除的车辆
    for (let i = 1; i <= 399; i++) {
        if (!excludeCars.includes(i)) {
            cars.push(i);
        }
    }
    body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

    obj.body = JSON.stringify(body);
    $done(obj);
}

// 个人资料同步的处理
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

// 恢复购买的处理
const restore = /inapp_crm\/index.php/;
if (restore.test($request.url)) {
    if (!/action/.test($request.url)) {
        let body = JSON.stringify([
            {
                "status": "delivered",
                "id": "Car_Bundle_350_iinm",
                "info": [{ "quantity": 1, "item": "Nissan_Leaf_Nismo_RC___CAR_PRICE" }],
                "transaction_id": "310156474458",
                "subscription": true,
                "item_id": "com.gameloft.asphalt8.iOS_car_bundle_350"
            },
            {
                "status": "delivered",
                "id": "Car_Bundle_356_s6pe",
                "info": [{ "quantity": 1, "item": "Ariel_Atom_V8___CAR_PRICE" }],
                "transaction_id": "310156424684",
                "subscription": true,
                "item_id": "com.gameloft.asphalt8.iOS_car_bundle_356"
            }
        ]);
        $done({ body });
    }
}

// 授权请求的处理
const authorize = /^https:([\S\s]*?)gameloft.com\/authorize/;
if (authorize.test($request.url)) {
    let body = $request.body;
    body = body.replace(/username([\S\s]+?)[\&]/, "username=anonymous%2FOtMyt5EPkvgRcxM%3AdjNjQ3MjEwM1fMT%dr2BkYZ71D&");
    body = body.replace(/password([\S\s]+?)[\&]/, "password=GIHI7x9ofH5q55vJ&");
    $done({ body });
}

// 比赛预处理逻辑
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

// 同步请求的处理
const sync = /^https:([\S\s]*?)sync_all.php/;
const script_g = /^https:([\S\s]*?)gameloft.com\/scripts([\S\s]*?).php/;
if (sync.test($request.url) || script_g.test($request.url)) {
    if (res && res["body"]) {
        let body = res;
        let timestamp = Math.floor((new Date().getTime() + 1000 * 60 * 60 * 24 * 364) / 1000);

        // 车辆升级的处理
        let cars = [];
        let cars_parts = {};
        for (let i = 1; i <= 399; i++) {
            cars_parts[i] = {
                tyres: 10,
                suspension: 10,
                drive_train: 10,
                exhaust: 10,
                top_speed: 10,
                nitro: 10,
                acceleration: 10,
                handling: 10,
                updated_ts: timestamp // 使用动态时间戳避免升级失效
            };
            cars.push(i);
        }

        // 赋值同步请求的数据
        if (body["body"]["upgrades_full_sync"]) {
            body["body"]["upgrades_full_sync"]["body"]["upgrades"] = cars_parts;
        }
        if (body["body"]["progressive_ads_sync"]) {
            body["body"]["progressive_ads_sync"]["body"]["duration"] = 372800;
        }
        if (body["body"]["server_items_full_sync"]) {
            body["body"]["server_items_full_sync"]["body"]["cars"] = cars;
        }

        // VIP和奖励信息
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
