#!name=Nicegram会员
#!desc=Nicegram响应脚本适配

[MITM]
hostname = nicegram.cloud

[Script]
Nicegram = type=http-response, pattern=^https?://nicegram\.cloud/api/v\d+/(ai-assistant/purchase-list|user/info|telegram/auth)(?:[/?]|$), script-path=https://ddgksf2013.top/scripts/nicegram.vip.js, requires-body=true, max-size=2097152, timeout=60
