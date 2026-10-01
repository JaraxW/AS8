#!name=YouTube - Nextin Fast
#!desc=Nextin专用

[MITM]
hostname = *.googlevideo.com, youtubei.googleapis.com

[Script]

# 核心 Response
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/JaraxW/AS8/main/Nextin/YouTube.Nextin.Fast.js
# Onesie / UMP 播放链
YT-InitPlayback = type=http-request, pattern=^https?://[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/JaraxW/AS8/main/Nextin/YouTube.Nextin.Fast.js

# 播放状态/广告链——保留，避免冷启动第一个视频出现贴片广告
YT-LogEvent = type=http-request, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/log_event, requires-body=true, binary-body-mode=true, max-size=-1, timeout=10, script-path=https://raw.githubusercontent.com/JaraxW/AS8/main/Nextin/YouTube.Nextin.Fast.js
