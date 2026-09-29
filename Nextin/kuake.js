#!name=夸克 - Nextin

[MITM]
hostname = drive*.quark.cn

[Script]
Quark = type=http-response, pattern=^https?://drive.*\.quark\.cn/.+/clouddrive/(member.+|distribute/detail.+|capacity/growth/info), requires-body=true, binary-body-mode=false, max-size=2097152, timeout=10, script-path=https://raw.githubusercontent.com/chxm1023/Rewrite/main/kuake.js
