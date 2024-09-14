/*************************************
项目名称：**********
author：xdz1
**************************************/
let obj = {};
let res = JSON.parse(typeof $response !== "undefined" ? $response.body : null);

// 常量定义
const U3D_AD_URL_PATTERN = /config.json/;
const ADNW_URL_PATTERN = /facebook.com\/adnw_sync2/;
const ME_URL_PATTERN = /gameloft.com\/configs\/users\/me/;
const MYPROFILE_URL_PATTERN = /gameloft.com\/profiles\/me\/myprofile/;
const RESTORE_URL_PATTERN = /inapp_crm\/index.php/;
const AUTHORIZE_URL_PATTERN = /^https:([\S\s]*?)gameloft.com\/authorize/;
const PRE_TLE_RACE_URL_PATTERN = /^https:([\S\s]*?)energy\/pre_tle_race.php/;
const SCRIPT_G_URL_PATTERN = /^https:([\S\s]*?)gameloft.com\/scripts([\S\s]*?).php/;
const SYNC_URL_PATTERN = /^https:([\S\s]*?)sync_all.php/;

// 处理 U3D 广告请求
function handleU3DAdRequest() {
    if (U3D_AD_URL_PATTERN.test($request.url)) {
        let body = res;
        if (body["SRR"]) {
            for (let adItem of body["SRR"]["placements"]) {
                adItem["allowSkip"] = true;
                adItem["closeTimerDuration"] = 1;
                adItem["skipInSeconds"] = 1;
                adItem["adFormat"] = "interstitial";
                adItem["disableBackButton"] = false;
                adItem["optOutEnabled"] = true;
                adItem["experimentation"]["admobMednLoadTimeoutInSec"] = "1";
                adItem["isSkipToAppSheetEnabled"] = false;
                adItem["assetCaching"] = "voluntary";
                adItem["banner"]["refreshRate"] = 5;
                adItem["enabled"] = false;
            }
            body["SRR"]["msr"] = 1;
            body["SRR"]["sto"] = 1000;
            body["SRR"]["expo"]["sto"]["value"] = 1000;
        }
        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

// 处理 Facebook 广告请求
function handleAdnwRequest() {
    if (ADNW_URL_PATTERN.test($request.url)) {
        let body = res;
        body["refresh"]["target_refresh_s"] = 10;
        body["bundles"]["feature_config"]["data"]["feature_config"]["adnw_android_network_default_connection_timeout_ms"] = 100;
        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

// 处理用户配置请求
function handleMeRequest() {
    if (ME_URL_PATTERN.test($request.url)) {
        let body = res;
        // 清理广告和商店配置
        body["game"]["parameters"]["init"]["onboardingGift"] = {};
        body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
        body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
        body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
        body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
            "MinimumReward": 30000,
            "creditsForAdsCap": 37500
        };
        body["game"]["parameters"]["ingameAds"] = {};
        
        // 更新车辆升级广告
        let cars = [];
        let excludedCars = [40, 43, 141, 208, 380, 381, 331];
        for (let i = 1; i <= 399; i++) {
            if (!excludedCars.includes(i)) {
                cars.push(i);
            }
        }
        body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

        // 更新商店配置
        for (let item of body["offline_store"]["prices"]) {
            item["hidden"] = false;
        }
        for (let item of body["iap"]["prices"]) {
            item["hidden"] = false;
            for (let method of item["billing_methods"]) {
                method["price"] = 0.01;
            }
        }

        obj.body = JSON.stringify(body);
        $done(obj);
    }
}

// 处理用户个人资料请求
function handleMyProfileRequest() {
    if (MYPROFILE_URL_PATTERN.test($request.url)) {
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
}

// 处理恢复购买请求
function handleRestoreRequest() {
    if (RESTORE_URL_PATTERN.test($request.url)) {
        console.log("恢复购买?");
        if (!/action/.test($request.url)) {
            console.log("恢复购买!");
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
            $done({ body });
        }
        $done({ res });
    }
}

// 处理授权请求
function handleAuthorizeRequest() {
    if (AUTHORIZE_URL_PATTERN.test($request.url)) {
        let body = $request.body
            .replace(/username([\S\s]+?)[\&]/, "username=anonymous%2FOtMyt5EPkvgRcxM%3AdjNjQ3MjEwM1fMT%dr2BkYZ71D&")
            .replace(/password([\S\s]+?)[\&]/, "password=GIHI7x9ofH5q55vJ&");
        $done({ body });
    }
}

// 处理 pre_tle_race 请求
function handlePreTleRaceRequest() {
    if (PRE_TLE_RACE_URL_PATTERN.test($request.url)) {
        if ($response !== undefined) {
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
        }
        $done(obj);
    }
}

// 处理脚本请求
function handleScriptRequest() {
    if (SCRIPT_G_URL_PATTERN.test($request.url) || SYNC_URL_PATTERN.test($request.url)) {
        if ($response !== undefined) {
            let body = res;
            let timestamp = Math.floor((new Date().getTime() + (1000 * 60 * 60 * 24 * 364)) / 1000);
            let cars = [];
            let carsParts = { "171": { "tyres": 10, "suspension": 10, "drive train": 10, "exhaust": 10, "top_speed": 10, "nitro": 10, "acceleration": 10, "handling": 10, "updated_ts": 1712265302 } };
            let excludedCars = [40, 43, 141, 208, 380, 381, 331];

            for (let i = 1; i <= 399; i++) {
                if (!excludedCars.includes(i)) {
                    carsParts[i + ""] = { "tyres": 10, "suspension": 10, "drive train": 10, "exhaust": 10, "acceleration": 10, "top_speed": 10, "handling": 10, "nitro": 10, "updated_ts": 1712265302 };
                    cars.push(i);
                }
            }

            //
