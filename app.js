// 引用linebot SDK
var botbot = require('botbot');

// 用於辨識Line Channel的資訊
var bot = botbot({
  channelId: '1560798585',
  channelSecret: '1589ff134473e16c4371b27210faa9f7',
  channelAccessToken: 'G1pGwm2MIYt2oh6NeC3SBr2BwEtMArK96hXwIEIFNliDicdFHKoQg3fmXPOV31QElZRPAHhVB9j/YHiYSrcdgYSAeGVpWLSHTWkhwu+x4RAsw+vK3G4ZmQl9zrryWYbkJATptM06b4i+zru57EkYowdB04t89/1O/w1cDnyilFU='
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  // event.message.text是使用者傳給bot的訊息
  
  var replyMsg = `Hello你剛才說的是:${event.message.text}`;
  
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  event.reply(replyMsg).then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    // 當訊息回傳失敗後的處理
  });
});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3003, function () {
    console.log('[BOT已準備就緒]');
});