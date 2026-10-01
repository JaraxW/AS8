#!name=YouTube Enhance - Nextin V2
#!desc=YouTube 去广告/增强｜Nextin 专用静态配置｜基于 Maasea 当前脚本

[MITM]
hostname = *.googlevideo.com, www.youtube.com, s.youtube.com, youtubei.googleapis.com

[URL Rewrite]
# GoogleVideo 广告参数
(^https?://(?!redirector)[\w-]+\.googlevideo\.com/(?!dclk_video_ads).+?)&ctier=L(&.+?),ctier,(.+) url 302 $1$2$3

# GoogleVideo 广告媒体请求
^https?://(?!redirector)[\w-]+\.googlevideo\.com/(?!(dclk_video_ads|videoplayback\?)).+&oad url reject-200

# YouTube 广告统计/追踪
^https?://(www|s)\.youtube\.com/api/stats/ads url reject-200
^https?://(www|s)\.youtube\.com/(pagead|ptracking) url reject-200
^https?://s\.youtube\.com/api/stats/qoe\?adcontext url reject-200

[Script]
# YouTube API Response
youtube.response = type=http-response, pattern=^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/(browse|next|player|search|reel\/reel_watch_sequence|guide|account\/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, max-size=-1, binary-body-mode=true, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js, argument="{\"captionLang\":\"off\",\"blockUpload\":true,\"blockImmersive\":true,\"blockShorts\":false,\"debug\":false}"

# GoogleVideo initplayback Request
youtube.request.init = type=http-request, pattern=^https?:\/\/[\w-]+\.googlevideo\.com\/initplayback.+&ack.*, requires-body=true, max-size=-1, binary-body-mode=true, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js, argument="{\"captionLang\":\"off\"}"

# YouTube log_event Request
youtube.request.log_event = type=http-request, pattern=^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/log_event, requires-body=true, max-size=-1, binary-body-mode=true, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js

[Rule]
# 禁用相关 QUIC/HTTP3，让 HTTPS MITM/脚本处理稳定生效
AND,((DOMAIN-SUFFIX,googlevideo.com),(NETWORK,UDP)),REJECT
AND,((DOMAIN,youtubei.googleapis.com),(NETWORK,UDP)),REJECT
