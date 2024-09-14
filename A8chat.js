// 处理 pre_tle_race 请求
function handlePreTleRaceRequest() {
    if (PRE_TLE_RACE_URL_PATTERN.test($request.url)) {
        if ($response !== undefined) {
            let body = res;
            // 设置为无限
            let timestamp = Number.MAX_SAFE_INTEGER;
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
            // 设置为无限
            let timestamp = Number.MAX_SAFE_INTEGER;
            let cars = [];
            let carsParts = { "171": { "tyres": 10, "suspension": 10, "drive train": 10, "exhaust": 10, "top_speed": 10, "nitro": 10, "acceleration": 10, "handling": 10, "updated_ts": 1712265302 } };
            let excludedCars = [40, 43, 141, 208, 380, 381, 331];

            for (let i = 1; i <= 399; i++) {
                if (!excludedCars.includes(i)) {
                    carsParts[i + ""] = { "tyres": 10, "suspension": 10, "drive train": 10, "exhaust": 10, "acceleration": 10, "top_speed": 10, "handling": 10, "nitro": 10, "updated_ts": 1712265302 };
                    cars.push(i);
                }
            }

            if (SCRIPT_G_URL_PATTERN.test($request.url) || body["body"]["upgrades_full_sync"]) {
                body["body"]["upgrades_full_sync"]["body"]["upgrades"] = carsParts;
            }
            
            if (SCRIPT_G_URL_PATTERN.test($request.url) || body["body"]["progressive_ads_sync"]) {
                body["body"]["progressive_ads_sync"]["body"]["duration"] = 372800;
            }

            if (SCRIPT_G_URL_PATTERN.test($request.url) || body["body"]["server_items_full_sync"]) {
                body["body"]["server_items_full_sync"]["body"]["cars"] = cars;
            }
            
            body["body"]["prokits_car_parts_full_sync"] = {
                "body": {
                    "cars_parts": carsParts,
                    "up_to_date": false,
                    "sync_key": "1712288961"
                }
            };

            if (SCRIPT_G_URL_PATTERN.test($request.url) || body["body"]["infractions_sync"]) {
                body["body"]["infractions_sync"]["body"]["infractions"] = "";
            }

            if (SCRIPT_G_URL_PATTERN.test($request.url) || body["body"]["boosters_sync"]) {
                body["body"]["boosters_sync"]["body"]["active"] = {
                    "extra_tank": { "min": timestamp },
                    "performance": { "min": timestamp },
                    "nitro": { "min": timestamp },
                    "credits": { "min": timestamp }
                };
            }

            body["body"]["adjoe_sync"] = {
                "body": {
                    // 其他广告设置
                }
            };
            body["body"]["vip_full_sync"]["body"]["level"] = 15;

            console.log("修改A8成功!!!");
            obj.body = JSON.stringify(body);
        }
        $done(obj);
    }
}
