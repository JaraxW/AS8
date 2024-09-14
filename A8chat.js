/*************************************

Asphalt 8 无限氮气脚本

**************************************
[rewrite_local]
^https:\/\/.*?\/energy\/pre_tle_race.php url script-response-body nitro_infinite.js

[mitm]
hostname = *.gameloft.com

*************************************/

let obj = JSON.parse($response.body);

// 修改 Nitro 相关参数
if (obj && obj.race) {
    obj.race.nitro = 999999;                 // 无限 Nitro 值
    obj.race.nitro_consumption_rate = 0;      // Nitro 不消耗
    obj.race.nitro_max = 999999;              // 最大 Nitro 值
    obj.race.nitro_current = 999999;          // 当前 Nitro 值
}

$done({body: JSON.stringify(obj)});
