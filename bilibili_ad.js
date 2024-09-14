const url = $request.url;
const method = $request.method;
const notifyTitle = "bilibili-json";
const responseBody = $response.body || '';  // 缓存response body

console.log(`b站json-2023.10.22`);

if (!responseBody) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
    return;
}

if (method !== "GET") {
    $notification.post(notifyTitle, "method错误:", method);
}

let body;

try {
    body = JSON.parse(responseBody);
} catch (error) {
    console.log(`JSON解析错误: ${error}`);
    $done({});
    return;
}

if (!body.data) {
    console.log(url);
    console.log(`body:${responseBody}`);
    $notification.post(notifyTitle, url, "data字段错误");
} else {
    if (url.includes("x/v2/splash")) {
        console.log('开屏页' + (url.includes("splash/show") ? 'show' : 'list'));
        if (body.data.show) {
            delete body.data.show;
            console.log('成功删除show字段');
        } else {
            console.log('数据无show字段');
        }
    } else if (url.includes("resource/show/tab/v2")) {
        console.log('tab修改');
        // 顶部右上角
        if (body.data.top) {
            body.data.top = body.data.top.filter(item => {
                if (item.name === '游戏中心') {
                    console.log('去除右上角游戏中心');
                    return false;
                }
                return true;
            });
            fixPos(body.data.top);
        } else {
            console.log(`body:${responseBody}`);
            $notification.post(notifyTitle, 'tab', "top字段错误");
        }

        // 底部tab栏
        if (body.data.bottom) {
            body.data.bottom = body.data.bottom.filter(item => {
                if (['发布', '会员购'].includes(item.name) || item.tab_id === '会员购Bottom') {
                    console.log(`去除${item.name}`);
                    return false;
                }
                return true;
            });
            fixPos(body.data.bottom);
        } else {
            console.log(`body:${responseBody}`);
            $notification.post(notifyTitle, 'tab', "bottom字段错误");
        }
    } else if (url.includes("x/v2/feed/index")) {
        console.log('推荐页');
        if (body.data.items?.length) {
            body.data.items = body.data.items.filter(i => {
                const { card_type: cardType, card_goto: cardGoto } = i;

                if (!cardType || !cardGoto) {
                    console.log(`body:${responseBody}`);
                    $notification.post(notifyTitle, '推荐页', "无card_type/card_goto");
                    return true;
                }

                if (cardType === 'banner_v8' && cardGoto === 'banner') {
                    if (i.banner_item) {
                        i.banner_item = i.banner_item.filter(v => {
                            if (v.type === 'ad') {
                                console.log('banner广告去除');
                                return false;
                            }
                            return true;
                        });
                    } else {
                        console.log(`body:${responseBody}`);
                        $notification.post(notifyTitle, '推荐页', "banner_item错误");
                    }
                } else if (cardType === 'cm_v2' && ['ad_web_s', 'ad_av', 'ad_web_gif', 'ad_player', 'ad_inline_3d', 'ad_inline_eggs'].includes(cardGoto)) {
                    console.log(`${cardGoto}广告去除`);
                    return false;
                } else if (cardType === 'small_cover_v10' && cardGoto === 'game') {
                    console.log('游戏广告去除');
                    return false;
                } else if (cardType === 'cm_double_v9' && cardGoto === 'ad_inline_av') {
                    console.log('创作推广-大视频广告去除');
                    return false;
                }
                return true;
            });
        } else {
            console.log(`body:${responseBody}`);
            $notification.post(notifyTitle, '推荐页', "items字段错误");
        }
    } else {
        $notification.post(notifyTitle, "路径匹配错误:", url);
    }
}

body = JSON.stringify(body);
$done({ body });

function fixPos(arr) {
    arr.forEach((item, index) => {
        item.pos = index + 1;
    });
}
