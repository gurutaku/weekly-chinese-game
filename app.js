const HANZI_POOL = [
  { char:'我', bopomofo:'ㄨㄛˇ', pinyin:'wǒ', meaning:'我；自己。', sentence:'我喜歡看書。', en:'I like reading books.', tip:'「我」是第一人稱，介紹自己時很常用。' },
  { char:'你', bopomofo:'ㄋㄧˇ', pinyin:'nǐ', meaning:'你；第二人稱。', sentence:'你今天開心嗎？', en:'Are you happy today?', tip:'「你」常和「我」一起出現：我、你。' },
  { char:'他', bopomofo:'ㄊㄚ', pinyin:'tā', meaning:'他；男性第三人稱。', sentence:'他正在跑步。', en:'He is running.', tip:'「他」指男生或男性；女生常寫「她」。' },
  { char:'她', bopomofo:'ㄊㄚ', pinyin:'tā', meaning:'她；女性第三人稱。', sentence:'她喜歡畫畫。', en:'She likes drawing.', tip:'「她」和「他」發音相同，但意思不同。' },
  { char:'好', bopomofo:'ㄏㄠˇ', pinyin:'hǎo', meaning:'好；很好；適合。', sentence:'今天的天氣很好。', en:'The weather is very nice today.', tip:'「你好」是很常見的招呼語。' },
  { char:'大', bopomofo:'ㄉㄚˋ', pinyin:'dà', meaning:'大；尺寸或程度高。', sentence:'這是一棵大樹。', en:'This is a big tree.', tip:'記住「大」張開雙手的形狀。' },
  { char:'小', bopomofo:'ㄒㄧㄠˇ', pinyin:'xiǎo', meaning:'小；尺寸或程度低。', sentence:'小鳥在樹上唱歌。', en:'A little bird is singing in the tree.', tip:'「大」和「小」是一組相反詞。' },
  { char:'上', bopomofo:'ㄕㄤˋ', pinyin:'shàng', meaning:'上面；向上；開始。', sentence:'書在桌子上。', en:'The book is on the table.', tip:'「上」可以表示位置，也可以表示往上的方向。' },
  { char:'下', bopomofo:'ㄒㄧㄚˋ', pinyin:'xià', meaning:'下面；向下；下一個。', sentence:'球掉到地上了。', en:'The ball fell onto the ground.', tip:'「上」和「下」是方向相反的一對。' },
  { char:'天', bopomofo:'ㄊㄧㄢ', pinyin:'tiān', meaning:'天空；一天；日子。', sentence:'今天是星期一。', en:'Today is Monday.', tip:'「今天」就是現在這一天。' },
  { char:'月', bopomofo:'ㄩㄝˋ', pinyin:'yuè', meaning:'月亮；月份。', sentence:'今晚的月亮很亮。', en:'The moon is very bright tonight.', tip:'「月」像彎彎的月亮。' },
  { char:'日', bopomofo:'ㄖˋ', pinyin:'rì', meaning:'太陽；一天；日子。', sentence:'今天是星期日。', en:'Today is Sunday.', tip:'「日」也常用來表示一天。' },
  { char:'水', bopomofo:'ㄕㄨㄟˇ', pinyin:'shuǐ', meaning:'水；液體。', sentence:'請喝一杯水。', en:'Please drink a glass of water.', tip:'寫「水」時注意中間的直畫。' },
  { char:'火', bopomofo:'ㄏㄨㄛˇ', pinyin:'huǒ', meaning:'火；火焰。', sentence:'小心，火很燙！', en:'Be careful, the fire is hot!', tip:'「火」的四筆可以想成火焰向外飛。' },
  { char:'山', bopomofo:'ㄕㄢ', pinyin:'shān', meaning:'山；山峰。', sentence:'我們週末去爬山。', en:'We are going hiking this weekend.', tip:'「山」的外形像三座山峰。' },
  { char:'人', bopomofo:'ㄖㄣˊ', pinyin:'rén', meaning:'人；人類。', sentence:'公園裡有很多人。', en:'There are many people in the park.', tip:'「人」像兩個人互相靠著走路。' },
  { char:'心', bopomofo:'ㄒㄧㄣ', pinyin:'xīn', meaning:'心；心情；內心。', sentence:'我今天心情很好。', en:'I am in a good mood today.', tip:'很多和感情有關的字都含有「心」。' },
  { char:'口', bopomofo:'ㄎㄡˇ', pinyin:'kǒu', meaning:'嘴巴；入口；口。', sentence:'張大你的口。', en:'Open your mouth wide.', tip:'「口」就是嘴巴的形狀。' },
  { char:'手', bopomofo:'ㄕㄡˇ', pinyin:'shǒu', meaning:'手；手部。', sentence:'請舉起你的手。', en:'Please raise your hand.', tip:'手是我們每天最常用的部位之一。' },
  { char:'眼', bopomofo:'ㄧㄢˇ', pinyin:'yǎn', meaning:'眼睛；視力。', sentence:'我的眼睛很酸。', en:'My eyes feel tired.', tip:'「眼」和眼睛有關，左邊是「目」。' },
  { char:'耳', bopomofo:'ㄦˇ', pinyin:'ěr', meaning:'耳朵。', sentence:'我的耳朵聽到了聲音。', en:'My ears heard a sound.', tip:'「耳」的字形像耳朵。' },
  { char:'足', bopomofo:'ㄗㄨˊ', pinyin:'zú', meaning:'腳；足夠；足部。', sentence:'我的雙足很累。', en:'My feet are very tired.', tip:'「足」和腳、走路有關。' },
  { char:'學', bopomofo:'ㄒㄩㄝˊ', pinyin:'xué', meaning:'學習；學問。', sentence:'我每天學中文。', en:'I learn Chinese every day.', tip:'「學」是學習，常見詞有「學校、學生」。' },
  { char:'校', bopomofo:'ㄒㄧㄠˋ', pinyin:'xiào', meaning:'學校；校園。', sentence:'我早上八點到學校。', en:'I arrive at school at 8 a.m.', tip:'「學校」的「校」讀第四聲。' },
  { char:'生', bopomofo:'ㄕㄥ', pinyin:'shēng', meaning:'出生；生活；學生。', sentence:'學生正在讀書。', en:'The students are studying.', tip:'「生」可以表示生命、生長，也能組成「學生」。' },
  { char:'書', bopomofo:'ㄕㄨ', pinyin:'shū', meaning:'書；書本。', sentence:'這本書很好看。', en:'This book is very interesting.', tip:'「書」和閱讀、寫字常常一起出現。' },
  { char:'字', bopomofo:'ㄗˋ', pinyin:'zì', meaning:'文字；字。', sentence:'這個字怎麼念？', en:'How do you pronounce this character?', tip:'「漢字」就是 Chinese characters。' },
  { char:'文', bopomofo:'ㄨㄣˊ', pinyin:'wén', meaning:'文字；文章；文化。', sentence:'我在寫一篇作文。', en:'I am writing a composition.', tip:'「中文」的「文」就是文字、語文。' },
  { char:'語', bopomofo:'ㄩˇ', pinyin:'yǔ', meaning:'語言；說話。', sentence:'中文是一種語言。', en:'Chinese is a language.', tip:'「語」常出現在「語言、英語、中文」。' },
  { char:'中', bopomofo:'ㄓㄨㄥ', pinyin:'zhōng', meaning:'中間；裡面；中國。', sentence:'球在盒子中間。', en:'The ball is in the middle of the box.', tip:'「中」最核心的意思是「在中間」。' },
  { char:'國', bopomofo:'ㄍㄨㄛˊ', pinyin:'guó', meaning:'國家。', sentence:'加拿大是一個國家。', en:'Canada is a country.', tip:'「國」的外框像一個保護城市的圍牆。' },
  { char:'家', bopomofo:'ㄐㄧㄚ', pinyin:'jiā', meaning:'家；家庭。', sentence:'我喜歡回家。', en:'I like going home.', tip:'「家」可以是住的地方，也可以指家人。' },
  { char:'爸', bopomofo:'ㄅㄚˋ', pinyin:'bà', meaning:'爸爸；父親。', sentence:'爸爸在廚房做飯。', en:'Dad is cooking in the kitchen.', tip:'「爸」是口語中常用的爸爸稱呼。' },
  { char:'媽', bopomofo:'ㄇㄚ', pinyin:'mā', meaning:'媽媽；母親。', sentence:'媽媽正在看書。', en:'Mom is reading a book.', tip:'「媽」的右邊是「馬」。' },
  { char:'朋', bopomofo:'ㄆㄥˊ', pinyin:'péng', meaning:'朋友的一部分；同類。', sentence:'他是我的好朋友。', en:'He is my good friend.', tip:'「朋」和「友」一起組成「朋友」。' },
  { char:'友', bopomofo:'ㄧㄡˇ', pinyin:'yǒu', meaning:'朋友；友好。', sentence:'朋友會互相幫忙。', en:'Friends help each other.', tip:'「友」是友誼、友情的「友」。' },
  { char:'吃', bopomofo:'ㄔ', pinyin:'chī', meaning:'吃東西。', sentence:'我們一起吃水果。', en:'Let’s eat fruit together.', tip:'「吃」常用在食物和三餐。' },
  { char:'喝', bopomofo:'ㄏㄜ', pinyin:'hē', meaning:'飲用液體。', sentence:'運動後要喝水。', en:'Drink water after exercising.', tip:'「喝」是喝飲料、喝水的動作。' },
  { char:'看', bopomofo:'ㄎㄢˋ', pinyin:'kàn', meaning:'看；觀看；閱讀。', sentence:'我喜歡看故事書。', en:'I like reading storybooks.', tip:'「看」可以是用眼睛看，也可以是觀看。' },
  { char:'聽', bopomofo:'ㄊㄧㄥ', pinyin:'tīng', meaning:'聽見；聆聽。', sentence:'請仔細聽老師說話。', en:'Please listen carefully to the teacher.', tip:'「聽」和耳朵有關，左邊是「耳」。' },
  { char:'說', bopomofo:'ㄕㄨㄛ', pinyin:'shuō', meaning:'說話；告訴。', sentence:'請大聲說一次。', en:'Please say it one more time loudly.', tip:'「說」和語言、說話有關。' },
  { char:'讀', bopomofo:'ㄉㄨˊ', pinyin:'dú', meaning:'閱讀；朗讀。', sentence:'我正在讀一本小說。', en:'I am reading a novel.', tip:'「讀」是把文字讀出來或閱讀。' },
  { char:'寫', bopomofo:'ㄒㄧㄝˇ', pinyin:'xiě', meaning:'寫字；書寫。', sentence:'我每天寫日記。', en:'I write a diary every day.', tip:'寫字時要注意筆順，會更容易寫得漂亮。' },
  { char:'走', bopomofo:'ㄗㄡˇ', pinyin:'zǒu', meaning:'走路；離開。', sentence:'我們一起走回家。', en:'Let’s walk home together.', tip:'「走」和腳的動作很有關係。' },
  { char:'跑', bopomofo:'ㄆㄠˇ', pinyin:'pǎo', meaning:'跑步；快速行走。', sentence:'弟弟喜歡在公園跑步。', en:'My little brother likes running in the park.', tip:'「跑」是「走」得更快。' },
  { char:'玩', bopomofo:'ㄨㄢˊ', pinyin:'wán', meaning:'遊玩；遊戲。', sentence:'放學後我們一起玩。', en:'We play together after school.', tip:'「玩」常和遊戲、活動放在一起。' },
  { char:'來', bopomofo:'ㄌㄞˊ', pinyin:'lái', meaning:'來到；來自。', sentence:'歡迎你來我家。', en:'Welcome to my home.', tip:'「來」和「去」是方向相反的一對。' },
  { char:'去', bopomofo:'ㄑㄩˋ', pinyin:'qù', meaning:'前往；離開。', sentence:'我們下午去公園。', en:'We are going to the park this afternoon.', tip:'「去」表示從這裡往別的地方。' },
  { char:'有', bopomofo:'ㄧㄡˇ', pinyin:'yǒu', meaning:'擁有；存在。', sentence:'桌上有三本書。', en:'There are three books on the table.', tip:'「有」可以表示擁有，也可以表示某個地方存在。' },
  { char:'沒', bopomofo:'ㄇㄟˊ', pinyin:'méi', meaning:'沒有；不曾。', sentence:'我沒有看電視。', en:'I did not watch TV.', tip:'「沒有」是非常常見的否定說法。' },
  { char:'是', bopomofo:'ㄕˋ', pinyin:'shì', meaning:'是；表示判斷或確認。', sentence:'這是我的鉛筆。', en:'This is my pencil.', tip:'「是」常用來連接人、事物和名稱。' },
  { char:'不', bopomofo:'ㄅㄨˋ', pinyin:'bù', meaning:'不；表示否定。', sentence:'我不喜歡下雨天。', en:'I do not like rainy days.', tip:'「不」是否定詞，常放在動詞前面。' },
  { char:'要', bopomofo:'ㄧㄠˋ', pinyin:'yào', meaning:'要；需要；將要。', sentence:'我要喝水。', en:'I want to drink water.', tip:'「要」可以表示想要、需要或即將發生。' },
  { char:'能', bopomofo:'ㄋㄥˊ', pinyin:'néng', meaning:'能夠；可以。', sentence:'你能幫我嗎？', en:'Can you help me?', tip:'「能」表示有能力做到某件事。' },
  { char:'會', bopomofo:'ㄏㄨㄟˋ', pinyin:'huì', meaning:'會；懂得；可能。', sentence:'我會騎腳踏車。', en:'I can ride a bicycle.', tip:'「會」也可以表示未來可能發生。' },
  { char:'在', bopomofo:'ㄗㄞˋ', pinyin:'zài', meaning:'在；位於；正在。', sentence:'我在家寫作業。', en:'I am at home doing homework.', tip:'「在」可以表示位置，也可以表示正在做事。' },
  { char:'和', bopomofo:'ㄏㄜˊ', pinyin:'hé', meaning:'和；與；一起。', sentence:'我和妹妹一起看書。', en:'My sister and I read together.', tip:'「和」常用來連接兩個人或兩件事。' },
  { char:'新', bopomofo:'ㄒㄧㄣ', pinyin:'xīn', meaning:'新；不舊。', sentence:'我有一本新書。', en:'I have a new book.', tip:'「新」和「舊」是相反詞。' },
  { char:'舊', bopomofo:'ㄐㄧㄡˋ', pinyin:'jiù', meaning:'舊；使用過的；不新。', sentence:'這是我的舊玩具。', en:'This is my old toy.', tip:'「舊」和「新」相反。' },
  { char:'快', bopomofo:'ㄎㄨㄞˋ', pinyin:'kuài', meaning:'快速；快樂。', sentence:'他跑得很快。', en:'He runs very fast.', tip:'「快」可以表示速度，也可以出現在「快樂」。' },
  { char:'慢', bopomofo:'ㄇㄢˋ', pinyin:'màn', meaning:'速度不快。', sentence:'請慢慢走。', en:'Please walk slowly.', tip:'「慢」和「快」是一組相反詞。' },
  { char:'多', bopomofo:'ㄉㄨㄛ', pinyin:'duō', meaning:'數量多；很多。', sentence:'今天有很多人。', en:'There are many people today.', tip:'「多」和「少」是相反詞。' },
  { char:'少', bopomofo:'ㄕㄠˇ', pinyin:'shǎo', meaning:'數量少；不多。', sentence:'杯子裡的水很少。', en:'There is very little water in the cup.', tip:'「少」和「多」相反。' },
  { char:'高', bopomofo:'ㄍㄠ', pinyin:'gāo', meaning:'高；高度大。', sentence:'那棟樓很高。', en:'That building is very tall.', tip:'「高」和「低」相反。' },
  { char:'低', bopomofo:'ㄉㄧ', pinyin:'dī', meaning:'低；高度小。', sentence:'桌子太低了。', en:'The table is too low.', tip:'「低」和「高」相反。' },
  { char:'長', bopomofo:'ㄔㄤˊ', pinyin:'cháng', meaning:'長；長度大。', sentence:'這條路很長。', en:'This road is very long.', tip:'「長」和「短」相反。' },
  { char:'短', bopomofo:'ㄉㄨㄢˇ', pinyin:'duǎn', meaning:'短；長度小。', sentence:'這支鉛筆太短了。', en:'This pencil is too short.', tip:'「短」和「長」相反。' },
  { char:'白', bopomofo:'ㄅㄞˊ', pinyin:'bái', meaning:'白色；明亮。', sentence:'我有一隻白貓。', en:'I have a white cat.', tip:'「白」和「黑」是基本顏色詞。' },
  { char:'黑', bopomofo:'ㄏㄟ', pinyin:'hēi', meaning:'黑色；暗。', sentence:'黑夜裡有很多星星。', en:'There are many stars in the dark night.', tip:'「黑」和「白」相反。' },
  { char:'紅', bopomofo:'ㄏㄨㄥˊ', pinyin:'hóng', meaning:'紅色。', sentence:'她穿著紅色的外套。', en:'She is wearing a red coat.', tip:'「紅」是很常見的顏色字。' },
  { char:'花', bopomofo:'ㄏㄨㄚ', pinyin:'huā', meaning:'花朵；植物的花。', sentence:'春天的花開了。', en:'The flowers bloom in spring.', tip:'「花」也可以指花朵的總稱。' },
  { char:'草', bopomofo:'ㄘㄠˇ', pinyin:'cǎo', meaning:'草；草本植物。', sentence:'小狗在草地上玩。', en:'The dog is playing on the grass.', tip:'「草」常和草地、青草一起使用。' },
  { char:'樹', bopomofo:'ㄕㄨˋ', pinyin:'shù', meaning:'樹木。', sentence:'門口有一棵大樹。', en:'There is a big tree by the entrance.', tip:'「樹」常用來表示有木質主幹的植物。' },
  { char:'鳥', bopomofo:'ㄋㄧㄠˇ', pinyin:'niǎo', meaning:'鳥類。', sentence:'一隻鳥飛過天空。', en:'A bird flew across the sky.', tip:'「鳥」看起來像一隻側身的小鳥。' },
  { char:'魚', bopomofo:'ㄩˊ', pinyin:'yú', meaning:'魚類。', sentence:'魚在水裡游。', en:'Fish swim in the water.', tip:'「魚」的下方四點可想成水。' },
  { char:'貓', bopomofo:'ㄇㄠ', pinyin:'māo', meaning:'貓。', sentence:'那隻貓正在睡覺。', en:'That cat is sleeping.', tip:'「貓」的左邊是「犬」的字形部件。' },
  { char:'狗', bopomofo:'ㄍㄡˇ', pinyin:'gǒu', meaning:'狗。', sentence:'我家的狗很可愛。', en:'My dog is very cute.', tip:'「狗」是日常很常見的動物字。' },
  { char:'車', bopomofo:'ㄔㄜ', pinyin:'chē', meaning:'車子；交通工具。', sentence:'爸爸開車去上班。', en:'Dad drives to work.', tip:'「車」和交通有關，常見詞有汽車、火車。' },
  { char:'門', bopomofo:'ㄇㄣˊ', pinyin:'mén', meaning:'門；入口。', sentence:'請把門關起來。', en:'Please close the door.', tip:'「門」像兩扇門打開的樣子。' },
  { char:'家', bopomofo:'ㄐㄧㄚ', pinyin:'jiā', meaning:'家；家庭。', sentence:'晚餐後我們回家。', en:'We go home after dinner.', tip:'「家」也是學習和生活最常用的字之一。' },
  { char:'吃', bopomofo:'ㄔ', pinyin:'chī', meaning:'吃東西。', sentence:'早餐要吃得健康。', en:'Eat a healthy breakfast.', tip:'「吃」是三餐中很常用的動詞。' },
  { char:'笑', bopomofo:'ㄒㄧㄠˋ', pinyin:'xiào', meaning:'笑；微笑。', sentence:'妹妹笑得很開心。', en:'My little sister is smiling happily.', tip:'「笑」可以是微笑、大笑，也可以描述開心的樣子。' },
  { char:'開', bopomofo:'ㄎㄞ', pinyin:'kāi', meaning:'打開；開始；開啟。', sentence:'請把窗戶打開。', en:'Please open the window.', tip:'「開」和「關」是一組常見反義詞。' },
  { char:'關', bopomofo:'ㄍㄨㄢ', pinyin:'guān', meaning:'關閉；關上。', sentence:'睡覺前要關燈。', en:'Turn off the light before bed.', tip:'「關」和「開」常常成對使用。' },
  { char:'明', bopomofo:'ㄇㄧㄥˊ', pinyin:'míng', meaning:'明亮；明白；明天。', sentence:'明天見！', en:'See you tomorrow!', tip:'「明」可以和太陽、月亮聯想在一起。' },
  { char:'早', bopomofo:'ㄗㄠˇ', pinyin:'zǎo', meaning:'早；時間不晚。', sentence:'早安，今天也要加油！', en:'Good morning. Let’s do our best today!', tip:'「早安」是早上的問候語。' },
  { char:'晚', bopomofo:'ㄨㄢˇ', pinyin:'wǎn', meaning:'晚；晚上的時間。', sentence:'晚安，祝你做個好夢。', en:'Good night. Sweet dreams.', tip:'「早」和「晚」是時間上的對比。' },
  { char:'年', bopomofo:'ㄋㄧㄢˊ', pinyin:'nián', meaning:'年；一年。', sentence:'我今年十歲。', en:'I am ten years old this year.', tip:'「今年、明年、去年」都會用到「年」。' },
  { char:'今', bopomofo:'ㄐㄧㄣ', pinyin:'jīn', meaning:'現在；今天。', sentence:'今天是很特別的一天。', en:'Today is a special day.', tip:'「今」常和「天」合成「今天」。' },
  { char:'前', bopomofo:'ㄑㄧㄢˊ', pinyin:'qián', meaning:'前面；以前；先前。', sentence:'請站到我前面。', en:'Please stand in front of me.', tip:'「前」和「後」是方向或時間上的相對概念。' },
  { char:'後', bopomofo:'ㄏㄡˋ', pinyin:'hòu', meaning:'後面；以後。', sentence:'書包在椅子後面。', en:'The backpack is behind the chair.', tip:'「後」和「前」常常一起學。' },
  { char:'回', bopomofo:'ㄏㄨㄟˊ', pinyin:'huí', meaning:'回去；返回；一次。', sentence:'放學後我回家。', en:'I go home after school.', tip:'「回」像轉一圈回到原來的地方。' },
  { char:'從', bopomofo:'ㄘㄨㄥˊ', pinyin:'cóng', meaning:'從；由。', sentence:'我從家裡走到公園。', en:'I walk from home to the park.', tip:'「從」用來說明出發的地方。' },
  { char:'到', bopomofo:'ㄉㄠˋ', pinyin:'dào', meaning:'到達；直到。', sentence:'我八點到學校。', en:'I arrive at school at eight.', tip:'「到」可以表示到達目的地。' },
  { char:'給', bopomofo:'ㄍㄟˇ', pinyin:'gěi', meaning:'給予；交給。', sentence:'請給我一張紙。', en:'Please give me a piece of paper.', tip:'「給」常用在請求、分享和送出東西。' },
  { char:'要', bopomofo:'ㄧㄠˋ', pinyin:'yào', meaning:'要；需要；即將。', sentence:'下雨了，要記得帶傘。', en:'It is raining, so remember to bring an umbrella.', tip:'「要」可以表示需要或即將。' }
];

