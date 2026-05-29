/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GrammarLesson, QuizQuestion } from '../types';

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'present-simple',
    title: 'Present Simple',
    titleUz: 'Hozirgi Oddiy Zamon',
    shortDescUz: 'Doimiy odatlar, takrorlanuvchi harakatlar va umumiy haqiqatlar uchun qo\'llaniladi.',
    formula: 'Darak: S + V(-s/-es)  |  Inkor: S + do/does + not + V  |  So\'roq: Do/Does + S + V?',
    explanationUz: `
- **Qachon ishlatiladi?**
  1. Hamma vaqt to'g'ri bo'lgan umumiy faktlar (masalan: *Quyosh sharqdan chiqadi*).
  2. Kunlik odatlar va takrorlanib turadigan ishlar (masalan: *Men har kuni ertalab soat 7 da turaman*).
  3. Rejalashtirilgan jadvallar (poyezd, dars jadvallari).

- **Fe'lga '-s' yoki '-es' qo'shish qoidasi:**
  - Faqatgina uchinchi shaxs birlikda (**He, She, It**) darak gapda fe'l oxiriga **-s** yoki **-es** qo'shiladi.
  - Oxiri *ch, sh, ss, x, o, z* bilan tugasa: **-es** qo'shiladi (masalan: *watch -> watches*, *go -> goes*).
  - Oxiri *undosh + y* bilan tugasa, *y* harfi **ies** ga o'zgaradi (masalan: *study -> studies*).

- **Yordamchi fe'llar:**
  - **Do / Don't** -> I, We, You, They uchun.
  - **Does / Doesn't** -> He, She, It uchun.
    *Eslatma: Inkor va so'roq gaplarda 'does' ishlatilganda fe'ldagi '-s' qo'shimchasi tushib qoladi!*
    `,
    examples: [
      { english: 'I drink water every day.', uzbek: 'Men har kuni suv ichaman.', description: 'Doimiy kunlik odat' },
      { english: 'She speaks English very well.', uzbek: 'U ingliz tilida juda yaxshi gapiradi.', description: 'Uchinchi shaxs darak gap: speak + S' },
      { english: 'They do not live in London.', uzbek: 'Ular Londonda yashamaydilar.', description: 'Kishi birligi/ko\'pligi inkor shakli' },
      { english: 'Does he like eating apples?', uzbek: 'U olma yeyishni yoqtiradimi?', description: 'So\'roq gapda yordamchi does oldinga chiqadi' }
    ],
    commonTimeExpressionsUz: ['every day (har kuni)', 'always (doimo)', 'usually (odatda)', 'often (tez-tez)', 'sometimes (ba\'zida)', 'never (hech qachon)']
  },
  {
    id: 'past-simple',
    title: 'Past Simple',
    titleUz: 'O\'tgan Oddiy Zamon',
    shortDescUz: 'O\'tmishda tugallangan, ma\'lum bir vaqtda sodir bo\'lgan harakatlar uchun qo\'llaniladi.',
    formula: 'Darak: S + V2 / V-ed  |  Inkor: S + did not + V1  |  So\'roq: Did + S + V1?',
    explanationUz: `
- **Qachon ishlatiladi?**
  - O'tmishda tugagan va o'tmish dagi ma'lum bir vaqtga bog'liq bo'lgan ish-harakatlarni ifodalashda.

- **To'g'ri va Noto'g'ri fe'llar (Regular and Irregular Verbs):**
  1. **To'g'ri fe'llar (Regular):** Darak gapda fe'l oxiriga **-ed** qo'shiladi (masalan: *play -> played*, *watch -> watched*, *work -> worked*).
  2. **Noto'g'ri fe'llar (Irregular):** Bular qoida bo'yicha o'zgarmasdan, butunlay o'zgarib ketadi. Bularni yodlash kerak (Irregular Verbs list - V2 shakli, masalan: *go -> went*, *write -> wrote*, *eat -> ate*).

- **Yordamchi fe'l:**
  - Barcha shaxslar (I, He, She, It, We, You, They) uchun inkor va so'roq gaplarda yagona **Did / Didn't** yordamchi fe'li ishlatiladi.
    *Eslatma: Inkor va so'roq gaplarda 'did/didn't' ishlatilganda, asliy fe'l o'zining V1 (boshlang'ich) shakliga qaytadi!*
    `,
    examples: [
      { english: 'We went to Samarkand last week.', uzbek: 'Biz o\'tgan hafta Samarqandga bordik.', description: '"Go" fe\'lining o\'tgan zamoni "went"' },
      { english: 'He did not watch the soccer match yesterday.', uzbek: 'U kecha futbol o\'yinini tomosha qilmadi.', description: 'Inkor shakl: didn\'t + watch(V1)' },
      { english: 'Did you finish your homework?', uzbek: 'Siz uy vazifangizni tugatdingizmi?', description: 'So\'roq gap: did oldinda, fe\'l asliy shaklda' },
      { english: 'She cooked a delicious pilaf yesterday.', uzbek: 'U kecha mazali palov pishirdi.', description: 'To\'g\'ri fe\'lga "-ed" qo\'shimchasi' }
    ],
    commonTimeExpressionsUz: ['yesterday (kecha)', 'last week / year (o\'tgan hafta / yil)', 'two days ago (ikki kun avval)', 'in 2024 (2024-yilda)']
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    titleUz: 'Hozirgi Davomli Zamon',
    shortDescUz: 'Aynan gapirilayotgan lahzada davom etayotgan yoki vaqtinchalik harakatlar uchun qo\'llaniladi.',
    formula: 'Darak: S + am/is/are + V-ing  |  Inkor: S + am/is/are + not + V-ing  |  So\'roq: Am/Is/Are + S + V-ing?',
    explanationUz: `
- **Qachon ishlatiladi?**
  1. Hozir, ya'ni aynan gapirilayotgan paytda sodir bo'layotgan ish-harakatlar (masalan: *Men dars qilyapman*).
  2. Shu kunlarda amalga oshirilayotgan vaqtinchalik vaziyatlar (masalan: *Men shu hafta do'stimnikida yashayapman*).
  3. Kelajakda aniq belgilangan va rejalashtirilgan ishlar (masalan: *Ertaga uchib ketyapman*).

- **To-be Fe'lining shaxslarga taqsimlanishi:**
  - **I** -> **am** (I'm)
  - **He, She, It** -> **is** (He's / She's / It's)
  - **We, You, They** -> **are** (We're / You're / They're)

- **Fe'l oxiriga -ing qo'shilishi qoidalari:**
  - Oxiri *e* bilan tugasa, *e* tushib qoladi (masalan: *write -> writing*).
  - Oxiri qisqa unli + undosh bilan tugasa, oxirgi undosh ikkilanishi mumkin (masalan: *run -> running*, *swim -> swimming*).
    `,
    examples: [
      { english: 'Look! The white bird is flying.', uzbek: 'Qarang! Oq qush uchmoqda.', description: 'Hozir sodir bo\'layotgan harakat' },
      { english: 'They are studying for their midterm exams.', uzbek: 'Ular oraliq imtihonlari uchun tayyorlanyaptilar (shu kunlarda).', description: 'Hozirgi davr ichidagi vaqtinchalik harakat' },
      { english: 'I am not playing computer games right now.', uzbek: 'Men hozir kompyuter o\'yinlari o\'ynamayapman.', description: 'Inkor shakl: am not + V-ing' },
      { english: 'Are you listening to the teacher?', uzbek: 'Siz o\'qituvchini eshityapsizmi?', description: 'So\'roq shakl' }
    ],
    commonTimeExpressionsUz: ['now (hozir)', 'right now (aynan hozir)', 'at the moment (aynan shu lahzada)', 'Look! (Qarang!)', 'Listen! (Eshiting!)']
  },
  {
    id: 'master-mix',
    title: 'Master Challenge',
    titleUz: 'Murakkab Zamonlar & Faktlar',
    shortDescUz: 'Stative (holat) fe\'llari, jadvalli kelajak, va murakkab Present Simple / Continuous / Past Simple aralashmalari.',
    formula: 'Stative verbs: no Continuous | Schedules: Present Simple | Contrast: Permanent vs Temporary',
    explanationUz: `
- **Master Qoidalari (Advanced Rules):**
  1. **Stative Verbs (Holat fe'llari):** *know, think (fikr bildirsa), believe, love, hate, taste (ta'mga ega bo'lsa)* kabi fe'llar harakat davom etayotgan bo'lsa ham unga **-ing** qo'shilmaydi va oddiy zamonda yoziladi.
     - *To'g'ri:* I think it is a good idea. (Men shunday deb fikrlayapman)
     - *Noto'g'ri:* I am thinking it is a good idea.
     - *Eslatma (Dynamic use):* Agar "think" rejalashtirish yoki chuqur o'ylash jarayoni ma'nosida kelsa, **-ing** qo'shiladi: *I am thinking of going to Samarqand.* (O'ylayapman, miyamda rejalashtiryapman).
  2. **Jadval va Rejalar (Timetables):** Jamoat transporti, poyezdlar, darslar jadvallari va rasmiy tadbirlar kelajakka tegishli bo'lsa ham **Present Simple** da beriladi.
     - *To'g'ri:* The play starts at 7 PM tomorrow.
  3. **Continuous Zamonlar bilan "always":** Agar biror odat zerikarli, asabga teguvchi bo'lsa va norozilik bildirsa, Present Continuous zamoni "always" bilan qo'llanadi.
     - *Misol:* She is always losing her keys! (U doim kalitlarini yo'qotib yuradi-ya, asabni buzib!)
    `,
    examples: [
      { english: 'The train leaves at 8:00 AM tomorrow.', uzbek: 'Poyezd ertaga ertalab soat 8:00 da jo\'naydi.', description: 'Kelajak jadvali bo\'lgani uchun Present Simple.' },
      { english: 'This milk tastes sour.', uzbek: 'Bu sut achchiq ta\'m beryapti (achib qolibdi).', description: 'Taste - hid yoki ta\'m sezish holat fe\'li.' },
      { english: 'I am thinking about my exams right now.', uzbek: 'Hozir aynan imtihonlarim haqida miyamda o\'ylayapman.', description: 'Think rejalashtirish yoki fikrlash jarayoni sifatida faol (dynamic).' },
      { english: 'He is always talking loudly in class!', uzbek: 'U doim darsda baland ovozda gapiradi (asabga tegib)!', description: 'Qayta-qayta takrorlanuvchi zerikarli odat Continuous shaklida.' }
    ],
    commonTimeExpressionsUz: ['think of/about', 'timetables (jadvallar)', 'always (norozilik bilan)', 'stative context']
  }
];

