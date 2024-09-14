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

// 车辆升级逻辑
const sync = /^https:([\S\s]*?)sync_all.php/;
if (sync.test($request.url)) {
    if (res && res["body"]) {
        let body = res;

        // 删除违规信息
        body["body"]["infractions_sync"]["body"]["infractions"] = "";

        // 车辆升级逻辑
        if (body["body"]["upgrades_full_sync"]) {
            let upgrades = body["body"]["upgrades_full_sync"]["body"]["upgrades"];
            for (let i = 1; i <= 399; i++) {
                upgrades[i] = {
                    tyres: 10,
                    suspension: 10,
                    drive_train: 10,
                    exhaust: 10,
                    top_speed: 10,
                    nitro: 10,
                    acceleration: 10,
                    handling: 10
                };
            }
        }

        obj.body = JSON.stringify(body);
        $done(obj);
    }
}
