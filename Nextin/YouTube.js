#!name=YouTube AdBlock - Nextin Lite
#!desc=Nextin 专用｜优先速度与稳定性

[MITM]
hostname = *.googlevideo.com, youtubei.googleapis.com

[Script]

YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js

YT-InitPlayback = type=http-request, pattern=^https?://[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js