export const quizzesData: Record<string, QuizQuestion[]> = {
  'present-simple': [
    {
      id: 'ps1',
      question: 'She ___ her teeth twice a day.',
      options: ['brush', 'brushes', 'brushing', 'brushed'],
      correctAnswer: 'brushes',
      explanation: "Uchinchi shaxs birlikda (She/He/It) darak gapda fe'l oxiriga '-s' yoki '-es' qo'shiladi. 'Brush' fe'li '-sh' bilan tugagani uchun '-es' qo'shilib 'brushes' bo'ladi."
    },
    {
      id: 'ps2',
      question: 'They ___ not play soccer on rainy days.',
      options: ['does', 'do', 'doing', 'are'],
      correctAnswer: 'do',
      explanation: "They (Ular) ko'plikda bo'lgani uchun inkor gapda 'do not' (don't) ishlatiladi. 'Does' esa faqat he, she, it uchun qo'llaniladi."
    },
    {
      id: 'ps3',
      question: '___ your brother work in this big hospital?',
      options: ['Do', 'Is', 'Does', 'Are'],
      correctAnswer: 'Does',
      explanation: "'Your brother' (Sizning akangiz/ukangiz) uchinchi shaxs u (He) hisoblanadi. Shuning uchun so'roq gap boshida 'Does' ishlatiladi."
    },
    {
      id: 'ps4',
      question: 'Water ___ at 100 degrees Celsius.',
      options: ['boil', 'boils', 'is boiling', 'boiled'],
      correctAnswer: 'boils',
      explanation: "Suv qaynashi (Water boils) - ilmiy va umumiy fakt. Umumiy faktlar har doim Present Simple'da beriladi va Water birlikda bo'lgani uchun fe'lga '-s' qo'shiladi."
    },
    {
      id: 'ps5',
      question: 'We usually ___ our relatives on Sundays.',
      options: ['visit', 'visits', 'visiting', 'visited'],
      correctAnswer: 'visit',
      explanation: "'We' (Biz) uchun Present Simple darak gapida fe'l o'zgarishsiz, asliy shaklda (visit) qoladi. '-s' qo'shimchasi qo'shilmaydi."
    },
    {
      id: 'ps6',
      question: 'What time ___ the bank open in Tashkent?',
      options: ['is', 'do', 'does', 'doing'],
      correctAnswer: 'does',
      explanation: "'The bank' (bank - u/it) birlikda bo'lgani uchun maxsus so'roq gapda 'does' yordamchi fe'li ishlatiladi: 'What time does the bank open?'"
    },
    {
      id: 'ps7',
      question: 'I ___ drink coffee. I do not like the bitter taste.',
      options: ['always', 'usually', 'often', 'never'],
      correctAnswer: 'never',
      explanation: "Gapning ikkinchi qismida 'menga taxir ta'm yoqmaydi' deyilgan. Demak, ma'nodan kelib chiqib 'hech qachon' (never) so'zi to'g'ri keladi."
    },
    {
      id: 'ps8',
      question: 'My father ___ his car every Saturday morning.',
      options: ['wash', 'washes', 'washing', 'washed'],
      correctAnswer: 'washes',
      explanation: "Uchinchi shaxs birlikda (My father - he) darak gapda fe'l oxiriga '-es' qo'shiladi: 'washes'."
    },
    {
      id: 'ps9',
      question: 'Do you ___ to school by bus or on foot?',
      options: ['go', 'goes', 'going', 'went'],
      correctAnswer: 'go',
      explanation: "So'roq gapda 'Do' yordamchi fe'li ishlatilganda asosiy fe'l o'zining boshlang'ich shaklida (go) qoladi."
    },
    {
      id: 'ps10',
      question: 'Cats ___ mice. It is their natural nature.',
      options: ['chases', 'chasing', 'chase', 'chased'],
      correctAnswer: 'chase',
      explanation: "Cats (Mushuklar) ko'plikda bo'lgani uchun Present Simple darak gapida fe'l o'zgarishsiz 'chase' shaklida bo'ladi."
    }
  ],
  'past-simple': [
    {
      id: 'pas1',
      question: 'Last night, we ___ a very interesting English movie.',
      options: ['watch', 'watched', 'watches', 'watching'],
      correctAnswer: 'watched',
      explanation: "'Last night' (o'tgan kecha) o'tgan zamon kalit so'zi hisoblanadi. 'Watch' to'g'ri fe'l bo'lgani sababli oxiriga '-ed' olib 'watched' shaklini hosil qiladi."
    },
    {
      id: 'pas2',
      question: 'Where ___ you spend your summer holidays last year?',
      options: ['did', 'do', 'does', 'were'],
      correctAnswer: 'did',
      explanation: "O'tgan zamondagi so'roq gaplarda barcha shaxslar uchun yordamchi fe'l sifatida 'did' ishlatiladi: 'Where did you spend...?'"
    },
    {
      id: 'pas3',
      question: 'She ___ her keys on the office table yesterday.',
      options: ['leave', 'left', 'leaved', 'leaves'],
      correctAnswer: 'left',
      explanation: "'Leave' (tashlab ketish/qoldirish) noto'g'ri fe'l bo'lib, uning o'tgan zamon shakli (V2) 'left' hisoblanadi."
    },
    {
      id: 'pas4',
      question: 'I did not ___ my homework yesterday because I was ill.',
      options: ['do', 'did', 'done', 'doing'],
      correctAnswer: 'do',
      explanation: "Inkor gapda 'did not' yordamchi fe'lidan keyin asosiy fe'l asliy o'zgarishsiz V1 shaklida keladi. Shuning uchun 'did not do' to'g'ri."
    },
    {
      id: 'pas5',
      question: 'They ___ a new house in Tashkent three years ago.',
      options: ['buy', 'buyed', 'bought', 'buying'],
      correctAnswer: 'bought',
      explanation: "'Buy' (sotib olmoq) noto'g'ri fe'l bo'lib, uning o'tgan zamon (V2) shakli 'bought' (sotib oldi) shaklida bo'ladi."
    },
    {
      id: 'pas6',
      question: 'He ___ at school yesterday. He was sick.',
      options: ['was not', 'did not', 'were not', 'is not'],
      correctAnswer: 'was not',
      explanation: "Bo'lish holati bayon qilinganda o'tgan zamonda to-be ning 'was/were' shakli ishlatiladi. 'He' uchun 'was not' (wasn't) to'g'ri."
    },
    {
      id: 'pas7',
      question: 'Where ___ you yesterday afternoon?',
      options: ['did', 'were', 'was', 'are'],
      correctAnswer: 'were',
      explanation: "Kecha tushdan keyin qayerda edingiz? Harakat fe'li bo'lmagani sababli to-be fe'lining 'you'ga mos o'tgan shakli 'were' bo'ladi."
    },
    {
      id: 'pas8',
      question: 'We ___ an exciting game of chess two hours ago.',
      options: ['play', 'played', 'playing', 'plays'],
      correctAnswer: 'played',
      explanation: "'Two hours ago' (ikki soat avval) o'tgan zamon kalit so'zi hisoblanadi. 'Play' to'g'ri fe'l bo'lgani uchun oxiriga '-ed' qo'shiladi."
    },
    {
      id: 'pas9',
      question: 'She did not ___ the telephone when it rang.',
      options: ['answer', 'answered', 'answering', 'answers'],
      correctAnswer: 'answer',
      explanation: "Inkor gapdagi 'did not' yordamchi fe'lidan keyin har doim fe'l boshlang'ich (V1) shaklida ya'ni '-ed'siz kept qilinadi: 'answer'."
    },
    {
      id: 'pas10',
      question: 'My uncle ___ English ten years ago, but now he is fluent.',
      options: ['not speak', 'did not speak', 'didn\'t spoke', 'doesn\'t speak'],
      correctAnswer: 'did not speak',
      explanation: "'Ten years ago' o'tgan zamonni anglatadi va uning inkor shakli 'did not speak' (did not + V1) bo'ladi."
    }
  ],
  'present-continuous': [
    {
      id: 'pc1',
      question: 'Listen! My sister ___ a beautiful song in the room.',
      options: ['sings', 'sing', 'is singing', 'sang'],
      correctAnswer: 'is singing',
      explanation: "'Listen!' (Eshiting!) buyruq gapi hozir sodir bo'layotgan harakatga ishora qiladi. Shuning uchun Present Continuous (is singing) ishlatiladi."
    },
    {
      id: 'pc2',
      question: 'We ___ studying for the English exam at the moment.',
      options: ['is', 'are', 'am', 'be'],
      correctAnswer: 'are',
      explanation: "'We' (Biz) ko'plikda bo'lgani uchun hozirgi davomli zamonda 'are' yoziladi: 'We are studying...'"
    },
    {
      id: 'pc3',
      question: 'Why ___ you crying? Is everything okay?',
      options: ['is', 'do', 'did', 'are'],
      correctAnswer: 'are',
      explanation: "'You' shaxsi oldidan Present Continuous so'roq gapida to-be fe'lining 'are' shakli qo'llaniladi: 'Why are you crying?'"
    },
    {
      id: 'pc4',
      question: 'Look at them! They ___ running in the soccer field.',
      options: ['is', 'does', 'are', 'am'],
      correctAnswer: 'are',
      explanation: "They (Ular) ko'pligi uchun to-be ning 'are' shakli Present Continuous da ishlatiladi."
    },
    {
      id: 'pc5',
      question: 'I ___ not reading any book right now, I am resting.',
      options: ['is', 'am', 'are', 'do'],
      correctAnswer: 'am',
      explanation: "'I' (Men) uchinchi yoki boshqa emas, birinchi shaxs birlik bo'lib, unga faqat 'am' sherik bo'ladi: 'I am not reading...'"
    },
    {
      id: 'pc6',
      question: 'Wait! The train is ___ at the station now.',
      options: ['arrives', 'arrived', 'arriving', 'arrive'],
      correctAnswer: 'arriving',
      explanation: "Olingan 'is' yordamchi fe'lidan so'ng davomiy harakatni bildirish uchun asosiy fe'lga '-ing' qo'shimchasi qo'shiladi. 'Arrive' oxiridagi 'e' tushib qolib 'arriving' bo'ladi."
    },
    {
      id: 'pc7',
      question: 'Please be quiet! The baby ___ now.',
      options: ['sleep', 'sleeps', 'is sleeping', 'slept'],
      correctAnswer: 'is sleeping',
      explanation: "'Please be quiet!' (Iltimos tinchlaning!) va 'now' (hozir) gap so'zlayotgan vaqtda bolaning uxlayotganini (is sleeping) bildiradi."
    },
    {
      id: 'pc8',
      question: 'Look! It ___ outside. Take an umbrella with you.',
      options: ['rains', 'is raining', 'rained', 'rain'],
      correctAnswer: 'is raining',
      explanation: "'Look!' (Qarang!) undov so'zi asosan hozir sodir bo'layotgan ish-harakatlar (is raining) bilan ishlatiladi."
    },
    {
      id: 'pc9',
      question: 'I am ___ for my friend at the bus stop.',
      options: ['wait', 'waits', 'waiting', 'waited'],
      correctAnswer: 'waiting',
      explanation: "Hozirgi davomli zamonda to-be ('am') fe'lidan keyin fe'lga '-ing' qo'shiladi: 'waiting'."
    },
    {
      id: 'pc10',
      question: 'What ___ they doing in the garden right now?',
      options: ['is', 'do', 'dids', 'are'],
      correctAnswer: 'are',
      explanation: "Ko'plikdagi 'they' olmoshi hamda 'right now' (aynan hozir) so'zi uchun Present Continuous so'rog'ida 'are' javobi to'g'ri keladi."
    }
  ],
  'master-mix': [
    {
      id: 'mm1',
      question: 'We ________ any problems with the app at the moment.',
      options: ['do not have', 'are not having', 'does not have', 'not having'],
      correctAnswer: 'do not have',
      explanation: "'Have' fe'li egalik qilish ma'nosida (mening borim degan ma'noda) stative (holat) fe'lidir, shuning uchun 'at the moment' bo'lsa ham Present Simple'da bo'ladi."
    },
    {
      id: 'mm2',
      question: 'The flight to London ________ at exactly 9:45 PM tomorrow night.',
      options: ['is departing', 'departs', 'will departed', 'departing'],
      correctAnswer: 'departs',
      explanation: "Poyezd, samolyot va boshqa rasmiy jadvallar (timetables) kelajakka tegishli bo'lsa ham Present Simple'da yoziladi (departs)."
    },
    {
      id: 'mm3',
      question: 'I honestly ________ that he is telling the absolute truth.',
      options: ['believe', 'am believing', 'believes', 'believed'],
      correctAnswer: 'believe',
      explanation: "'Believe' (ishonmoq) aqliy munosabatni ifodalovchi holat fe'lidir. Hech qachon davomli (Continuous) zamonlarda qo'llanilmaydi."
    },
    {
      id: 'mm4',
      question: 'Why are you so late? Our boss ________ for you for over an hour!',
      options: ['waits', 'is waiting', 'wait', 'waited'],
      correctAnswer: 'is waiting',
      explanation: "Hozirgi paytdagi jiddiy va davom etayotgan jarayonni urg'ulash uchun Present Continuous (is waiting) tanlanadi."
    },
    {
      id: 'mm5',
      question: 'Be quiet! I ________ of a solution to this difficult math problem.',
      options: ['think', 'am thinking', 'thinks', 'thought'],
      correctAnswer: 'am thinking',
      explanation: "Bu yerda 'think' - boshda rejalashtirish yoki faol fikrlash jarayonini (dynamic action) bildirmoqda. Shuning uchun '-ing' qo'shila oladi."
    },
    {
      id: 'mm6',
      question: 'This delicious strawberry soup ________ so sweet and fresh!',
      options: ['tastes', 'is tasting', 'taste', 'tasted'],
      correctAnswer: 'tastes',
      explanation: "'Taste' fe'li o'zi ma'lum bir ta'mga ega ekanligini ifodalasa, u holat fe'lidir (tastes) va Continuous'da ishlatilmaydi."
    },
    {
      id: 'mm7',
      question: 'Stop doing that! You ________ always making silly noise in the library.',
      options: ['do', 'are', 'is', 'did'],
      correctAnswer: 'are',
      explanation: "Zardali, asabiylashgan norozilik ma'nosidagi tez-tez takrorlanuvchi odatlar 'always' bilan birga Present Continuous zamonida ko'rsatiladi."
    },
    {
      id: 'mm8',
      question: 'While the students ________ a test yesterday, the electric power failed.',
      options: ['took', 'were taking', 'are taking', 'takes'],
      correctAnswer: 'were taking',
      explanation: "O'tmishda uzoq vaqt davom etayotgan jarayon (were taking) qisqa bir harakat (failed) tomonidan bo'lingan, shuning uchun Past Continuous qo'llanadi."
    },
    {
      id: 'mm9',
      question: 'My father ________ a private conversation with his doctor right now.',
      options: ['has', 'is having', 'have', 'having'],
      correctAnswer: 'is having',
      explanation: "Bu yerda 'have' egalikni emas, balki faol ishtirokni (conversation or lunch) bildirmoqda. Shuning uchun dynamic action sifatida 'is having' bo'ladi."
    },
    {
      id: 'mm10',
      question: 'Last Sunday, my car ________ down while I was driving back home.',
      options: ['broke', 'broken', 'was breaking', 'breaks'],
      correctAnswer: 'broke',
      explanation: "Uzoq davomiy harakat davomida (was driving) birdaniga yuz bergan o'tgan zamon harakati uchun Past Simple (broke) ishlatiladi."
    }
  ]
};