// Remove duplicate characters while keeping the first definition.
const DATA = Array.from(new Map(HANZI_POOL.map(item => [item.char, item])).values());
const STORAGE_KEY = 'chinese-weekly-progress-v1';

let state = loadState();
let weekly = getWeeklySet();
let selectedIndex = 0;
let writer = null;
let practice = { order: [], current: 0, score: 0 };
let toastTimer = null;

const $ = (id) => document.getElementById(id);

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { completed: {}, streakDates: [] }; }
  catch (_) { return { completed: {}, streakDates: [] }; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function isoDate(d) { return d.toISOString().slice(0, 10); }
function startOfWeek(date) {
  const d = new Date(date); const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0,0,0,0); d.setDate(d.getDate() + diff); return d;
}
function endOfWeek(date) { const d = startOfWeek(date); d.setDate(d.getDate()+6); return d; }
function weekKey(date = new Date()) {
  // Monday-start week; using the exact Monday date makes the key stable
  // across year boundaries without relying on ISO-week edge cases.
  return isoDate(startOfWeek(date));
}
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function getWeeklySet() {
  const seed = hashString(weekKey());
  const rand = mulberry32(seed);
  const pool = [...DATA];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(10, pool.length));
}
function formatMD(d) { return `${d.getMonth()+1}/${d.getDate()}`; }
function completed(char) { return Boolean(state.completed[weekKey()]?.includes(char)); }
function markCompleted(char) {
  const key = weekKey();
  state.completed[key] = state.completed[key] || [];
  if (!state.completed[key].includes(char)) state.completed[key].push(char);
  const today = isoDate(new Date());
  state.streakDates = Array.from(new Set([...(state.streakDates || []), today])).sort();
  saveState();
}
function getStreak() {
  const dates = new Set(state.streakDates || []);
  let d = new Date();
  d.setHours(0,0,0,0);
  let streak = 0;
  while (dates.has(isoDate(d))) { streak++; d.setDate(d.getDate()-1); }
  return streak;
}

