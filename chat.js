// Kiu 橋仔 — KinBridge's bridge-keeper chat bot (scripted, runs in the browser only)
(function () {
  // ---------- Content ----------
  // Every fact here comes from the site itself. Keep it that way: no invented parents, numbers or studies.
  var PLANKS = [
    { en: { title: 'Pause before you answer', body: 'In one tense moment this week, stop for a breath and ask yourself what your child might be feeling. You don\'t have to fix anything yet. Just notice.', from: 'From Lesson 1: Understanding Your Child\'s Changing Needs' },
      zh: { title: '答之前停一停', body: '今個星期揀一個緊張時刻，先停一停、吸一啖氣，諗吓仔女當刻可能有咩感受。唔使即刻解決，留意到就夠。', from: '出自第一課：了解孩子不斷轉變的需要' } },
    { en: { title: 'Name one effort', body: 'Every day, praise one specific thing your child tried. "You kept going on that maths question" sticks better than "good job".', from: 'From Lesson 2: Encouraging Positive Behaviour' },
      zh: { title: '讚一個努力', body: '每日具體咁讚一樣佢試過嘅嘢。「你嗰條數堅持做到尾」會比「好叻」更入心。', from: '出自第二課：鼓勵正面行為' } },
    { en: { title: 'Keep one calm-down move ready', body: 'Pick one thing that steadies you: a slow breath, a glass of water, a walk to the window. Use it once this week when stress rises, before you respond.', from: 'From Lesson 3: Managing Stress and Strengthening Family Bonds' },
      zh: { title: '準備一招令自己冷靜', body: '揀一樣幫到你定神嘅嘢：慢慢吸一啖氣、飲杯水、行去窗口望吓。今個星期壓力上嚟嗰陣，回應之前用一次。', from: '出自第三課：管理壓力，加強親子關係' } },
    { en: { title: 'Listen without fixing', body: 'Have one conversation where you give no advice at all. Ask, nod, and say back what you heard. That\'s the whole job.', from: 'From Lesson 4: Communicating with Empathy' },
      zh: { title: '淨係聽，唔使搞掂', body: '今個星期試一次完全唔俾意見嘅傾偈。問、點頭、將你聽到嘅講返出嚟，咁就得。', from: '出自第四課：以同理心溝通' } },
    { en: { title: 'When they say "nothing\'s wrong"', body: 'Give space and don\'t push right then. Check in later, calmly, and tell them you\'re there to listen.', from: 'From this week\'s home action' },
      zh: { title: '當佢話「冇嘢呀」', body: '俾啲空間，嗰下唔好追問。遲啲平靜咁再關心吓，話俾佢知你隨時願意聽。', from: '出自本週家居小行動' } }
  ];

  var SCENES = [
    { en: { teaser: 'the dictation went badly',
        setup: '🎭 6:40pm. Your 11-year-old drops their school bag by the door. "Dictation was terrible. Leave me alone."\n\nWhat do you do?\nA) "How bad? Show me the paper."\nB) "OK. I\'m making tea. Come find me if you want to talk."\nC) Say nothing and leave it for tonight.\n\nReply A, B or C',
        A: 'Totally understandable, you care how they did. Right now, though, they\'re upset, and the paper can wait an hour. Asking how they feel first usually gets you the paper later anyway 📄',
        B: 'Kiu\'s pick 🌉 You\'re giving space and leaving the door open. Later, a calm "want to tell me what happened?" often goes further than the paper ever would.',
        C: 'Space is fine, and sometimes it\'s exactly right. Just don\'t let tonight turn into never. A quiet "I\'m here if you want to talk" before bed keeps the bridge open.' },
      zh: { teaser: '默書默得唔好',
        setup: '🎭 晚上 6:40。11 歲嘅仔女一入門就掟低書包：「默書好差呀，唔好理我。」\n\n你會點做？\nA）「差到點？攞張卷俾我睇。」\nB）「好。我沖緊茶，想傾就嚟搵我。」\nC）乜都唔講，今晚由佢。\n\n回覆 A、B 或 C',
        A: '好明白，你緊張佢考成點。不過佢而家好唔開心，張卷遲一個鐘睇都得。先問佢感受，通常遲啲張卷都會自己攞出嚟 📄',
        B: '橋仔之選 🌉 你俾咗空間，又留咗道門。遲啲一句平靜嘅「想唔想講吓發生咩事？」，往往比張卷更有用。',
        C: '俾空間冇問題，有時正正係啱嘅。只係唔好由今晚變成永遠唔提。瞓覺前輕輕講句「想傾隨時搵我」，條橋就仲開住。' } },
    { en: { teaser: '10:30pm and the phone is still on',
        setup: '🎭 10:30pm. The family rule is phones away at 10. Your 14-year-old is still scrolling in bed.\n\nWhat do you do?\nA) Take the phone mid-scroll.\nB) "It\'s past 10. Five minutes to wrap up, then it charges in the kitchen. Anything good tonight?"\nC) Let it slide. They look happy for once.\n\nReply A, B or C',
        A: 'The rule is right, but grabbing the phone usually starts a fight, and nobody remembers the rule after that. A short warning plus the reason keeps the limit without the shouting.',
        B: 'Kiu\'s pick 🌉 A clear rule, a little time to finish, and a warm question at the end. That\'s warmth and structure in one sentence.',
        C: 'Kiu gets it, a happy teenager is precious 🥹 But a rule that only works some nights stops being a rule. Try keeping it tomorrow with a friendly five-minute warning.' },
      zh: { teaser: '十點半仲碌緊手機',
        setup: '🎭 晚上 10:30。屋企規矩係十點收手機，14 歲嘅仔女仲喺床上碌緊。\n\n你會點做？\nA）即刻收咗部手機。\nB）「過咗十點喇。俾你五分鐘收尾，之後放出廳度叉電。今晚有咩好睇？」\nC）算啦，難得佢咁開心。\n\n回覆 A、B 或 C',
        A: '規矩冇錯，但一手搶走通常會變成嗌交，嗌完之後冇人記得規矩係乜。預早提一提再講埋原因，規矩守到又唔使嗌。',
        B: '橋仔之選 🌉 規矩清楚、俾少少時間收尾、最後仲有句關心。一句說話入面有齊溫暖同規範。',
        C: '橋仔明白，見到青少年開心真係難得 🥹 但如果規矩有時得有時唔得，佢就唔再係規矩。聽日試吓用友善嘅五分鐘提示守返佢。' } },
    { en: { teaser: 'Chinese homework tears at 9pm',
        setup: '🎭 9pm. Your 8-year-old is crying over Chinese homework. You got home from work twenty minutes ago and you\'re running on empty.\n\nWhat do you do?\nA) "Stop crying and just finish it."\nB) Take one slow breath first, then sit beside them: "This one\'s hard. Two lines, then a short break."\nC) Write it for them so everyone can sleep.\n\nReply A, B or C',
        A: 'When you\'re exhausted, that line comes out on its own. Kiu has heard it on many a bridge 😅 Next time, try your calm-down move first. It buys you a few seconds to choose what you say.',
        B: 'Kiu\'s pick 🌉 You looked after yourself first, then made a big task small. That helps both of you tonight.',
        C: 'Everyone gets to sleep, which is no small thing! But tomorrow they\'ll face the same homework feeling the same way. Small pieces with breaks teach them they can get through it.' },
      zh: { teaser: '九點仲喊住做中文功課',
        setup: '🎭 晚上 9 點。8 歲嘅仔女做中文功課做到喊。你收工返到屋企先二十分鐘，已經冇晒電。\n\n你會點做？\nA）「唔好喊喇，快啲做埋佢。」\nB）先慢慢吸一啖氣，再坐落佢隔籬：「呢份係難啲。我哋做兩行，之後抖一陣。」\nC）幫佢寫埋，大家早啲瞓。\n\n回覆 A、B 或 C',
        A: '攰到極嗰陣，呢句好自然就衝口而出，橋仔喺好多條橋都聽過 😅 下次試吓先用你嗰招冷靜方法，爭取幾秒時間揀返想講嘅說話。',
        B: '橋仔之選 🌉 你先照顧好自己，再將大任務拆細。今晚對你哋兩個都好。',
        C: '大家有得瞓，都唔係小事！但聽日佢面對同一份功課，感覺都會一樣。拆細做、中間抖吓，可以等佢學識自己捱得過。' } },
    { en: { teaser: '"You never listen!"',
        setup: '🎭 Dinner. You ask about the school trip and your 12-year-old snaps: "You never listen to me anyway!"\n\nWhat do you do?\nA) "Of course I listen! I do everything for you."\nB) "OK. Tell me. I\'ll just listen this time."\nC) "Don\'t talk to me in that tone."\n\nReply A, B or C',
        A: 'It stings, and defending yourself is natural. But then the talk becomes about who\'s right. Saying "tell me" lets them make their point by actually being heard.',
        B: 'Kiu\'s pick 🌉 No arguing, no advice, just room to talk. The tone can wait until things are calm.',
        C: 'Tone matters and it\'s fair to raise it, later. In the heat of it, they mostly hear "I\'m not listening", which was their point 🙈' },
      zh: { teaser: '「你從來都唔聽我講！」',
        setup: '🎭 食飯時間。你問起學校旅行，12 歲嘅仔女突然爆：「你從來都唔聽我講嘢㗎啦！」\n\n你會點做？\nA）「我點會唔聽！我咩都為你做晒。」\nB）「好，你講。今次我淨係聽。」\nC）「唔准用呢個語氣同我講嘢。」\n\n回覆 A、B 或 C',
        A: '聽落好刺耳，想解釋係人之常情。但咁就變咗爭邊個啱。講句「你講」，等佢真係俾人聽到，佢自然唔使再證明。',
        B: '橋仔之選 🌉 唔爭拗、唔俾意見，淨係俾佢講。語氣嘅問題，等大家冷靜咗先再傾。',
        C: '語氣係重要，講出嚟都合理，不過遲啲先講。喺火頭上，佢多數只會聽到「我唔聽你講」，正正就係佢想講嘅嘢 🙈' } }
  ];

  var OFFERS = {
    check: {
      en: { line: '🧭 Free: the 2-minute Parenting Style Snapshot. Six questions, no wrong answers.', cta: 'to try it',
        reply: '🧭 Six quick questions, and you\'ll see where you sit on warmth and structure, plus one thing to try this week.\n\n👉 [Take the 2-minute check](self-check.html)' },
      zh: { line: '🧭 免費：兩分鐘「教養風格快照」。六條問題，冇標準答案。', cta: '試吓',
        reply: '🧭 六條簡單問題，睇吓你喺溫暖同規範之間企喺邊，仲會俾你一樣今個星期可以試嘅嘢。\n\n👉 [做兩分鐘自我檢查](self-check.html)' } },
    talk: {
      en: { line: '🎤 Free 30-minute taster talks at partner centres and roadshows, with a take-home starter pack.', cta: 'to hear more',
        reply: '🎤 Taster talks are free and last 30 minutes. They run at partner centres and roadshows, and you take home a starter pack.\n\n👉 [Register your interest](programme.html#join)' },
      zh: { line: '🎤 免費 30 分鐘體驗講座，喺合作中心同路演舉行，仲有入門資料包帶走。', cta: '了解多啲',
        reply: '🎤 體驗講座免費，30 分鐘，喺合作中心同路演舉行，完咗可以帶走一份入門資料包。\n\n👉 [登記興趣](programme.html#join)' } },
    course: {
      en: { line: '📚 Parenting Foundations: four 90-minute lessons, in person or live online.', cta: 'for the details',
        reply: '📚 Parenting Foundations has four lessons:\n• Understanding Your Child\'s Changing Needs\n• Encouraging Positive Behaviour\n• Managing Stress and Strengthening Family Bonds\n• Communicating with Empathy\n\nEach one is 90 minutes: a real scenario, a short reflection, and one small home goal. HK$1,399 per parent.\n\n👉 [See the programme](programme.html)' },
      zh: { line: '📚 Parenting Foundations：四堂 90 分鐘課堂，可以親身或網上直播上。', cta: '睇詳情',
        reply: '📚 Parenting Foundations 一共四課：\n• 了解孩子不斷轉變的需要\n• 鼓勵正面行為\n• 管理壓力，加強親子關係\n• 以同理心溝通\n\n每堂 90 分鐘：一個真實場景、一段簡短反思、一個家居小目標。每位家長 HK$1,399。\n\n👉 [睇課程](programme.html)' } },
    research: {
      en: { line: '📖 From the research: in a Hong Kong trial, two short positive-parenting talks shifted family outcomes.', cta: 'to read more',
        reply: '📖 That\'s one of the studies behind our approach. Another: a local parent-education programme moved parents towards warm-and-structured parenting and lowered their stress.\n\n👉 [See our approach](approach.html)' },
      zh: { line: '📖 研究話你知：一個香港研究發現，兩次簡短嘅正面教養講座已經可以改善家庭狀況。', cta: '睇多啲',
        reply: '📖 呢個係我哋做法背後嘅研究之一。仲有：一個本地家長教育計劃令家長更接近「溫暖又有規範」嘅教養方式，亦減低咗家長壓力。\n\n👉 [睇我哋嘅方法](approach.html)' } }
  };
  var OFFER_ORDER = ['check', 'talk', 'course', 'research'];

  var T = {
    en: {
      title: 'Kiu · Bridge Post', sub: 'A friendly bot, not a counsellor',
      header: '+-+ 🌉 KinBridge Bridge Post +-+',
      greet: { morning: 'Good morning!', afternoon: 'Good afternoon!', evening: 'Good evening!', late: 'Still up?' },
      intros: [
        'Kiu here, your little bridge-keeper 🧡 I swept the planks and found three things for you this week.',
        'Kiu here 🧡 The river\'s calm today, so I brought you three small things to try.',
        'It\'s Kiu, back from the bridge with a full basket 🧺 Three things for you this week.'
      ],
      crossings: '✨ This week\'s crossings ✨',
      item1: '1️⃣ 🪵 This week\'s plank: {x}\n   ↳ reply 1 to hear more',
      item2: '2️⃣ 🎭 A Hong Kong moment: {x}\n   ↳ reply 2 to play it out',
      item3: '3️⃣ {x}\n   ↳ reply 3 {cta}',
      closers: {
        morning: ['☕ Mornings are busy. Even one plank counts.'],
        evening: ['🌙 Long day? The bridge will still be here tomorrow. You don\'t have to cross it all tonight.'],
        any: ['🧡 Small steps count. Kiu counts every one of them (I keep a little notebook).',
          '🐟 Word from under the bridge: the fish don\'t care about exam results either.']
      },
      footer: 'Reply plank for a home goal · scene to practise a moment · done when you\'ve tried one · 中文 to switch language · pause for a quiet week · stop to opt out.',
      plank: '🪵 Plank #{n} for your bridge: {title}\n\n{body}\n\n({from})\n\nTry it once this week. When you have, reply done and I\'ll nail it to the bridge 🔨',
      done1: '🔨 Plank laid! Your first one is on the bridge.\n\nKiu did a small happy dance on the railing. Reply plank when you\'re ready for the next one.',
      doneN: '🔨 Plank laid! That\'s {n} on your bridge so far.\n\nKiu did a small happy dance on the railing. Reply plank when you\'re ready for the next one.',
      sceneAgain: 'Want another one? Reply scene.',
      form: '📝 To join Parenting Foundations, start with the intake form. It asks about your goals, which sessions you can make and any support you need. Fill it in on screen or print it.\n\n👉 [Download the intake form](KinBridge_Intake_Form_Updated.pdf)\n👉 [How to send it](programme.html#enrol)',
      pay: '💳 Parenting Foundations is HK$1,399 per parent. The ways to pay are on the programme page.\n\n👉 [How to pay](programme.html#payment)',
      help: 'Here\'s what Kiu can do:\n• 1, 2 or 3: open an item from the Bridge Post\n• plank: a small home goal for this week\n• scene: practise a real Hong Kong moment\n• done: tell me you tried your plank\n• post: show this week\'s Bridge Post again\n• enrol: the intake form to join\n• price: course fee and how to pay\n• 中文 / English: switch language\n• pause: a quiet week\n• stop: no more Bridge Posts',
      hello: '👋 Hi! Kiu here. Reply post for this week\'s Bridge Post, or help to see everything I can do.',
      thanks: '🧡 Anytime. Kiu will be on the bridge.',
      pause: '🤫 Quiet week it is. Kiu will tiptoe off and won\'t send a new Bridge Post. Reply hi whenever you\'d like me back.',
      paused: '🤫 Shh, it\'s your quiet week. Reply hi to wake Kiu up.',
      stop: '👋 Understood. No more Bridge Posts from Kiu. If you change your mind, reply start.',
      stopped: 'You\'ve opted out of Bridge Posts. Reply start to get them again.',
      lang: '👍 English it is.',
      unknown: ['Kiu is only a small bridge-keeper and didn\'t catch that 🙈 Try 1, 2, 3, plank, scene or help.',
        'Hmm, that one went over Kiu\'s head (Kiu is quite short). Reply help to see what I can do.'],
      human: 'If it\'s a question about your own family, a person will do better than a bot. Join the waitlist at the bottom of the page and the team can follow up.',
      crisis: '💛 That sounds really hard, and Kiu is only a little bot. Please reach a real person now:\n\n• Emergency: [999](tel:999)\n• 24-hour Mental Health Support Hotline: [18111](tel:18111)\n• The Samaritan Befrienders Hong Kong: [2389 2222](tel:23892222)\n\nYou don\'t have to sort this out alone.',
      teaser: 'Kiu has a Bridge Post for you 🌉',
      placeholder: 'Reply to Kiu…', send: 'Send', open: 'Open Kiu\'s Bridge Post', close: 'Close chat',
      chips: { post: ['1', '2', '3', 'Help'], scene: ['A', 'B', 'C'], plank: ['Done ✅', 'Scene', 'Post'], base: ['Post', 'Plank', 'Scene', '中文'] },
      sends: { 'Help': 'help', 'Done ✅': 'done', 'Scene': 'scene', 'Post': 'post', 'Plank': 'plank' }
    },
    zh: {
      title: '橋仔 · 親橋週報', sub: '友善小機械人，唔係輔導員',
      header: '+-+ 🌉 親橋週報 Bridge Post +-+',
      greet: { morning: '早晨！', afternoon: '午安！', evening: '晚上好！', late: '仲未瞓呀？' },
      intros: [
        '我係守橋嘅橋仔 🧡 啱啱掃完橋板，執到三樣嘢想同你分享。',
        '橋仔又嚟啦 🧡 今日河水好平靜，帶咗三樣小嘢俾你試吓。',
        '橋仔揹住個大籃返嚟喇 🧺 今個星期有三樣嘢俾你。'
      ],
      crossings: '✨ 今個星期過橋小任務 ✨',
      item1: '1️⃣ 🪵 今週木板：{x}\n   ↳ 回覆 1 了解多啲',
      item2: '2️⃣ 🎭 香港家庭小場景：{x}\n   ↳ 回覆 2 一齊試吓',
      item3: '3️⃣ {x}\n   ↳ 回覆 3 {cta}',
      closers: {
        morning: ['☕ 朝早最忙，做到一塊木板都已經好叻。'],
        evening: ['🌙 今日好攰？條橋聽日都仲喺度，唔使一晚行晒。'],
        any: ['🧡 細細步都算數。橋仔每一步都記低晒（我有本細細嘅筆記簿）。',
          '🐟 橋底條魚話：佢都唔理測驗分數㗎。']
      },
      footer: '回覆「木板」攞個家居小目標 · 「場景」練習一個時刻 · 試完回覆「完成」 · English 轉英文 · 「暫停」休息一星期 · 「停止」取消訂閱',
      plank: '🪵 第 {n} 塊木板：{title}\n\n{body}\n\n（{from}）\n\n今個星期試一次。試完回覆「完成」，橋仔幫你釘落條橋度 🔨',
      done1: '🔨 釘好！你第一塊木板已經喺橋上。\n\n橋仔喺欄杆上面跳咗隻開心舞。準備好就回覆「木板」攞下一塊。',
      doneN: '🔨 釘好！你條橋而家有 {n} 塊木板。\n\n橋仔喺欄杆上面跳咗隻開心舞。準備好就回覆「木板」攞下一塊。',
      sceneAgain: '想再試一個？回覆「場景」。',
      form: '📝 想參加 Parenting Foundations，第一步係填登記表格。表格會問你嘅目標、可以出席邊幾堂，同埋你需唔需要額外支援。可以喺螢幕上填，或者印出嚟填。\n\n👉 [下載登記表格](KinBridge_Intake_Form_Updated.pdf)\n👉 [點樣交表](programme.html#enrol)',
      pay: '💳 Parenting Foundations 每位家長 HK$1,399。付款方法喺課程頁。\n\n👉 [點樣付款](programme.html#payment)',
      help: '橋仔識做呢啲嘢：\n• 1、2 或 3：打開週報入面嘅項目\n• 木板：今個星期嘅家居小目標\n• 場景：練習一個香港家庭時刻\n• 完成：話俾我知你試咗\n• 週報：再睇今個星期嘅週報\n• 報名：參加課程嘅登記表格\n• 收費：課程費用同付款方法\n• English / 中文：轉語言\n• 暫停：休息一星期\n• 停止：唔再收週報',
      hello: '👋 你好！我係橋仔。回覆「週報」睇今個星期嘅週報，或者回覆「幫助」睇我識做咩。',
      thanks: '🧡 唔使客氣，橋仔一直喺橋度。',
      pause: '🤫 好，今個星期靜靜哋。橋仔會踮住腳走開，唔會再發新週報。想我返嚟就回覆「你好」。',
      paused: '🤫 噓，今個星期係你嘅安靜週。回覆「你好」叫醒橋仔。',
      stop: '👋 明白，橋仔唔會再發週報。改變主意嘅話回覆「開始」。',
      stopped: '你已經取消咗週報。回覆「開始」可以重新收。',
      lang: '👍 好，之後用中文同你傾。',
      unknown: ['橋仔只係個細細個嘅守橋仔，聽唔明呢句 🙈 試吓回覆 1、2、3、木板、場景或者幫助。',
        '嗯，呢句飛咗過橋仔個頭（橋仔好矮㗎）。回覆「幫助」睇我識做咩。'],
      human: '如果係關於你屋企嘅具體問題，真人會答得好過機械人。喺頁尾加入輪候名單，團隊可以跟進。',
      crisis: '💛 聽落好辛苦，而橋仔只係個細細嘅機械人。請即刻搵真人幫手：\n\n• 緊急情況：[999](tel:999)\n• 24 小時精神健康支援熱線：[18111](tel:18111)\n• 香港撒瑪利亞防止自殺會：[2389 2222](tel:23892222)\n\n你唔使一個人面對。',
      teaser: '橋仔有份週報俾你 🌉',
      placeholder: '回覆橋仔…', send: '傳送', open: '打開橋仔週報', close: '關閉對話',
      chips: { post: ['1', '2', '3', '幫助'], scene: ['A', 'B', 'C'], plank: ['完成 ✅', '場景', '週報'], base: ['週報', '木板', '場景', 'English'] },
      sends: { '完成 ✅': '完成' }
    }
  };

  var KEYS = {
    post: ['post', 'bridge post', 'menu', '週報', '周報'],
    plank: ['plank', 'goal', 'home goal', '木板', '目標'],
    scene: ['scene', 'practice', 'practise', '場景'],
    done: ['done', 'did it', 'tried it', 'i did it', '完成', '做咗', '試咗'],
    help: ['help', '?', '幫助', '幫手', '選單'],
    check: ['check', 'quiz', 'self-check', 'self check', '自我檢查', '測驗'],
    talk: ['talk', 'taster', 'taster talk', '講座'],
    course: ['course', 'programme', 'program', '課程'],
    form: ['form', 'enrol', 'enroll', 'join', 'sign up', 'apply', 'intake', 'intake form', '報名', '表格', '登記表格', '參加'],
    hello: ['hi', 'hello', 'hey', 'hi kiu', 'start', '你好', '哈囉', '開始', '橋仔'],
    thanks: ['thanks', 'thank you', 'thx', 'ty', '多謝', '唔該', '謝謝'],
    pause: ['pause', '暫停'],
    stop: ['stop', 'unsubscribe', '停止'],
    zh: ['中文', '繁體', '廣東話', '粵語', 'cantonese', 'chinese'],
    en: ['english', 'eng', '英文']
  };
  var PRICE_RE = /price|cost|fee|pay|how much|收費|學費|費用|付款|幾錢|價錢/i;
  var CRISIS_RE = /suicid|kill (my|him|her|them)sel|end (my|his|her|their) life|want to die|self[- ]?harm|hurt(ing)? (my|him|her|them)sel|abus(e|ed|ing)|not safe|emergency|自殺|想死|輕生|自殘|傷害自己|虐待|唔安全|不安全|緊急/i;

  // ---------- State ----------
  function load(store, key, fallback) {
    try { var v = JSON.parse(store.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function save(store, key, value) {
    try { store.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  var prefs = load(localStorage, 'kb-chat', {});
  if (!prefs.lang) prefs.lang = 'en';
  prefs.planks = prefs.planks || 0;
  var session = load(sessionStorage, 'kb-chat-session', { log: [], ctx: null, plankIdx: null });

  var week = Math.floor((Date.now() - Date.UTC(2026, 0, 5)) / 604800000);
  function mod(n, m) { return ((n % m) + m) % m; }
  var weekPlank = mod(week, PLANKS.length);
  var weekScene = mod(week, SCENES.length);
  var weekOffer = OFFER_ORDER[mod(week, OFFER_ORDER.length)];
  if (session.plankIdx == null) session.plankIdx = weekPlank;

  function t() { return T[prefs.lang]; }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function fill(s, vars) { return s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }); }
  function partOfDay() {
    var h = new Date().getHours();
    return h >= 5 && h < 12 ? 'morning' : h < 18 && h >= 12 ? 'afternoon' : h < 23 && h >= 18 ? 'evening' : 'late';
  }

  // ---------- Messages ----------
  function bridgePost() {
    var s = t(), when = partOfDay();
    var closers = s.closers.any.concat(when === 'morning' ? s.closers.morning : when === 'evening' || when === 'late' ? s.closers.evening : []);
    var offer = OFFERS[weekOffer][prefs.lang];
    return [
      s.header,
      s.greet[when] + ' ' + pick(s.intros),
      '',
      s.crossings,
      fill(s.item1, { x: PLANKS[weekPlank][prefs.lang].title }),
      fill(s.item2, { x: SCENES[weekScene][prefs.lang].teaser }),
      fill(s.item3, { x: offer.line, cta: offer.cta }),
      '',
      pick(closers),
      '',
      s.footer
    ].join('\n');
  }
  function plankMsg(i) {
    var p = PLANKS[i][prefs.lang];
    return fill(t().plank, { n: prefs.planks + 1, title: p.title, body: p.body, from: p.from });
  }

  function respond(raw) {
    var s = t();
    var text = raw.trim().replace(/[「」"']/g, '').replace(/[！!。.，,]+$/, '');
    var norm = text.toLowerCase().replace(/[１２３]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); });
    function is(key) { return KEYS[key].indexOf(norm) !== -1; }

    if (CRISIS_RE.test(text)) return { text: s.crisis, chips: null };

    if (prefs.stopped) {
      if (is('hello')) { prefs.stopped = false; prefs.paused = false; return { text: bridgePost(), ctx: 'post', chips: 'post' }; }
      return { text: s.stopped, chips: null };
    }

    if (session.ctx && session.ctx.indexOf('scene:') === 0 && /^[abc]$/.test(norm)) {
      var sc = SCENES[+session.ctx.split(':')[1]][prefs.lang];
      return { text: sc[norm.toUpperCase()] + '\n\n' + s.sceneAgain, ctx: null, chips: 'base' };
    }
    if (/^[123]$/.test(norm)) {
      if (norm === '1') { session.plankIdx = weekPlank; return { text: plankMsg(weekPlank), ctx: 'plank', chips: 'plank' }; }
      if (norm === '2') { session.lastScene = weekScene; return { text: SCENES[weekScene][prefs.lang].setup, ctx: 'scene:' + weekScene, chips: 'scene' }; }
      return { text: OFFERS[weekOffer][prefs.lang].reply, ctx: null, chips: 'base' };
    }

    if (is('zh') || is('en')) {
      prefs.lang = is('zh') ? 'zh' : 'en';
      return { text: T[prefs.lang].lang + '\n\n' + bridgePost(), ctx: 'post', chips: 'post' };
    }
    if (is('hello') || is('post')) { prefs.paused = false; return { text: is('hello') && !is('post') ? s.hello + '\n\n' + bridgePost() : bridgePost(), ctx: 'post', chips: 'post' }; }
    if (is('plank')) {
      session.plankIdx = mod(session.plankIdx + (session.ctx === 'plank' ? 1 : 0), PLANKS.length);
      return { text: plankMsg(session.plankIdx), ctx: 'plank', chips: 'plank' };
    }
    if (is('scene')) {
      // This week's scene first, then any other scene except the one just played.
      var next = session.lastScene == null ? weekScene
        : mod(session.lastScene + 1 + Math.floor(Math.random() * (SCENES.length - 1)), SCENES.length);
      session.lastScene = next;
      return { text: SCENES[next][prefs.lang].setup, ctx: 'scene:' + next, chips: 'scene' };
    }
    if (is('done')) {
      prefs.planks += 1;
      return { text: prefs.planks === 1 ? s.done1 : fill(s.doneN, { n: prefs.planks }), ctx: 'plank', chips: 'base' };
    }
    if (is('help')) return { text: s.help, ctx: null, chips: 'base' };
    if (is('check') || is('talk') || is('course')) {
      var key = is('check') ? 'check' : is('talk') ? 'talk' : 'course';
      return { text: OFFERS[key][prefs.lang].reply, ctx: null, chips: 'base' };
    }
    if (is('form')) return { text: s.form, ctx: null, chips: 'base' };
    if (PRICE_RE.test(text)) return { text: s.pay, ctx: null, chips: 'base' };
    if (is('thanks')) return { text: s.thanks, chips: 'base' };
    if (is('pause')) { prefs.paused = true; return { text: s.pause, ctx: null, chips: null }; }
    if (is('stop')) { prefs.stopped = true; return { text: s.stop, ctx: null, chips: null }; }

    return { text: pick(s.unknown) + (text.length > 40 ? '\n\n' + s.human : ''), chips: 'base' };
  }

  // ---------- UI ----------
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bridgeIcon = '<svg width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M3 20H33"/><path d="M7 20Q18 6 29 20"/><path d="M7 20V29M29 20V29"/><path d="M12.5 14.8V20M18 13V20M23.5 14.8V20"/></svg>';

  var root = document.createElement('div');
  root.className = 'kb-chat';
  root.innerHTML =
    '<button class="kb-chat-teaser" type="button" hidden></button>' +
    '<section class="kb-chat-panel" role="dialog" aria-labelledby="kb-chat-title" hidden>' +
      '<header class="kb-chat-head"><span class="kb-chat-avatar">' + bridgeIcon + '</span>' +
        '<div><div class="kb-chat-title" id="kb-chat-title"></div><div class="kb-chat-sub"></div></div>' +
        '<button class="kb-chat-close" type="button">×</button></header>' +
      '<div class="kb-chat-log" aria-live="polite"></div>' +
      '<div class="kb-chat-chips"></div>' +
      '<form class="kb-chat-form"><input type="text" autocomplete="off" maxlength="300"><button type="submit"></button></form>' +
    '</section>' +
    '<button class="kb-chat-launcher" type="button" aria-expanded="false">' + bridgeIcon + '<span class="kb-chat-dot" aria-hidden="true"></span></button>';
  document.body.appendChild(root);

  var panel = root.querySelector('.kb-chat-panel');
  var log = root.querySelector('.kb-chat-log');
  var chipsEl = root.querySelector('.kb-chat-chips');
  var form = root.querySelector('.kb-chat-form');
  var input = form.querySelector('input');
  var launcher = root.querySelector('.kb-chat-launcher');
  var teaser = root.querySelector('.kb-chat-teaser');
  var dot = root.querySelector('.kb-chat-dot');
  var busy = false;

  function applyLang() {
    var s = t();
    root.querySelector('.kb-chat-title').textContent = s.title;
    root.querySelector('.kb-chat-sub').textContent = s.sub;
    root.querySelector('.kb-chat-close').setAttribute('aria-label', s.close);
    input.placeholder = s.placeholder;
    input.setAttribute('aria-label', s.placeholder);
    form.querySelector('button').textContent = s.send;
    launcher.setAttribute('aria-label', s.open);
    teaser.textContent = s.teaser;
    panel.setAttribute('lang', prefs.lang === 'zh' ? 'zh-HK' : 'en');
  }

  // Bot text may contain [label](href) links; everything else is set as plain text.
  function renderText(el, text) {
    var re = /\[([^\]]+)\]\(([^)\s]+)\)/g, last = 0, m;
    while ((m = re.exec(text))) {
      el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement('a');
      a.href = m[2];
      a.textContent = m[1];
      el.appendChild(a);
      last = re.lastIndex;
    }
    el.appendChild(document.createTextNode(text.slice(last)));
  }
  function addBubble(who, text) {
    var b = document.createElement('div');
    b.className = 'kb-msg ' + who;
    if (who === 'bot') renderText(b, text); else b.textContent = text;
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
  }
  function setChips(kind) {
    chipsEl.innerHTML = '';
    if (!kind) return;
    var s = t();
    s.chips[kind].forEach(function (label) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'kb-chip';
      c.textContent = label;
      c.addEventListener('click', function () { send((s.sends && s.sends[label]) || label); });
      chipsEl.appendChild(c);
    });
  }
  function persist() {
    session.log = session.log.slice(-60);
    save(sessionStorage, 'kb-chat-session', session);
    save(localStorage, 'kb-chat', prefs);
  }

  function botSay(reply) {
    busy = true;
    setChips(null);
    var typing = document.createElement('div');
    typing.className = 'kb-msg bot kb-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    var delay = reduceMotion ? 0 : Math.min(1400, 450 + reply.text.length * 3);
    setTimeout(function () {
      typing.remove();
      if ('ctx' in reply) session.ctx = reply.ctx;
      session.chips = reply.chips;
      session.log.push({ who: 'bot', text: reply.text });
      addBubble('bot', reply.text);
      setChips(reply.chips);
      applyLang();
      persist();
      busy = false;
    }, delay);
  }

  function send(text) {
    text = String(text).trim();
    if (!text || busy) return;
    session.log.push({ who: 'user', text: text });
    addBubble('user', text);
    botSay(respond(text));
  }

  function open() {
    panel.hidden = false;
    teaser.hidden = true;
    dot.hidden = true;
    launcher.setAttribute('aria-expanded', 'true');
    session.opened = true;
    if (!session.log.length) {
      var s = t();
      if (prefs.stopped) botSay({ text: s.stopped, chips: null });
      else if (prefs.paused) botSay({ text: s.paused, chips: null });
      else botSay({ text: bridgePost(), ctx: 'post', chips: 'post' });
    }
    persist();
    input.focus();
  }
  function close() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', function () { panel.hidden ? open() : close(); });
  teaser.addEventListener('click', open);
  root.querySelector('.kb-chat-close').addEventListener('click', close);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send(input.value);
    input.value = '';
  });

  // Restore this tab's conversation so it carries across pages.
  applyLang();
  session.log.forEach(function (m) { addBubble(m.who, m.text); });
  setChips(session.chips || null);
  if (session.opened || prefs.stopped) dot.hidden = true;
  if (!session.opened && !prefs.stopped && !prefs.paused && !session.teased) {
    setTimeout(function () {
      if (!panel.hidden) return;
      teaser.hidden = false;
      session.teased = true;
      persist();
    }, 5000);
  }
})();
