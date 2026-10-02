#!name=Google 重定向 - Nextin
#!desc=中国 Google 域名跳转到 www.google.com

[MITM]
hostname = www.google.cn, google.cn, www.g.cn, g.cn

[URL Rewrite]
^https?://(?:www\.)?(?:g|google)\.cn(?:[/?#]|$) url 302 https://www.google.com