function renderWeekMeta() {
  const start = startOfWeek(new Date()); const end = endOfWeek(new Date());
  $('weekRange').textContent = `${start.getFullYear()} / ${formatMD(start)} – ${formatMD(end)}`;
  $('streakValue').textContent = `${getStreak()} 天`;
  const count = weekly.filter(item => completed(item.char)).length;
  $('progressText').textContent = `${count} / ${weekly.length} 已完成`;
  $('progressBar').style.width = `${count / weekly.length * 100}%`;
}

function renderGrid() {
  $('characterGrid').innerHTML = weekly.map((item, index) => `
    <button class="char-card ${index === selectedIndex ? 'selected' : ''} ${completed(item.char) ? 'completed' : ''}" data-index="${index}" type="button">
      <span class="done-dot">✓</span>
      <div class="char-number">${index + 1}</div>
      <div class="char-glyph">${item.char}</div>
      <div class="char-bpmf">${item.bopomofo}</div>
    </button>
  `).join('');
  document.querySelectorAll('.char-card').forEach(btn => btn.addEventListener('click', () => selectCharacter(Number(btn.dataset.index))));
}

function initWriter(char) {
  if (!window.HanziWriter) {
    $('writer').textContent = char;
    $('writerStatus').textContent = '筆順工具尚未載入；請確認網路連線後重新整理。';
    return;
  }
  $('writer').innerHTML = '';
  try {
    writer = HanziWriter.create('writer', char, {
      width: '100%', height: '100%', padding: 12,
      showOutline: true, showCharacter: false,
      strokeAnimationSpeed: 1,
      strokeColor: '#d84b45',
      radicalColor: '#d84b45',
      outlineColor: '#ddd3cb',
      highlightColor: '#e49f36',
      drawingColor: '#2f2730',
      strokeFadeDuration: 300,
      strokeHighlightDuration: 180,
      delayBetweenStrokes: 180,
      onLoadCharDataSuccess: () => { $('writerStatus').textContent = '筆順已載入。先看一次，再自己寫。'; },
      onLoadCharDataError: () => { $('writerStatus').textContent = '找不到這個字的筆順資料。'; }
    });
    $('writerStatus').textContent = '筆順載入中…';
  } catch (e) {
    $('writerStatus').textContent = '筆順工具發生問題，請重新整理頁面。';
  }
}

