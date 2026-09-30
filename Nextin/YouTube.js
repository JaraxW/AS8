#!name=YouTube 去广告 - Nextin

[MITM]
hostname = *.googlevideo.com, www.youtube.com, s.youtube.com, youtubei.googleapis.com

[URL Rewrite]
(^https?://(?!redirector)[\w-]+\.googlevideo\.com/(?!dclk_video_ads).+?)&ctier=L(&.+?),ctier,(.+) url 302 $1$2$3
^https?://(?!redirector)[\w-]+\.googlevideo\.com/(?!(dclk_video_ads|videoplayback\?)).+&oad url reject-200
^https?://(www|s)\.youtube\.com/api/stats/ads url reject-200
^https?://(www|s)\.youtube\.com/(pagead|ptracking) url reject-200
^https?://s\.youtube\.com/api/stats/qoe\?adcontext url reject-200

[Script]
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch|log_event|config)(\?.*)?$, requires-body=true, binary-body-mode=true, max-size=10485760, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js

YT-Init = type=http-request, pattern=^https?://(?!redirector)[\w-]+\.googlevideo\.com/initplayback.+&ack.*, requires-body=true, binary-body-mode=true, max-size=10485760, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js

YT-Log = type=http-request, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/log_event, requires-body=true, binary-body-mode=true, max-size=10485760, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.request.js

[Rule]
AND,((NETWORK,UDP),(DST-PORT,443),(DOMAIN-SUFFIX,googlevideo.com)),REJECT
AND,((NETWORK,UDP),(DST-PORT,443),(DOMAIN-SUFFIX,youtube.com)),REJECT
AND,((NETWORK,UDP),(DST-PORT,443),(DOMAIN,youtubei.googleapis.com)),REJECT
