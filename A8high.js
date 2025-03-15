/*************************************
项目名称：**********
author：GPT_me
**************************************
[rewrite_local]
^https:([\S\s]*?)gameloft.com/configs/users/me url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8high.js
// ^https:([\S\s]*?)unityads.unity3d.com/([\S\s]*?)/config.json url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8high.js

^https:([\S\s]*?)gameloft.com/scripts url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8high.js
^https:([\S\s]*?)gameloft.com/profiles/me/myprofile url script-response-body https://raw.githubusercontent.com/JaraxW/AS8/main/A8high.js

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
    null);


// gameloft.com/configs/users/me
const me = /gameloft.com\/configs\/users\/me/;

if (me.test($request.url) ) {
	
	// 是否车辆升级广告 VehicleUpgradeAds vehicles[1,2,386.....]
	let cars = []
	let qu = [40, 43, 141, 208, 380, 381, 331];
	let qu2 = [];

	for (let i = 1; i <= 406; i++) {
		if (qu.includes(i) || qu2.includes(i)) {
			continue;
		}
		cars.push(i)
	}
	body["game"]["parameters"]["VehicleUpgradeAds"]["vehicles"] = cars
	
	// 离线商店 取消隐藏
	for (let item of body["offline_store"]["prices"]) {
	  item["hidden"] = false
	}
	// 在线商店 修改价格
	for (let item of body["iap"]["prices"]) {
	  item["hidden"] = false
	  for ( let item_inner of item["billing_methods"] ) {
		item_inner["price"] = 0.01
	  }  
	}
	obj.body = JSON.stringify(body)
	$done(obj);	
}


const myprofile = /gameloft.com\/profiles\/me\/myprofile/;

if (myprofile.test($request.url)) {
    if ($response && $response.body) {
        let body = JSON.parse($response.body);
        // 删除违规同步
        if (body["_infractions"]) {
            delete body["_infractions"];
        }
        if (body["_adjoe_reward"]) {
            body["_adjoe_reward"]["data"] = "";
        }
        if (body["_ad_rewards"]) {
            body["_ad_rewards"]["data"] = "";
        }
        if (body["_ads_progressive"]) {
            body["_ads_progressive"] = {};
        }
        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);
        $done(obj);
    } else {
        // 如果没有响应也需要结束处理
        $done({});
    }
}


const authorize = /^https:([\S\s]*?)gameloft.com\/authorize/;

if (authorize.test($request.url)) {
	
    let regex = /username([\S\s]+?)[\&]/;
    let body = $request.body.replace(regex, "username=anonymous%2FOtMyt5EPkvgRcxM%3AdjNjQ3MjEwM1fMT%dr2BkYZ71D&");
    // console.log("改完222 = " + body)
    regex = /password([\S\s]+?)[\&]/;
    body = body.replace(regex, "password=GIHI7x9ofH5q55vJ&");
    // console.log("改完 = " + body)
    $done({body});
}


// sync start
let pre_tle_race = /^https:([\S\s]*?)energy\/pre_tle_race.php/;
//let post_event_score = /^https:([\S\s]*?)tle\/post_event_score.php/;
let tle = /^https:([\S\s]*?)scripts\/tle([\S\s]*?).php/;
if (pre_tle_race.test($request.url) || tle.test($request.url)) {

    if ($response && $response.body) {
        let body = JSON.parse($response.body);

        // 30天后时间戳
        let timestamp = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30));

        // 删除违规同步 infractions_sync
        if (body?.["body"]?.["infractions_sync"]?.["body"]) {
            body["body"]["infractions_sync"]["body"]["infractions"] = "";
        }

        // 修改增益
        if (body?.["body"]?.["boosters_sync"]?.["body"]) {
            body["body"]["boosters_sync"]["body"]["active"] = {
                "extra_tank": { "min": timestamp },
                "performance": { "min": timestamp },
                "nitro": { "min": timestamp }
                // "credits": { "min": timestamp }
            };
        }

        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);

        $done(obj);
    }
}

//let find_room = /^https:([\S\s]*?)mp\/find_room.php/;
let muilt_play = /^https:([\S\s]*?)gameloft.com\/scripts\/mp/;
let claim = /^https:([\S\s]*?)claim.php/;
if (muilt_play.test($request.url) || claim.test($request.url)) {

    if ($response && $response.body) {
        let body = JSON.parse($response.body);

        // 30天后时间戳
        let timestamp = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30));

        // 删除违规同步 infractions_sync
        if (body?.["body"]?.["infractions_sync"]?.["body"]) {
            body["body"]["infractions_sync"]["body"]["infractions"] = "";
        }

        // 修改增益
        if (body?.["body"]?.["boosters_sync"]?.["body"]) {
            body["body"]["boosters_sync"]["body"]["active"] = {
                "extra_tank": { "min": timestamp },
                "performance": { "min": timestamp },
                "nitro": { "min": timestamp }
                // "credits": { "min": timestamp }
            };
        }

        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);

        $done(obj);
    }
}

//let start_race = /^https:([\S\s]*?)gauntlet_mode\/start_race.php/;
//let end_race = /^https:([\S\s]*?)gauntlet_mode\/end_race.php/;
let guantlet = /^https:([\S\s]*?)gauntlet_mode/;
if (guantlet.test($request.url)) {

    if ($response && $response.body) {
        let body = JSON.parse($response.body);

        // 30天后时间戳
        let timestamp = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30));

        // 删除违规同步 infractions_sync
        if (body?.["body"]?.["infractions_sync"]?.["body"]) {
            body["body"]["infractions_sync"]["body"]["infractions"] = "";
        }

        // 修改增益
        if (body?.["body"]?.["boosters_sync"]?.["body"]) {
            body["body"]["boosters_sync"]["body"]["active"] = {
                "extra_tank": { "min": timestamp },
                "performance": { "min": timestamp },
               "nitro": { "min": timestamp }
                // "credits": { "min": timestamp }
            };
        }

        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);

        $done(obj);
    }
}

let festival = /^https:([\S\s]*?)gameloft.com\/scripts\/festival_event/;
let season_pass = /^https:([\S\s]*?)gameloft.com\/scripts\/season_pass/;
let lucky_strike = /^https:([\S\s]*?)gameloft.com\/scripts\/lucky_strike/;
if (festival.test($request.url) || season_pass.test($request.url) || lucky_strike.test($request.url)) {

    if ($response && $response.body) {
        let body = JSON.parse($response.body);

        // 30天后时间戳
        let timestamp = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30));

        // 删除违规同步 infractions_sync
        if (body?.["body"]?.["infractions_sync"]?.["body"]) {
            body["body"]["infractions_sync"]["body"]["infractions"] = "";
        }

        // 修改增益
        if (body?.["body"]?.["boosters_sync"]?.["body"]) {
            body["body"]["boosters_sync"]["body"]["active"] = {
                "extra_tank": { "min": timestamp },
                "performance": { "min": timestamp },
                "nitro": { "min": timestamp }
                // "credits": { "min": timestamp }
            };
        }

        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);

        $done(obj);
    }
}

let treasure = /^https:([\S\s]*?)gameloft.com\/scripts\/treasure_hunt/;
let buy_item = /^https:([\S\s]*?)general\/buy_item.php/;
if (treasure.test($request.url) || buy_item.test($request.url)) {

    if ($response && $response.body) {
        let body = JSON.parse($response.body);

        // 30天后时间戳
        let timestamp = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30));

        // 删除违规同步 infractions_sync
        if (body?.["body"]?.["infractions_sync"]?.["body"]) {
            body["body"]["infractions_sync"]["body"]["infractions"] = "";
        }

        // 修改增益
        if (body?.["body"]?.["boosters_sync"]?.["body"]) {
            body["body"]["boosters_sync"]["body"]["active"] = {
                "extra_tank": { "min": timestamp },
                "performance": { "min": timestamp },
                "nitro": { "min": timestamp }
                // "credits": { "min": timestamp }
            };
        }

        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);

        $done(obj);
    }
}

let storage = /^https:([\S\s]*?)gameloft.com\/scripts\/storage/;
if (storage.test($request.url)) {

    if ($response && $response.body) {
        let body = JSON.parse($response.body);

        // 30天后时间戳
        let timestamp = Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 30));

        // 删除违规同步 infractions_sync
        if (body?.["body"]?.["infractions_sync"]?.["body"]) {
            body["body"]["infractions_sync"]["body"]["infractions"] = "";
        }

        // 修改增益
        if (body?.["body"]?.["boosters_sync"]?.["body"]) {
            body["body"]["boosters_sync"]["body"]["active"] = {
                "extra_tank": { "min": timestamp },
                "performance": { "min": timestamp },
		"nitro": { "min": timestamp }
                // "credits": { "min": timestamp }
            };
        }

        // 初始化 obj 并设置 body
        let obj = {};
        obj.body = JSON.stringify(body);

        $done(obj);
    }
}

console.log("改: ")
	console.log($request.url)

// sync start  gameloft.com/scripts

const sync = /^https:([\S\s]*?)sync_all.php/;

if (sync.test($request.url) ) {
   
    if ($response === undefined) {

    } else if ($response && $response.body) {
    	let body = JSON.parse($response.body);
	    
        // 30天后时间戳
        let timestamp = new Date().getTime();
        timestamp = Math.floor((timestamp + (1000 * 60 * 60 * 24 * 30)) / 1000)

        // 添加所有改装为最大 prokits_car_parts_full_sync body cars_parts
        let cars = []
        let cars_parts = {}
        cars_parts["171"] = {
            "tyres": 10,
            "suspension": 10,
            "drive train": 10,
            "exhaust": 10,
            "top_speed": 10,
            "nitro": 10,
            "acceleration": 10,
            "handling": 10,
            "updated_ts": 1712265302
        }

        let moto_ids = [
            // todo 
        ]
        let qu = [40, 43, 141, 208, 380, 331];
        // 320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339
        let qu2 = [];

        for (let i = 1; i <= 406; i++) {
            if (qu.includes(i) || qu2.includes(i)) {
                continue;
            }

            // let ge = i%10 || 10;
            // let shi = Math.floor( (i / 10) % 10 ) || 10;
            // let bai = Math.floor( (i / 100) % 10 ) || 10;
            let ge = 10
            let shi = 10
            let bai = 10

            cars_parts[i + ""] = {
                "tyres": bai,
                "suspension": shi,
                "drive train": ge,
                "exhaust": 10,
                "acceleration": bai,
                "top_speed": shi,
                "handling": ge,
                "nitro": 10,
                "updated_ts": 1712265302
            }
            cars.push(i)
        }
        
		if ( sync.test($request.url) || undefined != body["body"]["upgrades_full_sync"] ) {
			body["body"]["upgrades_full_sync"]["body"]["upgrades"] = cars_parts
		}
        
		// 疑似广告
		if ( sync.test($request.url) || undefined != body["body"]["progressive_ads_sync"] ) {
			body["body"]["progressive_ads_sync"]["body"]["duration"] = 372800
		}

    // 赋值车辆
		if ( sync.test($request.url) || undefined != body["body"]["server_items_full_sync"] ) {
			body["body"]["server_items_full_sync"]["body"]["cars"] = cars
		}

		body["body"]["prokits_car_parts_full_sync"] = {
				"body": {
					"cars_parts": cars_parts,
					"up_to_date": false,
					"sync_key": "1712288961"
				}
			}
		
		// 删除违规同步 infractions_sync
		if ( sync.test($request.url) || undefined != body["body"]["infractions_sync"] ) {
			body["body"]["infractions_sync"]["body"]["infractions"] = ""
		}
		

        // 修改增益
		if ( sync.test($request.url) || undefined != body["body"]["boosters_sync"] ) {
			body["body"]["boosters_sync"]["body"]["active"] = {
				"extra_tank": {
					"min": timestamp
				},
				"performance": {
					"min": timestamp
				},
				"nitro": {
					"min": timestamp
				}
			}
		}
			
        // 修改广告
      // if (body?.["body"]) {
         // 确保 body["body"] 存在
      //  body["body"]["adjoe_sync"] = {
    //    "body": {}
   //	 };
//
  	// 仅当 infractions_sync 存在时才执行
   //	 if (body["body"]["infractions_sync"]?.["body"]) {
//	        body["body"]["vip_full_sync"] = body["body"]["vip_full_sync"] || { "body": {} }; // 确保结构存在
 //	       body["body"]["vip_full_sync"]["body"]["level"] = 15;
	//    }
	//	}
        
    	console.log("修改A8成功!!!")
        obj.body = JSON.stringify(body)
    }
    $done(obj);

}
// ############### sync end 