function renderCharacter() {
  const item = weekly[selectedIndex];
  if (!item) return;
  $('selectedTitle').textContent = `${item.char}　${item.pinyin}`;
  $('bopomofo').textContent = item.bopomofo;
  $('pinyin').textContent = item.pinyin;
  $('meaning').textContent = item.meaning;
  $('sentence').textContent = item.sentence;
  $('sentenceEnglish').textContent = item.en;
  $('tipText').textContent = item.tip;
  $('markBtn').textContent = completed(item.char) ? '已完成 ✓' : '標記完成';
  $('markBtn').disabled = completed(item.char);
  $('markBtn').style.opacity = completed(item.char) ? '.65' : '1';
  renderGrid();
  initWriter(item.char);
}

function selectCharacter(index) {
  selectedIndex = index;
  $('practiceSection').classList.add('hidden');
  $('learn-panel')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  renderCharacter();
}

function speak(text) {
  if (!('speechSynthesis' in window)) { showToast('這個瀏覽器不支援語音播放'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  u.rate = .8;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

function showToast(msg) {
  const toast = $('toast'); toast.textContent = msg; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function startPractice() {
  practice = { order: shuffle([...Array(weekly.length).keys()]).slice(0, weekly.length), current: 0, score: 0 };
  $('practiceSection').classList.remove('hidden');
  $('practiceSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderPracticeQuestion();
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
function renderPracticeQuestion() {
  const idx = practice.order[practice.current];
  const target = weekly[idx];
  $('practicePrompt').textContent = `這個注音是哪一個字？  ${target.bopomofo}（${target.meaning.replace(/；.*/, '')}）`;
  const others = shuffle(weekly.filter((_, i) => i !== idx).map(x => x.char)).slice(0, 5);
  const choices = shuffle([target.char, ...others]);
  $('practiceChoices').innerHTML = choices.map(char => `<button class="choice-btn" type="button" data-char="${char}">${char}</button>`).join('');
  $('practiceFeedback').textContent = `第 ${practice.current + 1} / ${practice.order.length} 題`;
  $('nextQuestion').classList.add('hidden');
  document.querySelectorAll('.choice-btn').forEach(btn => btn.addEventListener('click', () => answerPractice(btn, target.char)));
}
function answerPractice(btn, answer) {
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  const correct = btn.dataset.char === answer;
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) {
    practice.score++;
    $('practiceFeedback').textContent = '答對了！🎉';
    markCompleted(answer);
    renderWeekMeta(); renderGrid(); renderCharacter();
  } else {
    const right = [...document.querySelectorAll('.choice-btn')].find(b => b.dataset.char === answer);
    if (right) right.classList.add('correct');
    $('practiceFeedback').textContent = `答案是「${answer}」，再看一次筆順吧！`;
  }
  $('nextQuestion').classList.remove('hidden');
}
function nextPractice() {
  practice.current++;
  if (practice.current >= practice.order.length) {
    $('practicePrompt').textContent = `完成！你答對 ${practice.score} / ${practice.order.length} 題。`;
    $('practiceChoices').innerHTML = '';
    $('practiceFeedback').textContent = practice.score === practice.order.length ? '本週 10 字大成功！✨' : '再練一次，會越來越熟。';
    $('nextQuestion').classList.add('hidden');
    return;
  }
  renderPracticeQuestion();
}

$('animateBtn').addEventListener('click', () => writer?.animateCharacter?.() || showToast('筆順工具尚未準備好'));
$('quizBtn').addEventListener('click', () => writer?.quiz?.({ showHintAfterMisses: 2 }) || showToast('筆順工具尚未準備好'));
$('speakBtn').addEventListener('click', () => speak(weekly[selectedIndex].char));
$('markBtn').addEventListener('click', () => {
  const item = weekly[selectedIndex];
  markCompleted(item.char); renderWeekMeta(); renderGrid(); renderCharacter(); showToast(`「${item.char}」已完成 ✓`);
});
$('startPractice').addEventListener('click', startPractice);
$('nextQuestion').addEventListener('click', nextPractice);
$('closePractice').addEventListener('click', () => $('practiceSection').classList.add('hidden'));
$('resetProgress').addEventListener('click', () => {
  if (!confirm('確定要清除這台裝置上的學習紀錄嗎？')) return;
  state = { completed: {}, streakDates: [] }; saveState(); renderWeekMeta(); renderGrid(); renderCharacter(); showToast('學習紀錄已重設');
});

renderWeekMeta();
renderCharacter();
