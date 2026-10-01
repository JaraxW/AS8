#!name=YouTube Enhance - Nextin Lite
#!desc=YouTube 去广告/后台播放/PiP｜Nextin 精简优化版

[MITM]
hostname = *.googlevideo.com, youtubei.googleapis.com

[Script]

# 首页/推荐/播放/搜索/Shorts 等响应净化
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js, argument="{\"captionLang\":\"off\",\"blockUpload\":true,\"blockImmersive\":true,\"blockShorts\":false,\"debug\":false}"

# 新版 YouTube 播放链路
YT-InitPlayback = type=http-request, pattern=^https?://[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js, argument="{\"captionLang\":\"off\"}"

# 新版播放/广告事件
YT-LogEvent = type=http-request, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/log_event, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js
