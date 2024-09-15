/*************************************
项目名称：**********
author：GPT
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

const modifyAds = (body) => {
    for (let ad_item of body["SRR"]["placements"]) {
        Object.assign(ad_item, {
            "allowSkip": true,
            "closeTimerDuration": 1,
            "skipInSeconds": 1,
            "adFormat": "interstitial",
            "disableBackButton": false,
            "optOutEnabled": true,
            "isSkipToAppSheetEnabled": false,
            "assetCaching": "voluntary",
            "enabled": false
        });
        ad_item["banner"]["refreshRate"] = 5;
    }
    body["msr"] = 1;
    body["sto"] = 1000;
    body["expo"]["sto"]["value"] = 1000;
    return body;
};

const modifyUserConfig = (body) => {
    body["game"]["parameters"]["init"]["onboardingGift"] = {};
    body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
    body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
        "MinimumReward": 30000,
        "creditsForAdsCap": 37500
    };

    let cars = [];
    for (let i = 1; i <= 399; i++) {
        if (![40, 43, 141, 208, 380, 381, 331].includes(i)) cars.push(i);
    }
    body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

    // 解锁内购和价格设置
    body["offline_store"]["prices"].forEach(item => {
        item["hidden"] = false;  // 确保每个项目可见
    });

    body["iap"]["prices"].forEach(item => {
        item["hidden"] = false;  // 确保内购项不被隐藏
        if (item["billing_methods"]) {
            item["billing_methods"].forEach(method => {
                method["price"] = 0.01;  // 设置价格为0.01
            });
        }
    });

    return body;
};

const modifyUserConfig = (body) => {
    body["game"]["parameters"]["init"]["onboardingGift"] = {};
    body["game"]["parameters"]["InventoryAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["ingameAds"]["slotsLeftForNotify"] = {};
    body["game"]["parameters"]["FusionPointPacks"]["enabled"] = true;
    body["game"]["parameters"]["MultiCreditsAdsRewards"] = {
        "MinimumReward": 30000,
        "creditsForAdsCap": 37500
    };
    
    let cars = [];
    for (let i = 1; i <= 399; i++) {
        if (![40, 43, 141, 208, 380, 381, 331].includes(i)) cars.push(i);
    }
    body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars;

    body["offline_store"]["prices"].forEach(item => item["hidden"] = false);
    body["iap"]["prices"].forEach(item => {
        item["hidden"] = false;
        item["billing_methods"].forEach(method => method["price"] = 0.01);
    });

    return body;
};

const modifyProfile = (body) => {
    delete body["_infractions"];
    if (body["_adjoe_reward"]) {
        body["_adjoe_reward"]["data"] = "";
        body["_ad_rewards"]["data"] = "";
        body["_ads_progressive"] = {};
        body["_Vip"] = {
            "level": 15,
            "initial_points": 155
        };
    }
    return body;
};

const modifySync = (body) => {
    let timestamp = Math.floor((new Date().getTime() + 1000 * 60 * 60 * 24 * 364) / 1000);
    body["body"]["boosters_sync"]["body"]["active"] = {
        "extra_tank": { "min": timestamp },
        "performance": { "min": timestamp },
        "nitro": { "min": timestamp },
        "credits": { "min": timestamp }
    };
    
    body["body"]["prokits_car_parts_full_sync"] = {
        "body": {
            "cars_parts": generateCarsParts(),
            "up_to_date": false,
            "sync_key": "1712288961"
        }
    };
    body["body"]["infractions_sync"]["body"]["infractions"] = "";
    body["body"]["vip_full_sync"]["body"]["level"] = 15;

    return body;
};

const generateCarsParts = () => {
    let cars_parts = {};
    for (let i = 1; i <= 399; i++) {
        if (![40, 43, 141, 208, 380, 381, 331].includes(i)) {
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
        }
    }
    return cars_parts;
};

// Main Handler
const handleRequest = (url, body) => {
    if (/config.json/.test(url)) {
        return modifyAds(body);
    } else if (/gameloft.com\/configs\/users\/me/.test(url)) {
        return modifyUserConfig(body);
    } else if (/gameloft.com\/profiles\/me\/myprofile/.test(url)) {
        return modifyProfile(body);
    } else if (/pre_tle_race.php|sync_all.php/.test(url)) {
        return modifySync(body);
    }
    return body;
};

// Main Execution
if (res) {
    obj.body = JSON.stringify(handleRequest($request.url, res));
    $done(obj);
}
