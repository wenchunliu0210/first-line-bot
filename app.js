const botbot = require('botbot');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

const SITE_NAME = '松山';
//AQI空氣品質網站的連線請求參數
const aqiOpt={
	uri: "http://opendata2.epa.gov.tw/AQI.json",
	json: true
};

// 用於辨識Line Channel的資訊
const bot = botbot({
  channelId: '替換成你的CHANNEL_ID',
  channelSecret: '替換成你的CHANNEL_SECRET',
  channelAccessToken: '替換成你的CHANNEL_ACCESS_TOKEN'
});

function readAQI(repos){
	let data;
	
	for(i in repos){
		if(repos[i].SiteName == SITE_NAME){
			data = repos[i];
			break;
		}
	}
	
	return data;   // 回傳松山觀測站的空氣品質(JSON格式)
}

const app = express();
app.set('view engine', 'ejs');   // 指定使用ejs樣板引擎


// 處理請求
// 取得空氣品質資料
app.get('/',function(req,res){
	rp(aqiOpt).then(function (repos){
		res.render('index', {AQI:readAQI(repos)});   //把空氣品質資料交給ejs引擎合成HTML網頁
	}).catch(function (error){
		res.send("無法取得空氣品質資料~~");
	});
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {

	switch(event.message.type) {
		case 'text':

			switch(event.message.text) {
				case '空氣':
					let data;
					rp(aqiOpt)
					.then(function (repos) {
						data = readAQI(repos);
						event.reply(data.County + data.SiteName + 
						'\n\nPM2.5指數：'+ data["PM2.5_AVG"] +
						'\n狀態：' + data.Status);
					})
					.catch(function (error) {
						event.reply('無法取得空氣品質資料~~');
					});
					break;
				
				case '漫畫app推薦':
										
					message1 = ({
						type: 'text',
						text: '  你/妳想要談場甜甜蜜蜜的戀愛，還是經歷一場刻骨銘心的愛情呢?或是體驗驚悚故事所帶給你/妳的刺激感受? LINE WEBTOON提供各種類型題材的免費連載漫畫，滿足你/妳的各種喜好，讓你/妳同時擁有精彩的視覺享受以及豐富的情境體驗。心動了嗎?那就趕快在下方輸入"WEBTOON"，點擊按鈕下載LINE WEBTOON吧!讓LINE WEBTOON陪你/妳走到哪看到哪~'
						
					})
					

					message2 = ({
						type: 'image',
						originalContentUrl: 'https://i.imgur.com/fnFDTDM.jpg',
						previewImageUrl: 'https://i.imgur.com/fnFDTDM.jpg'
					})
					
					message3 = [message1,message2]
					
					event.reply(message3)


					break;
								
				case 'WEBTOON':
					message4 ={
						type: 'template',
						altText: 'this is a buttons template',
						template: {
							type: 'buttons',
							title: 'Menu',
							text: 'please select',
							actions: [
							{
								type: 'uri',
								label: '下載WEBTOON',
								uri: 'https://play.google.com/store/apps/details?id=com.naver.linewebtoon&hl=zh_TW'
							}
							]
						}
					}
					
					event.reply(message4)
					
					break;		
					
				case 'Me':
					event.source.profile().then(function (profile) {
						return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
					});
					break;
					
				default:
					
					// event.message.text是使用者傳給bot的訊息
					// 準備要回傳的內容
					const replyMsg = `Hello你剛才說的是:${event.message.text}`;
					// 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者
					event.reply(replyMsg).then(function (data) {
					  // 當訊息成功回傳後的處理
					}).catch(function (error) {
					  // 當訊息回傳失敗後的處理
					});
					break;
					
			}
			break;
		
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
	}
});	


// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3022, function () {
    console.log('[BOT已準備就緒]');
});