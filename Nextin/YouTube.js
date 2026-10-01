#!name=YouTube - Nextin Fast V4
#!desc=Nextin专用

[MITM]
hostname = *.googlevideo.com, youtubei.googleapis.com

[Script]

# YouTube Response
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js

# 新版 Onesie/UMP 播放链
YT-InitPlayback = type=http-request, pattern=^https?://[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js

# 新版播放状态/密钥链
YT-LogEvent = type=http-request, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/log_event, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js
