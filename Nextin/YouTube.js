#!name=YouTube - Nextin V3
#!desc=YouTube 去广告/后台播放/PiP｜Nextin 精简稳定版

[MITM]
hostname = *.googlevideo.com, youtubei.googleapis.com

[Script]

# YouTube API 响应处理
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js, argument="{\"captionLang\":\"off\",\"blockUpload\":true,\"blockImmersive\":true,\"blockShorts\":false,\"debug\":false}"

# 播放链路处理
YT-InitPlayback = type=http-request, pattern=^https?://[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js, argument="{\"captionLang\":\"off\"}"
