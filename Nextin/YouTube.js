#!name=YouTube 去广告 - Nextin 对照版

[MITM]
hostname = *.googlevideo.com, www.youtube.com, s.youtube.com, youtubei.googleapis.com

[URL Rewrite]
(^https?://(?!redirector)[\w-]+\.googlevideo\.com/(?!dclk_video_ads).+?)&ctier=L(&.+?),ctier,(.+) url 302 $1$2$3
^https?://(?!redirector)[\w-]+\.googlevideo\.com/(?!(dclk_video_ads|videoplayback\?)).+&oad url reject-200
^https?://(www|s)\.youtube\.com/api/stats/ads url reject-200
^https?://(www|s)\.youtube\.com/(pagead|ptracking) url reject-200
^https?://s\.youtube\.com/api/stats/qoe\?adcontext url reject-200

[Script]
YT-Response = type=http-response, pattern=^https://youtubei\.googleapis\.com/youtubei/v1/(browse|next|player|search|reel/reel_watch_sequence|guide|account/get_setting|get_watch), requires-body=true, binary-body-mode=true, max-size=10485760, timeout=10, script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js

[Rule]
AND,((DOMAIN-SUFFIX,googlevideo.com),(NETWORK,UDP)),REJECT
AND,((DOMAIN,youtubei.googleapis.com),(NETWORK,UDP)),REJECT
