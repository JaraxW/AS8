#!name=MissAV 网页去广告 - Nextin

[MITM]
hostname = missav.live, missav.ws, missav.ai, missav.com

[Script]
MissAV = type=http-response, pattern=^https?://missav\.(ws|live|com|ai)/(?!(.*(api|login|cdn-cgi|verify|auth|captch|(\.(js|css|jpg|jpeg|png|webp|gif|zip|woff|woff2|m3u8|mp4|mov|m4v|avi|mkv|flv|rmvb|wmv|rm|asf|asx|mp3|json|ico|otf|ttf))))), requires-body=true, binary-body-mode=false, max-size=2097152, timeout=10, script-path=https://ddgksf2013.top/scripts/missav.ads.js
