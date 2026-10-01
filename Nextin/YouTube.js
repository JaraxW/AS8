#!name=YouTube - Nextin Fast Fixed
#!desc=修正 initplayback 与 log_event 请求脚本地址；response 使用现有 Fast 版本

[MITM]
hostname = *.googlevideo.com, youtubei.googleapis.com

[Script]

# Response：Fast protobuf response 脚本
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/JaraxW/AS8/main/Nextin/YouTube.Nextin.Fast.js

# Request：必须使用 request 脚本；原作者版本包含 UMP Worker 转发逻辑
YT-InitPlayback = type=http-request, pattern=^https?://[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js

YT-LogEvent = type=http-request, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/log_event, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js
