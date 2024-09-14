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

// 解锁内购和车辆逻辑
const me = /gameloft.com\/configs\/users\/me/;
if (me.test($request.url)) {
    let body = res;

    // 解锁内购
    body["game"]["parameters"]["init"]["onboardingGift"] = {};
    body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
    body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
        "MinimumReward": 30000,
        "creditsForAdsCap": 37500
    };
    body["game"]["parameters"]["ingameAds"] = {};

    // 解锁所有车辆
    let cars = [];
    let excludeCars = [40, 43, 141, 208, 380, 381, 331];
    for (let i = 1; i <= 399; i++) {
        if (!excludeCars.includes(i)) {
            cars.push(i);
        }
    }
    body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

    // 取消隐藏离线商店和在线商店价格
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

// 车辆升级逻辑
const sync = /^https:([\S\s]*?)sync_all.php/;
if (sync.test($request.url)) {
    if (res && res["body"]) {
        let body = res;

        // 删除违规同步信息
        body["body"]["infractions_sync"]["body"]["infractions"] = "";

        // 设置车辆升级属性
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
                updated_ts: Math.floor(new Date().getTime() / 1000)
            };
        }
        body["body"]["prokits_car_parts_full_sync"] = {
            "body": {
                "cars_parts": cars_parts,
                "up_to_date": false,
                "sync_key": "1712288961"
            }
        };

        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

// 其他处理
const adnw = /facebook.com\/adnw_sync2/;
if (adnw.test($request.url)) {
    let body = res;
    body["refresh"]["target_refresh_s"] = 10;
    body["bundles"]["feature_config"]["data"]["feature_config"]["adnw_android_network_default_connection_timeout_ms"] = 100;
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

// 恢复购买逻辑
const restore = /inapp_crm\/index.php/;
if (restore.test($request.url)) {
    if (!/action/.test($request.url)) {
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
    $done({res});
}

// 授权逻辑
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
    if (res && res["body"]) {
        let body = res;
        let timestamp = Math.floor((new Date().getTime() + (1000 * 60 * 60 * 24 * 364)) / 1000);

        body["body"]["infractions_sync"]["body"]["infractions"] = "";
        body["body"]["boosters_sync"]["body"]["active"] = {
            "extra_tank": { "min": timestamp },
            "performance": { "min": timestamp },
            "nitro": { "min": timestamp },
            "credits": { "min": timestamp }
        };

        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

// sync end
const script_g = /^https:([\S\s]*?)gameloft.com\/scripts([\S\s]*?).php/;
const sync = /^https:([\S\s]*?)sync_all.php/;
if (sync.test($request.url) || script_g.test($request.url)) {
    if (res && res["body"]) {
        let body = res;

        // 删除违规信息
        body["body"]["infractions_sync"]["body"]["infractions"] = "";

        // 车辆升级
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
                updated_ts: Math.floor(new Date().getTime() / 1000)
            };
        }
        body["body"]["prokits_car_parts_full_sync"] = {
            "body": {
                "cars_parts": cars_parts,
                "up_to_date": false,
                "sync_key": "1712288961"
            }
        };

        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

