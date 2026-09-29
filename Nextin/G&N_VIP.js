#!name=Goodbility - Nextin
#!desc=GoodNotes、Notability 响应脚本适配

[MITM]
hostname = isi.csan.*, notability.com

[Script]
Goodbility-Header = type=http-request, pattern=^https://isi\.csan\.[a-z.]+/.+/(receipts|subscribers), requires-body=false, script-path=https://raw.githubusercontent.com/ddgksf2013/Scripts/master/deleteHeader.js, timeout=10

Goodbility-Response = type=http-response, pattern=^https://isi\.csan\.[a-z.]+/.+/(receipts$|subscribers/[^/]+$), requires-body=true, binary-body-mode=false, max-size=2097152, script-path=https://ddgksf2013.top/scripts/goodbility.vip.js, timeout=10

Notability-Response = type=http-response, pattern=^https?://notability\.com/global, requires-body=true, binary-body-mode=false, max-size=2097152, script-path=https://ddgksf2013.top/scripts/goodbility.vip.js, timeout=10
