/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../types';

export interface OxfordDiscoverLevel {
  id: string;
  name: string;
  gradeUz: string;
  bigQuestionUz: string;
  descriptionUz: string;
}

export const oxfordLevels: OxfordDiscoverLevel[] = [
  {
    id: 'od1',
    name: 'Oxford Discover Level 1',
    gradeUz: '1-Sinf / Boshlang\'ich',
    bigQuestionUz: 'Who are we? / Biz kimmiz?',
    descriptionUz: 'Sodda otlar, ko\'plik, hozirgi oddiy zamon to-be fe\'li va egalik olmoshlari.'
  },
  {
    id: 'od2',
    name: 'Oxford Discover Level 2',
    gradeUz: '2-Sinf',
    bigQuestionUz: 'Where do animals live? / Hayvonlar qayerda yashaydi?',
    descriptionUz: 'Hozirgi oddiy va davomiy zamonlar, can/can\'t, va o\'rin-joy ko\'rsatgichlari.'
  },
  {
    id: 'od3',
    name: 'Oxford Discover Level 3',
    gradeUz: '3-Sinf',
    bigQuestionUz: 'How do we design things? / Buyumlarni qanday loyihalashtiramiz?',
    descriptionUz: 'O\'tgan oddiy zamon (to\'g\'ri va noto\'g\'ri fe\'llar), Solishtirma va orttirma sifatlar.'
  },
  {
    id: 'od4',
    name: 'Oxford Discover Level 4',
    gradeUz: '4-Sinf',
    bigQuestionUz: 'Where does our food come from? / Taomlarimiz qayerdan keladi?',
    descriptionUz: 'Hozirgi tugallangan zamon, 1-shart gaplar va majburiyat modallari (must, have to).'
  },
  {
    id: 'od5',
    name: 'Oxford Discover Level 5',
    gradeUz: '5-Sinf',
    bigQuestionUz: 'How do ecosystems work? / Ekotizimlar qanday ishlaydi?',
    descriptionUz: 'Majhul nisbat (Passive), 2-shart gaplar va o\'tgan davomiy zamon.'
  },
  {
    id: 'od6',
    name: 'Oxford Discover Level 6',
    gradeUz: '6-Sinf / Yuqori',
    bigQuestionUz: 'What is the future of our planet? / Sayyoramizning kelajagi qanday?',
    descriptionUz: 'O\'zlashtirma gaplar, 3-shartli gaplar va taxmin modallari (must/might be).'
  }
];

export const oxfordDiscoverQuestions: Record<string, QuizQuestion[]> = {
  'od1': [
    {
      id: 'od1_q1',
      question: 'Hello! I ___ a student in Oxford class.',
      options: ['is', 'are', 'am', 'be'],
      correctAnswer: 'am',
      explanation: "Birinchi shaxs birlik 'I' uchun 'to be' fe'lining 'am' shakli ishlatiladi."
    },
    {
      id: 'od1_q2',
      question: 'These are three ________ on the table.',
      options: ['pencil', 'pencils', 'pencil\'s', 'pencilse'],
      correctAnswer: 'pencils',
      explanation: "'Three' (uchtaligi) ko'plikda turganligi uchun 'pencil' oxiriga '-s' olib 'pencils' bo'ladi."
    },
    {
      id: 'od1_q3',
      question: 'Look! ___ apple in my hand is big and sweet.',
      options: ['This', 'These', 'Those', 'They'],
      correctAnswer: 'This',
      explanation: "Yaqinda va birlikda bo'lgan narsa haqida 'In my hand' gapirilganda, 'This' (bu) ko'rsatkich olmoshi ishlatiladi."
    },
    {
      id: 'od1_q4',
      question: 'Is this your toy? No, it’s not. It’s _____ toy.',
      options: ['he', 'she', 'his', 'him'],
      correctAnswer: 'his',
      explanation: "Egalik formulasiga ko'ra 'his' ishlatiladi: 'Uning o'yinchog'i'."
    },
    {
      id: 'od1_q5',
      question: 'The parrot ________ colorful wings.',
      options: ['have', 'has', 'is', 'are'],
      correctAnswer: 'has',
      explanation: "'The parrot' (To'ti) uchinchi shaxs birlikda (it) bo'lgani uchun 'has' (bor/ega) ko'makchisini oladi."
    },
    {
      id: 'od1_q6',
      question: 'An elephant is big, but a mouse is ________.',
      options: ['tall', 'small', 'long', 'heavy'],
      correctAnswer: 'small',
      explanation: "'But' (lekin) teskari ma'noni ifodalaydi. Katta o'rniga sichqonning kichkinalegi uchun 'small' ishlatiladi."
    },
    {
      id: 'od1_q7',
      question: 'How many yellow ________ can you see in the pond?',
      options: ['duck', 'ducks', 'duckes', 'ducks\''],
      correctAnswer: 'ducks',
      explanation: "'How many' (Nechta) so'roq iborasidan so'ng ot har doim ko'plikda (ducks) keladi."
    },
    {
      id: 'od1_q8',
      question: '_____ are my old friends in Canada.',
      options: ['This', 'They', 'He', 'She'],
      correctAnswer: 'They',
      explanation: "Fe'l ko'plikda 'are' bo'lgani va do'stlar deyilganligi uchun 'They' (Ular) mos keladi."
    },
    {
      id: 'od1_q9',
      question: 'What color is the yellow banana? It ___ yellow.',
      options: ['am', 'is', 'are', 'was'],
      correctAnswer: 'is',
      explanation: "Yagona banan (It) birlikda bo'lgani uchun 'is' ishlatiladi."
    },
    {
      id: 'od1_q10',
      question: 'That is ________ interesting book.',
      options: ['a', 'an', 'the', 'some'],
      correctAnswer: 'an',
      explanation: "Unli harf (i) bilan boshlanadigan sifat 'interesting' oldidan 'an' artikli qo'yiladi."
    },
    {
      id: 'od1_q11',
      question: 'John is my cousin. I like playing with ______.',
      options: ['he', 'his', 'him', 'she'],
      correctAnswer: 'him',
      explanation: "Oshkor to'ldiruvchi shakli: 'men u bilan (him) o'ynashni yoqtiraman'."
    },
    {
      id: 'od1_q12',
      question: 'Is she your English teacher? Yes, ________.',
      options: ['she am', 'she are', 'she is', 'she has'],
      correctAnswer: 'she is',
      explanation: "Qisqa tasdiq javobi 'Yes, she is' shaklida tuziladi."
    },
    {
      id: 'od1_q13',
      question: 'Where is my pencil? It is ________ the box.',
      options: ['under', 'between', 'into', 'of'],
      correctAnswer: 'under',
      explanation: "Joy ko'rsatuvchi sodda prepozitsiyalardan: 'Qutining ostida (under)' mantiqan mos."
    },
    {
      id: 'od1_q14',
      question: 'The boys ________ very happy at the beach.',
      options: ['is', 'am', 'are', 'have'],
      correctAnswer: 'are',
      explanation: "'The boys' (Bolalar) ko'plikda bo'lgani uchun 'are' to-be fe'li ishlatiladi."
    },
    {
      id: 'od1_q15',
      question: 'We ________ any homework to do today.',
      options: ['don\'t have', 'doesn\'t have', 'not have', 'no have'],
      correctAnswer: "don't have",
      explanation: "'We' (Biz) inkor shakli uchun 'don't have' (bizda yo'q) qo'llaniladi."
    },
    {
      id: 'od1_q16',
      question: 'The baby has two tiny ________.',
      options: ['foots', 'feet', 'feets', 'foot'],
      correctAnswer: 'feet',
      explanation: "'Foot' (Oyoq panjasi) noto'g'ri ko'payuvchi ot bo'lib, ko'pligi 'feet' deb yuritiladi."
    },
    {
      id: 'od1_q17',
      question: 'Listen! Is that _____ airplane in the sky?',
      options: ['a', 'an', 'some', 'the'],
      correctAnswer: 'an',
      explanation: "'Airplane' so'zi 'A' unli tovush bilan boshlanganligi sababli 'an' noaniq artikli qo'yiladi."
    },
    {
      id: 'od1_q18',
      question: '_____ sister is very kind. She helps me.',
      options: ['Me', 'I', 'My', 'Mine'],
      correctAnswer: 'My',
      explanation: "Sifatdosh egalik olmoshi 'My sister' (Mening singlim) deb boshlanadi."
    },
    {
      id: 'od1_q19',
      question: 'Who is that girl over there? _____ is my sister, Alice.',
      options: ['He', 'She', 'It', 'They'],
      correctAnswer: 'She',
      explanation: "'Girl' (Qiz bola) bo'lgani uchun kishilik olmoshi 'She' (U) bo'ladi."
    },
    {
      id: 'od1_q20',
      question: 'Do you have a big dog? No, ________.',
      options: ['I don\'t', 'I do', 'she doesn\'t', 'they don\'t'],
      correctAnswer: "I don't",
      explanation: "'Do you...?' so'roviga inkor javob berishda 'No, I don't' iborasi qo'llaniladi."
    },
    {
      id: 'od1_q21',
      question: 'Look at those green ________ on the branches.',
      options: ['leaf', 'leafs', 'leaves', 'leave'],
      correctAnswer: 'leaves',
      explanation: "'Leaf' (Daraxt bargi) ko'plikda 'leaves' (barglar) bo'lib o'zgaradi."
    },
    {
      id: 'od1_q22',
      question: 'The toy train is _____ the floor.',
      options: ['on', 'in', 'at', 'into'],
      correctAnswer: 'on',
      explanation: "Yuzada turgan buyumlar uchun 'on' (ustida) ko'makchisi ishlatiladi: 'on the floor'."
    },
    {
      id: 'od1_q23',
      question: 'How old _____ you? I am seven.',
      options: ['is', 'are', 'am', 'have'],
      correctAnswer: 'are',
      explanation: "Yosh so'rashda 'How old are you?' standart iborasi ishlatiladi."
    },
    {
      id: 'od1_q24',
      question: 'The birds ________ sweet songs every evening.',
      options: ['sings', 'sing', 'singing', 'to sing'],
      correctAnswer: 'sing',
      explanation: "'The birds' ko'plik ot bo'lganligi uchun fe'l faqat 'sing' bo'lib qoladi."
    },
    {
      id: 'od1_q25',
      question: 'My doll is quiet, but this train is very ________.',
      options: ['noisy', 'silent', 'small', 'blue'],
      correctAnswer: 'noisy',
      explanation: "'But' qarama-qarshilikni ifodalaydi. 'Doll are quiet' (tinch), demak poezd 'noisy' (shovqinli)."
    },
    {
      id: 'od1_q26',
      question: 'Can you see ________ blue birds in that tree?',
      options: ['this', 'that', 'these', 'them'],
      correctAnswer: 'these',
      explanation: "Ko'plikdagi ot 'birds' uchun yaqindagi ko'rsatgich olmoshi sifatida 'these' mos keladi."
    },
    {
      id: 'od1_q27',
      question: 'Is it ________ old map of the world?',
      options: ['a', 'an', 'any', 'some'],
      correctAnswer: 'an',
      explanation: "'Old' so'zi unli ovoz bilan boshlanishi sababli 'an' talab qilinadi."
    },
    {
      id: 'od1_q28',
      question: 'There is ________ water left in the glass.',
      options: ['many', 'some', 'any', 'a key'],
      correctAnswer: 'some',
      explanation: "Sanab bo'lmaydigan 'water' otining tasdiq gapda ifodalanishi 'some' so'zi orqali bo'ladi."
    },
    {
      id: 'od1_q29',
      question: 'What ________ they doing right now?',
      options: ['is', 'are', 'am', 'do'],
      correctAnswer: 'are',
      explanation: "Present Continuous so'rog'ida 'They' uchun 'are' yoziladi."
    },
    {
      id: 'od1_q30',
      question: 'We ________ at school on Sunday mornings.',
      options: ['are not', 'am not', 'does not', 'is not'],
      correctAnswer: 'are not',
      explanation: "'We' (Biz) uchun to-be inkor shakli 'are not' (aren't) hisoblanadi."
    }
  ],
  'od2': [
    {
      id: 'od2_q1',
      question: 'Ducks ________ fly high, but they can swim well.',
      options: ['can', 'cannot', 'are', 'is'],
      correctAnswer: 'cannot',
      explanation: "'But' qarama-qarshilikni ifodalaydi. Yaxshi suzadi, lekin 'cannot fly high' (baland ucha olmaydi)."
    },
    {
      id: 'od2_q2',
      question: 'Look! The monkeys ________ high trees.',
      options: ['climb', 'are climbing', 'climbs', 'climbed'],
      correctAnswer: 'are climbing',
      explanation: "'Look!' (Qara!) ishorasi hozir davom etayotgan harakat (are climbing) uchun qo'llaniladi."
    },
    {
      id: 'od2_q3',
      question: 'There aren\'t ________ sheep on this dry farm.',
      options: ['some', 'any', 'much', 'no'],
      correctAnswer: 'any',
      explanation: "Inkor gaplarda 'any' (hech qanday) ishlatiladi."
    },
    {
      id: 'od2_q4',
      question: 'Does the giraffe eat fresh leaves? Yes, it ________.',
      options: ['do', 'does', 'is', 'has'],
      correctAnswer: 'does',
      explanation: "Uchinchi shaxsdagi 'Does' bilan muloqot boshlanganda tasdiq javob 'does' bilan tugaydi."
    },
    {
      id: 'od2_q5',
      question: 'The shark is swimming ________ the ocean.',
      options: ['in', 'on', 'at', 'into'],
      correctAnswer: 'in',
      explanation: "Okean ichida suzish mantiqan 'in the ocean' shaklida bo'ladi."
    },
    {
      id: 'od2_q6',
      question: 'They ________ like cold winter rainy days.',
      options: ['doesn\'t', 'don\'t', 'isn\'t', 'not'],
      correctAnswer: "don't",
      explanation: "Present Simple inkor formulasiga binoan 'They' uchun 'don't' yordamchi fe'li ishlatiladi."
    },
    {
      id: 'od2_q7',
      question: 'Is she ________ to music at the moment?',
      options: ['listen', 'listening', 'listens', 'listened'],
      correctAnswer: 'listening',
      explanation: "'At the moment' (hozirgi vaqtda) Present Continuous (is + V-ing) ko'rsatgichidir."
    },
    {
      id: 'od2_q8',
      question: 'The owl is hunting ________ night.',
      options: ['on', 'in', 'at', 'by'],
      correctAnswer: 'at',
      explanation: "Vaqt iborasida 'at night' (tunda) qo'llaniladi."
    },
    {
      id: 'od2_q9',
      question: 'How ________ sugar do you need in your sweet tea?',
      options: ['many', 'much', 'some', 'any'],
      correctAnswer: 'much',
      explanation: "Sanab bo'lmaydigan 'sugar' uchun 'How much' iborasi ishlatiladi."
    },
    {
      id: 'od2_q10',
      question: 'Kangaroos ________ very high with their strong legs.',
      options: ['jump', 'jumps', 'jumping', 'are jump'],
      correctAnswer: 'jump',
      explanation: "'Kangaroos' ko'plik ot bo'lgani uchun doimiy xususiyat ifodalanganda fe'l 'jump' o'zgarishsiz qoladi."
    },
    {
      id: 'od2_q11',
      question: 'An owl sleeps ________ day and hunts at night.',
      options: ['during the', 'at the', 'in', 'on'],
      correctAnswer: 'during the',
      explanation: "Owl (Boyqush) kunduzi (during the day) uxlaydi."
    },
    {
      id: 'od2_q12',
      question: 'Are there any tigers in the zoo? Yes, ________.',
      options: ['there is', 'there are', 'it is', 'they are'],
      correctAnswer: 'there are',
      explanation: "'Are there...?' so'roviga ko'plikda 'Yes, there are' deb javob qaytariladi."
    },
    {
      id: 'od2_q13',
      question: 'A snake can crawl, but it cannot ________.',
      options: ['walk', 'sleeping', 'eats', 'shed'],
      correctAnswer: 'walk',
      explanation: "Model verb 'cannot' dan so'ng fe'lning sof ko'rinishi (walk) qo'llaniladi."
    },
    {
      id: 'od2_q14',
      question: 'What ________ do you feed your little rabbit?',
      options: ['often', 'time', 'does', 'is'],
      correctAnswer: 'time',
      explanation: "'What time...?' (Qaysi vaqtda/soat nechchida) sarlavha so'rog'iga mos keladi."
    },
    {
      id: 'od2_q15',
      question: 'The bear is sleeping inside ______ quiet cave.',
      options: ['its', 'it\'s', 'his', 'her'],
      correctAnswer: 'its',
      explanation: "Hayvon birligi (It) uchun egalik olmoshi 'its' bo'ladi, 'it\'s' esa (it is) dir."
    },
    {
      id: 'od2_q16',
      question: 'Do birds ________ in build trees?',
      options: ['lives', 'live', 'living', 'lived'],
      correctAnswer: 'live',
      explanation: "Do' yordamchi fe'li bilan so'roq gapda asliy fe'l (live) bosh shaklida keladi."
    },
    {
      id: 'od2_q17',
      question: 'These animals ________ migrate in winter.',
      options: ['do not', 'does not', 'is not', 'are not'],
      correctAnswer: 'do not',
      explanation: "'These animals' (Bu hayvonlar) ko'pligi uchun inkor 'do not' yoki 'don't' bo'ladi."
    },
    {
      id: 'od2_q18',
      question: 'Where ________ the penguins live in the wild?',
      options: ['does', 'do', 'are', 'is'],
      correctAnswer: 'do',
      explanation: "'The penguins' ko'plik shaxsi bo'lib, unga so'roqda 'do' hamrohlik qiladi."
    },
    {
      id: 'od2_q19',
      question: 'Listen! A wolf ________ to the bright moon.',
      options: ['howl', 'howls', 'is howling', 'howled'],
      correctAnswer: 'is howling',
      explanation: "'Listen!' (Eshiting!) hozir yuz berayotgan davomli harakatni (is howling) taqozo etadi."
    },
    {
      id: 'od2_q20',
      question: 'This baby seal ________ swim very fast.',
      options: ['can', 'is', 'are', 'does'],
      correctAnswer: 'can',
      explanation: "Qobiliyatni ifdalashda 'can' (qo'lidan keladi) modali ishlatiladi."
    },
    {
      id: 'od2_q21',
      question: 'Camels have long eyelashes to protect ________ eyes from sand.',
      options: ['their', 'its', 'them', 'they'],
      correctAnswer: 'their',
      explanation: "'Camels' (Tuyalar) ko'plikda bo'lgani sababli ularning ko'zlarini (their eyes) himoya qiladi."
    },
    {
      id: 'od2_q22',
      question: 'Are the pandas eating bamboo roots now? Yes, ________.',
      options: ['they are', 'there are', 'it is', 'they do'],
      correctAnswer: 'they are',
      explanation: "'Are the pandas...?' so'rog'ining qisqa tasdig'i 'Yes, they are' bo'ladi."
    },
    {
      id: 'od2_q23',
      question: 'There is ________ water left in the desert well.',
      options: ['any', 'no', 'many', 'a few'],
      correctAnswer: 'no',
      explanation: "Sifatli inkor ifodasi: 'Sahrodagi quduqda suv (no water) qolmagan'."
    },
    {
      id: 'od2_q24',
      question: 'Look! The colorful butterfly is flying ________ the flower.',
      options: ['over', 'under', 'at', 'into'],
      correctAnswer: 'over',
      explanation: "Kapalak gulning ustidan parvoz qilayotganligi uchun 'over' ko'makchisi mos keladi."
    },
    {
      id: 'od2_q25',
      question: 'Do wild dolphins ________ in deep, clean oceans?',
      options: ['sleeps', 'sleep', 'sleeping', 'slept'],
      correctAnswer: 'sleep',
      explanation: "'Do ... sleep?' strukturasida fe'l o'zgarishsiz qoladi."
    },
    {
      id: 'od2_q26',
      question: 'The frog jumped ________ the pond water suddenly.',
      options: ['into', 'on', 'at', 'for'],
      correctAnswer: 'into',
      explanation: "Harakat yo'nalishini bildirish uchun (ichkariga) 'into' prepozitsiyasi ishlatiladi."
    },
    {
      id: 'od2_q27',
      question: 'I have ________ small fish in my aquarium.',
      options: ['any', 'some', 'much', 'an'],
      correctAnswer: 'some',
      explanation: "Tasdiq gapda sanaladigan ko'plik otlar oldidan 'some' (bir nechta) keladi."
    },
    {
      id: 'od2_q28',
      question: 'Why ________ this lion roaring loudly?',
      options: ['is', 'are', 'am', 'do'],
      correctAnswer: 'is',
      explanation: "'This lion' (Yagona sher - it) uchun 'is' to-be mos so'roq beradi."
    },
    {
      id: 'od2_q29',
      question: 'A koala ________ drink water often; it gets water from leaves.',
      options: ['doesn\'t', 'don\'t', 'isn\'t', 'won\'t'],
      correctAnswer: "doesn't",
      explanation: "Yagona koala (It) uchun uchinchi shaxs inkor 'doesn't' deb boshlanadi."
    },
    {
      id: 'od2_q30',
      question: 'The crocodiles are ________ waiting near the muddy river.',
      options: ['quietly', 'quiet', 'noise', 'noises'],
      correctAnswer: 'quietly',
      explanation: "Fe'lni tasvirlash ravish orqali amalga oshadi: 'quietly waiting' (jim kutmoqda)."
    }
  ],
  'od3': [
    {
      id: 'od3_q1',
      question: 'Last summer, my uncle ________ a new robotic machine.',
      options: ['design', 'designed', 'designs', 'designing'],
      correctAnswer: 'designed',
      explanation: "'Last summer' (o'tgan yoz) o'tgan oddiy zamon ko'rsatkichi, to'g'ri fe'llarga '-ed' qo'shiladi."
    },
    {
      id: 'od3_q2',
      question: 'My computer is ________ than your smartphone.',
      options: ['fast', 'faster', 'the fastest', 'more fast'],
      correctAnswer: 'faster',
      explanation: "'Than' (nisbatan) so'zi solishtirma darajani talab qiladi. Qisqa sifatlarga '-er' qo'shiladi: 'faster'."
    },
    {
      id: 'od3_q3',
      question: 'Where ________ you go for your family picnic yesterday?',
      options: ['do', 'did', 'does', 'were'],
      correctAnswer: 'did',
      explanation: "O'tgan zamondagi so'roq shakli 'did' yordamchi fe'li yordamida hosil qilinadi."
    },
    {
      id: 'od3_q4',
      question: 'These old bridges are the ________ in our beautiful city.',
      options: ['strongest', 'stronger', 'strong', 'more strong'],
      correctAnswer: 'strongest',
      explanation: "Oldida 'the' artikli bo'lganligi sababli orttirma (superlative -est) daraja ishlatiladi."
    },
    {
      id: 'od3_q5',
      question: 'He did not ________ the correct plans to build the toy house.',
      options: ['bring', 'brought', 'brings', 'bringing'],
      correctAnswer: 'bring',
      explanation: "Inkor gapda 'did not' kelgandan keyin asosiy fe'l V1 (boshlang'ich) shakliga qaytadi."
    },
    {
      id: 'od3_q6',
      question: 'Designing a spaceship is ________ than building a birdhouse.',
      options: ['difficult', 'more difficult', 'the most difficult', 'difficulter'],
      correctAnswer: 'more difficult',
      explanation: "Ko'p bo'g'inli sifatlarni solishtirish 'more' vositasida qilinadi."
    },
    {
      id: 'od3_q7',
      question: 'We ________ our project homework draft two days ago.',
      options: ['finish', 'finished', 'finishes', 'finishing'],
      correctAnswer: 'finished',
      explanation: "'Two days ago' o'tgan zamon bo'lgani sababli 'finished' (V2) bo'ladi."
    },
    {
      id: 'od3_q8',
      question: 'Who ________ that brilliant stone palace in 1890?',
      options: ['build', 'builds', 'built', 'building'],
      correctAnswer: 'built',
      explanation: "'In 1890' tarixiy yil bo'lib o'tgan zamonni bildiradi. 'Build' ning V2 shakli 'built' dir."
    },
    {
      id: 'od3_q9',
      question: 'A Ferrari car is ________ expensive than a simple bicycle.',
      options: ['much', 'more', 'most', 'the most'],
      correctAnswer: 'more',
      explanation: "Solishtirma sifat konstruktsiyasida 'more expensive' mantiqiy shakldir."
    },
    {
      id: 'od3_q10',
      question: 'Did they ________ the old museum last weekend?',
      options: ['visit', 'visited', 'visits', 'visiting'],
      correctAnswer: 'visit',
      explanation: "So'roqdagi 'Did' tufayli fe'l asliy ko'rinishida (visit) keladi."
    },
    {
      id: 'od3_q11',
      question: 'I think science class is ________ than art history.',
      options: ['interesting', 'more interesting', 'most interesting', 'the most interesting'],
      correctAnswer: 'more interesting',
      explanation: "Ikki tushunchani 'than' yordamida solishtirish uchun 'more interesting' ishlatiladi."
    },
    {
      id: 'od3_q12',
      question: 'We ________ any tools to repair the broken car yesterday.',
      options: ['had not', 'didn\'t have', 'doesn\'t have', 'no had'],
      correctAnswer: "didn't have",
      explanation: "O'tgan zamondagi inkor egalikni ifodalashda 'didn't have' ishlatiladi."
    },
    {
      id: 'od3_q13',
      question: 'This modern skyscraper is the ________ building in Russia.',
      options: ['tallest', 'taller', 'tall', 'more tall'],
      correctAnswer: 'tallest',
      explanation: "Dunyo bo'yicha yoki ma'lum bir hududdagi eng baland (orttirma daraja): 'the tallest'."
    },
    {
      id: 'od3_q14',
      question: 'Thomas Edison ________ the carbon bulb in the United States.',
      options: ['invent', 'invented', 'invents', 'inventing'],
      correctAnswer: 'invented',
      explanation: "Ixtiro o'tmishda yuz berganligi uchun 'invented' to'g'ri tanlovdir."
    },
    {
      id: 'od3_q15',
      question: 'Iron is heavier ________ wood or plastic.',
      options: ['as', 'than', 'to', 'for'],
      correctAnswer: 'than',
      explanation: "Solishtirma sifat 'heavier' ortidan 'than' (qaraganda/dan ko'ra) keladi."
    },
    {
      id: 'od3_q16',
      question: 'We bought some beautiful drawings. They ________ very cheap.',
      options: ['was', 'were', 'is', 'did'],
      correctAnswer: 'were',
      explanation: "Ko'plikdagi chizmalar 'They' uchun o'tgan zamon bog'lovchisi 'were' hisoblanadi."
    },
    {
      id: 'od3_q17',
      question: 'The Wright brothers ________ the first glider plane.',
      options: ['flew', 'fly', 'flies', 'flying'],
      correctAnswer: 'flew',
      explanation: "Tarixiy dalil - o'tgan oddiy zamon. Noto'g'ri fe'l 'fly' o'tmishi 'flew' bo'ladi."
    },
    {
      id: 'od3_q18',
      question: 'Is Mount Everest the ________ place on earth?',
      options: ['coldest', 'colder', 'cold', 'more cold'],
      correctAnswer: 'coldest',
      explanation: "Yer sharidagi eng sovuq (orttirma) joy: 'the coldest'."
    },
    {
      id: 'od3_q19',
      question: 'They didn\'t ________ any ancient artifacts inside the pyramid.',
      options: ['find', 'found', 'finds', 'finding'],
      correctAnswer: 'find',
      explanation: "Didn't dan so'ng 'find' (V1) kelishi lozim."
    },
    {
      id: 'od3_q20',
      question: 'This map is ________ useful than the previous one we had.',
      options: ['more', 'most', 'the most', 'much'],
      correctAnswer: 'more',
      explanation: "'Than' borligi uchun 'more useful' mos variantdir."
    },
    {
      id: 'od3_q21',
      question: 'Einstein ______ born in Germany in 1879.',
      options: ['is', 'was', 'were', 'did'],
      correctAnswer: 'was',
      explanation: "Einstein (u/He) uchun o'tmishda 'tug'ildi' deb 'was born' aytiladi."
    },
    {
      id: 'od3_q22',
      question: 'What is the ________ country in the world?',
      options: ['biggest', 'bigger', 'big', 'most big'],
      correctAnswer: 'biggest',
      explanation: "Dunyodagi eng katta o'lchov (orttirma): 'the biggest'."
    },
    {
      id: 'od3_q23',
      question: 'They ________ deeply about the engineering solution.',
      options: ['think', 'thought', 'thinks', 'thinking'],
      correctAnswer: 'thought',
      explanation: "O'tgan zamonda noto'g'ri fe'l 'think' ning o'zgarishi 'thought' (o'ylashdi) bo'ladi."
    },
    {
      id: 'od3_q24',
      question: 'My grandmother was the ________ person in our family.',
      options: ['wisest', 'wiser', 'wise', 'more wise'],
      correctAnswer: 'wisest',
      explanation: "Oiladagi eng dono (orttirma): 'the wisest' (wise + est)."
    },
    {
      id: 'od3_q25',
      question: 'Why did the machine stop? Because it ________ out of battery.',
      options: ['run', 'ran', 'runs', 'running'],
      correctAnswer: 'ran',
      explanation: "O'tmishdagi so'roqqa o'tgan oddiy zamondagi noto'g'ri fe'l 'ran' (tugadi/V2) bilan javob beriladi."
    },
    {
      id: 'od3_q26',
      question: 'This wooden chair is ________ comfortable than that plastic stool.',
      options: ['more', 'most', 'much', 'the most'],
      correctAnswer: 'more',
      explanation: "Solishtirish darajasi: 'more comfortable than'."
    },
    {
      id: 'od3_q27',
      question: 'Who ________ you your first computer five years ago?',
      options: ['gave', 'give', 'gives', 'giving'],
      correctAnswer: 'gave',
      explanation: "'Five years ago' (5 yil avval) uchun 'give' ning V2 shakli 'gave' qo'llaniladi."
    },
    {
      id: 'od3_q28',
      question: 'A elephant trunk is the ________ tool for picking food.',
      options: ['most useful', 'more useful', 'usefulest', 'useful'],
      correctAnswer: 'most useful',
      explanation: "Orttirma sifat darajasi: 'the most useful'."
    },
    {
      id: 'od3_q29',
      question: 'They didn\'t ________ a new bridge last winter.',
      options: ['build', 'built', 'building', 'builds'],
      correctAnswer: 'build',
      explanation: "Inkor 'didn't' so'zidan keyin fe'l asliyatiga (build) qaytadi."
    },
    {
      id: 'od3_q30',
      question: 'Is this gold watch ________ expensive than your silver ring?',
      options: ['more', 'most', 'the most', 'as'],
      correctAnswer: 'more',
      explanation: "Solishtirish so'rog'i: 'more expensive than'."
    }
  ],
  'od4': [
    {
      id: 'od4_q1',
      question: 'I have ________ eaten sweet dried dates from Saudi Arabia.',
      options: ['already', 'yet', 'never', 'since'],
      correctAnswer: 'already',
      explanation: "Present Perfect zamonida allaqachon bajarilgan ish uchun 'already' ishlatiladi."
    },
    {
      id: 'od4_q2',
      question: 'If you eat too much sugar, you ________ stomach problems.',
      options: ['will get', 'got', 'gets', 'get'],
      correctAnswer: 'will get',
      explanation: "Birinchi shart gap (1st Conditional) strukturasi: If + Present, will + V1."
    },
    {
      id: 'od4_q3',
      question: 'Hikers ________ carry clean water when exploring canyons.',
      options: ['must', 'musts', 'has to', 'are'],
      correctAnswer: 'must',
      explanation: "Shaxs uchun kuchli majburiyat / buyruqni ifodalashda 'must' modali ishlatiladi."
    },
    {
      id: 'od4_q4',
      question: 'We have lived in this farmhouse ________ ten years.',
      options: ['for', 'since', 'yet', 'already'],
      correctAnswer: 'for',
      explanation: "Vaqt oralig'i (10 yildan beri) ifodasi uchun 'for' qo'llaniladi."
    },
    {
      id: 'od4_q5',
      question: 'Have you finished your wheat farm report ________?',
      options: ['yet', 'already', 'since', 'for'],
      correctAnswer: 'yet',
      explanation: "Present Perfect so'roq gaplari oxirida har doim 'yet' (hali/hanuz) so'zi keladi."
    },
    {
      id: 'od4_q6',
      question: 'In the future, robot farms ________ grow most vegetables.',
      options: ['will', 'going to', 'shall', 'are'],
      correctAnswer: 'will',
      explanation: "Kelajak bashorati yoki oddiy kelajak zamoni uchun 'will' ishlatiladi."
    },
    {
      id: 'od4_q7',
      question: 'My father has worked as a gardener ________ 2010.',
      options: ['since', 'for', 'already', 'yet'],
      correctAnswer: 'since',
      explanation: "Ma'lum bir aniq boshlang'ich vaqtdan boshlab (2010-yildan beri) 'since' ishlatiladi."
    },
    {
      id: 'od4_q8',
      question: 'If she ________ a sweet apple, she will like the taste.',
      options: ['eat', 'eats', 'eating', 'ate'],
      correctAnswer: 'eats',
      explanation: "First Conditional formulasining if qismida Present Simple (she eats) yoziladi."
    },
    {
      id: 'od4_q9',
      question: 'You ________ touch that hot stove; it is very dangerous.',
      options: ['must not', 'must', 'does not', 'don\'t have to'],
      correctAnswer: 'must not',
      explanation: "Taqiq (qilish mumkin bo'lmagan ish) uchun 'must not' (mustn't) ishlatiladi."
    },
    {
      id: 'od4_q10',
      question: 'Has he ________ visited a real tea factory in Sr Lanka?',
      options: ['ever', 'never', 'already', 'since'],
      correctAnswer: 'ever',
      explanation: "Hayotiy tajribani so'rashda so'roq gapda 'ever' (hech/hech bo'lmasa) ishlatiladi."
    },
    {
      id: 'od4_q11',
      question: 'They ________ to clean their boots after visiting the muddy greenhouse.',
      options: ['have', 'has', 'must', 'should'],
      correctAnswer: 'have',
      explanation: "'Have to' (majburlik) bilan 'to' keladi: 'They have to clean'."
    },
    {
      id: 'od4_q12',
      question: 'If you cook rice carefully, it ________ soft and tasty.',
      options: ['will be', 'is', 'was', 'being'],
      correctAnswer: 'will be',
      explanation: "First Conditional natija qismi: will + be."
    },
    {
      id: 'od4_q13',
      question: 'We ________ our organic seeds yet.',
      options: ['have not planted', 'has not planted', 'didn\'t plant', 'do not plant'],
      correctAnswer: 'have not planted',
      explanation: "'Yet' borligi uchun gap Present Perfect inkor bo'lishi kerak: 'have not planted'."
    },
    {
      id: 'od4_q14',
      question: 'You ________ buy bread. We have plenty at home.',
      options: ['don\'t have to', 'must not', 'should not', 'has not to'],
      correctAnswer: "don't have to",
      explanation: "Majburiyat yo'qligi (kerak emas/shart emas) uchun 'don't have to' ishlatiladi."
    },
    {
      id: 'od4_q15',
      question: 'What have you ________ in your organic garden today?',
      options: ['grew', 'grown', 'grow', 'growing'],
      correctAnswer: 'grown',
      explanation: "'Have you' formulasida Present Perfect fe'lining V3 shakli (grown) keladi."
    },
    {
      id: 'od4_q16',
      question: 'If the weather ________ warm, we will plant carrots.',
      options: ['is', 'will be', 'are', 'was'],
      correctAnswer: 'is',
      explanation: "First Conditional - If qismi: Present Simple 'is' (the weather is)."
    },
    {
      id: 'od4_q17',
      question: 'She has ________ written three books about honeybees.',
      options: ['already', 'yet', 'since', 'ever'],
      correctAnswer: 'already',
      explanation: "Tasdiq gapda tugallangan ish uchun 'already' o'rinli."
    },
    {
      id: 'od4_q18',
      question: 'Vehicles ________ stop when the traffic light is red.',
      options: ['must', 'have', 'are to', 'shoulds'],
      correctAnswer: 'must',
      explanation: "Qat'iy qoida / majburiyat uchun 'must' modali mos keladi."
    },
    {
      id: 'od4_q19',
      question: 'Have they ________ played on a professional soccer pitch?',
      options: ['ever', 'yet', 'never', 'since'],
      correctAnswer: 'ever',
      explanation: "So'roq gapda tajribani so'rashda 'ever' qo'llaniladi."
    },
    {
      id: 'od4_q20',
      question: 'If he studies hard, he ________ the difficult exam.',
      options: ['will pass', 'pass', 'passes', 'passed'],
      correctAnswer: 'will pass',
      explanation: "First Conditional natija qismi: will + verb (will pass)."
    },
    {
      id: 'od4_q21',
      question: 'My mother has baked bread ________ this morning.',
      options: ['since', 'for', 'already', 'yet'],
      correctAnswer: 'since',
      explanation: "Nuqtaviy vaqt 'this morning' (ertalabdan beri) bo'lgani uchun 'since' qo'yiladi."
    },
    {
      id: 'od4_q22',
      question: 'I have never ________ to a natural rainforest.',
      options: ['been', 'went', 'be', 'go'],
      correctAnswer: 'been',
      explanation: "Present Perfect doirasida borib ko'rish tajribasi uchun 'been' (V3) ishlatiladi."
    },
    {
      id: 'od4_q23',
      question: 'Farmers ________ irrigate dry crops to help them grow.',
      options: ['must', 'shoulds', 'has to', 'are'],
      correctAnswer: 'must',
      explanation: "Dehqonlarning majburiyati ko'rsatilmoqda: 'must' (shart/lozim)."
    },
    {
      id: 'od4_q24',
      question: 'If we harvest the grapes today, they ________ fresh.',
      options: ['will taste', 'taste', 'tasted', 'will tasted'],
      correctAnswer: 'will taste',
      explanation: "First Conditional natija qismi: will + verb (will taste)."
    },
    {
      id: 'od4_q25',
      question: 'We haven\'t received the new seeds ________.',
      options: ['yet', 'already', 'since', 'ever'],
      correctAnswer: 'yet',
      explanation: "Inkor gap oxirida 'yet' (hanuzgacha) mantiqiy tugallash hisoblanadi."
    },
    {
      id: 'od4_q26',
      question: 'He ________ study tonight. He has a test tomorrow.',
      options: ['has to', 'have to', 'musts', 'does'],
      correctAnswer: 'has to',
      explanation: "Birlik 'He' uchun tashqi majburiyat: 'has to' (to'g'ri grammatika)."
    },
    {
      id: 'od4_q27',
      question: 'Have you ever ________ fresh goat milk?',
      options: ['drunk', 'drank', 'drink', 'drinking'],
      correctAnswer: 'drunk',
      explanation: "'Drink' fe'lining uchinchi shakli (V3) - 'drunk' bo'ladi."
    },
    {
      id: 'od4_q28',
      question: 'If you do not water these flowers, they ________.',
      options: ['will die', 'died', 'dies', 'die'],
      correctAnswer: 'will die',
      explanation: "Natijani bildirish (kelasi zamon): 'will die'."
    },
    {
      id: 'od4_q29',
      question: 'They have been friends ________ high school.',
      options: ['since', 'for', 'already', 'yet'],
      correctAnswer: 'since',
      explanation: "Boshlang'ich nuqta 'gimnaziya yillaridan beri' bo'lganligi uchun 'since' o'rinli."
    },
    {
      id: 'od4_q30',
      question: 'You ________ use your phone during the science exam.',
      options: ['must not', 'don\'t have to', 'must', 'needs not'],
      correctAnswer: 'must not',
      explanation: "Taqiq: 'imtihon paytida telefondan foydalanish mumkin emas (must not)'."
    }
  ],
  'od5': [
    {
      id: 'od5_q1',
      question: 'The Amazon forest ________ by thousands of unique insect species.',
      options: ['is inhabited', 'are inhabited', 'inhabits', 'is inhabit'],
      correctAnswer: 'is inhabited',
      explanation: "Hozirgi zamon Majhul nisbati (Passive Voice): is/are + V3 (is inhabited)."
    },
    {
      id: 'od5_q2',
      question: 'If I had a million dollars, I ________ build a massive ocean laboratory.',
      options: ['would', 'will', 'did', 'can'],
      correctAnswer: 'would',
      explanation: "Ikkinchi shart gap (2nd Conditional - xayoliy holat): If + Past, would + V1."
    },
    {
      id: 'od5_q3',
      question: 'While the scientists ________ the volcanic rocks, it started to rain.',
      options: ['were examining', 'was examining', 'examined', 'are examining'],
      correctAnswer: 'were examining',
      explanation: "O'tgan davomli zamon (Past Continuous) ko'rsatkichi 'While' bilan ko'plik 'scientists' uchun: 'were examining'."
    },
    {
      id: 'od5_q4',
      question: 'Plastic wastes ________ recycled to protect marine life.',
      options: ['should be', 'should', 'is', 'are'],
      correctAnswer: 'should be',
      explanation: "Maslahat yoki taklif majhul shaklda (Passive Modal): should + be + V3."
    },
    {
      id: 'od5_q5',
      question: 'What would you do if you ________ a wild tiger in of the mountains?',
      options: ['saw', 'see', 'seen', 'will see'],
      correctAnswer: 'saw',
      explanation: "2nd Conditional savol shakli if qismida Past Simple (saw) talab qiladi."
    },
    {
      id: 'od5_q6',
      question: 'Many beautiful trees ________ down last year in the rainforest.',
      options: ['were cut', 'was cut', 'are cut', 'cutted'],
      correctAnswer: 'were cut',
      explanation: "O'tgan zamondagi Majhul nisbat ko'plikda: 'were' + V3 ('cut' ning uchala shakli ham 'cut' dir)."
    },
    {
      id: 'od5_q7',
      question: 'I was writing a biology note when my brother ________ the room.',
      options: ['entered', 'was entering', 'enters', 'had entered'],
      correctAnswer: 'entered',
      explanation: "Uzoq davomiy harakat o'rtasida to'satdan sodir bo'lgan qisqa o'tgan zamon harakati uchun V2 (entered) ishlatiladi."
    },
    {
      id: 'od5_q8',
      question: 'Paper ________ invented in China centuries ago.',
      options: ['was', 'were', 'is', 'did'],
      correctAnswer: 'was',
      explanation: "Paper (Sanalmaydi, birlik) uchun o'tgan zamon majhul nisbati: 'was invented'."
    },
    {
      id: 'od5_q9',
      question: 'If they ________ more trees, the air in Tashkent would be cleaner.',
      options: ['planted', 'plant', 'will plant', 'were planted'],
      correctAnswer: 'planted',
      explanation: "2nd Conditional formulasida if qismida Past Simple (planted) qo'llaniladi."
    },
    {
      id: 'od5_q10',
      question: 'While the brown bear ________ fish, it saw a fox.',
      options: ['was catching', 'were catching', 'caught', 'is catching'],
      correctAnswer: 'was catching',
      explanation: "Yagona ayiq (He/She/It) va 'While' davomiyligi: 'was catching'."
    },
    {
      id: 'od5_q11',
      question: 'These solar solar panels ________ produced in Germany.',
      options: ['are', 'is', 'was', 'be'],
      correctAnswer: 'are',
      explanation: "Hozirgi ko'plik majhulligi: 'solar panels are produced'."
    },
    {
      id: 'od5_q12',
      question: 'She would travel to Germany if she ________ English and German.',
      options: ['knew', 'knows', 'known', 'will know'],
      correctAnswer: 'knew',
      explanation: "2nd Conditional If qismida Past Simple (knew) ishlatiladi."
    },
    {
      id: 'od5_q13',
      question: 'A massive earthquake ________ detected yesterday by instruments.',
      options: ['was', 'were', 'is', 'did'],
      correctAnswer: 'was',
      explanation: "O'tgan zamon yagona majhul hodisa 'was detected'."
    },
    {
      id: 'od5_q14',
      question: 'While they ________ on the sandy beach, they found a shell.',
      options: ['were walking', 'was walking', 'walked', 'are walking'],
      correctAnswer: 'were walking',
      explanation: "While ko'rsatgichi ko'plik 'They' bilan o'tgan davomli zamonda 'were walking' bo'ladi."
    },
    {
      id: 'od5_q15',
      question: 'In many countries, nature parks ________ protected by tight laws.',
      options: ['are', 'is', 'was', 'were'],
      correctAnswer: 'are',
      explanation: "Umumiy hozirgi holatdagi majhullik ko'plikda: 'parks are protected'."
    },
    {
      id: 'od5_q16',
      question: 'If you ________ a bird, where would you fly?',
      options: ['were', 'was', 'are', 'would be'],
      correctAnswer: 'were',
      explanation: "2nd Conditionalda barcha shaxslar (I, you, he, she, it) uchun noaniq xayolda to-be fe'lining 'were' shakli afzal ko'riladi."
    },
    {
      id: 'od5_q17',
      question: 'English lessons ________ taught in our high school every day.',
      options: ['are', 'is', 'was', 'be'],
      correctAnswer: 'are',
      explanation: "Hozirgi zamon ko'plik majhulligi: 'lessons are taught' (teach ning V3 shakli: taught)."
    },
    {
      id: 'od5_q18',
      question: 'My teacher ________ entering the class when the electricity went off.',
      options: ['was', 'were', 'is', 'did'],
      correctAnswer: 'was',
      explanation: "O'tgan davomli zamon 'was entering'."
    },
    {
      id: 'od5_q19',
      question: 'Many photos of wild wolves ________ taken last month by hunters.',
      options: ['were', 'was', 'is', 'are'],
      correctAnswer: 'were',
      explanation: "'Photos' (rasmlar) ko'plikda va 'last month' (o'tgan oy) bo'lgani uchun 'were' qo'yiladi."
    },
    {
      id: 'od5_q20',
      question: 'If the weather were not so freezing, we ________ go hiking today.',
      options: ['would', 'will', 'did', 'do'],
      correctAnswer: 'would',
      explanation: "2nd Conditional natija qismi: would + V1 (would go)."
    },
    {
      id: 'od5_q21',
      question: 'While the birds ________ south, we watched them from our yard.',
      options: ['were flying', 'was flying', 'flew', 'are flying'],
      correctAnswer: 'were flying',
      explanation: "While o'tgan zamon davomiyligi ko'plikda 'were flying' bo'ladi."
    },
    {
      id: 'od5_q22',
      question: 'How ________ electricity made from the direct sunlight?',
      options: ['is', 'are', 'was', 'were'],
      correctAnswer: 'is',
      explanation: "'Electricity' (sanalmaydi/birlik) uchun hozirgi oddiy zamon majhul savoli: 'How is electricity made?'"
    },
    {
      id: 'od5_q23',
      question: 'If she ________ to school, she would learn these fascinating rules.',
      options: ['went', 'goes', 'will go', 'going'],
      correctAnswer: 'went',
      explanation: "2nd Conditional If qismi: Past Simple 'went'."
    },
    {
      id: 'od5_q24',
      question: 'A beautiful song ________ sung by the young girl.',
      options: ['is', 'are', 'were', 'be'],
      correctAnswer: 'is',
      explanation: "Birlik 'song' uchun hozirgi zamonda majhullik: 'is sung'."
    },
    {
      id: 'od5_q25',
      question: 'I saw an accident while I ________ to work in the morning.',
      options: ['was driving', 'were driving', 'drove', 'drive'],
      correctAnswer: 'was driving',
      explanation: "'I' uchun o'tgan davomiy zamon 'was driving' bo'ladi."
    },
    {
      id: 'od5_q26',
      question: 'These plastic bottles ________ thrown into the oceans every minute.',
      options: ['are', 'is', 'was', 'were'],
      correctAnswer: 'are',
      explanation: "Present Simple Passive ko'plik (bottles): 'are thrown'."
    },
    {
      id: 'od5_q27',
      question: 'What ________ you do if you won a scholarship to Oxford University?',
      options: ['would', 'will', 'did', 'do'],
      correctAnswer: 'would',
      explanation: "2nd Conditional savolidagi so'roq modal: 'What would you do...?'"
    },
    {
      id: 'od5_q28',
      question: 'The book ________ published by Oxford University Press last year.',
      options: ['was', 'were', 'is', 'did'],
      correctAnswer: 'was',
      explanation: "O'tgan zamondagi birlik majhul: 'The book was published'."
    },
    {
      id: 'od5_q29',
      question: 'While the farmers ________ harvesting wheat, it started to hail.',
      options: ['were', 'was', 'are', 'did'],
      correctAnswer: 'were',
      explanation: "O'tgan davomiy yordamchisi ko'plikka 'were' to'g'ri keladi."
    },
    {
      id: 'od5_q30',
      question: 'These environmental problems ________ caused by global pollution.',
      options: ['are', 'is', 'was', 'be'],
      correctAnswer: 'are',
      explanation: "Ko'plik 'problems' uchun nojoiz ta'sir majhul nisbatan 'are caused'."
    }
  ],
  'od6': [
    {
      id: 'od6_q1',
      question: 'If the world leaders ________ early, they would have prevented global warming.',
      options: ['had acted', 'acted', 'have acted', 'would act'],
      correctAnswer: 'had acted',
      explanation: "Uchinchi shartli gap (3rd Conditional - o'tmish afsusi): If + Past Perfect (had + V3), would have + V3."
    },
    {
      id: 'od6_q2',
      question: 'He said that he ________ visiting the scientific greenhouse the next day.',
      options: ['was', 'is', 'will be', 'had been'],
      correctAnswer: 'was',
      explanation: "O'zlashtirma gapda (Reported Speech) zamonlar siljiydi: 'is/am' -> 'was' (He said he was visiting)."
    },
    {
      id: 'od6_q3',
      question: 'Look at those heavy black clouds. It ________ rain heavily.',
      options: ['must', 'might', 'is going to', 'will have'],
      correctAnswer: 'is going to',
      explanation: "Hozirgi yaqqol dalilga asoslangan kelajak bashorati 'is going to' bilan ifodalanadi."
    },
    {
      id: 'od6_q4',
      question: 'If you had studied harder, you ________ your science exam.',
      options: ['would have passed', 'passed', 'would pass', 'will pass'],
      correctAnswer: 'would have passed',
      explanation: "3rd Conditional natija qismi: would have + V3 (passed)."
    },
    {
      id: 'od6_q5',
      question: 'She asked me where I ________ my summer holidays.',
      options: ['had spent', 'spent', 'spend', 'will spend'],
      correctAnswer: 'had spent',
      explanation: "O'zlashtirma so'roq gapda o'tgan zamon Past Perfect'ga o'tadi: 'had spent'."
    },
    {
      id: 'od6_q6',
      question: 'That giant fossil ________ belong to a Tyrannosaurus Rex.',
      options: ['must', 'can', 'shoulds', 'must to'],
      correctAnswer: 'must',
      explanation: "Deyarli 100% ishonch bilan qilinayotgan mantiqiy xulosa uchun 'must' modali ishlatiladi."
    },
    {
      id: 'od6_q7',
      question: 'They told us that the laboratory ________ closed on Sundays.',
      options: ['was', 'is', 'will be', 'has been'],
      correctAnswer: 'was',
      explanation: "O'zlashtirma gap doirasida zamonlar siljishi (Present 'is' -> Past 'was') bo'ladi."
    },
    {
      id: 'od6_q8',
      question: 'If the spacecraft ________ launched earlier, it would have reached Mars.',
      options: ['had been', 'was', 'is', 'had'],
      correctAnswer: 'had been',
      explanation: "3rd Conditional If qismida majhul shakl: If + Past Perfect Passive (had been + V3)."
    },
    {
      id: 'od6_q9',
      question: 'She said, "I like biology." -> She said that she ________ biology.',
      options: ['liked', 'likes', 'had liked', 'would like'],
      correctAnswer: 'liked',
      explanation: "O'zlashtirma gapda hozirgi oddiy zamon ('like') o'tgan oddiy zamonga ('liked') aylanadi."
    },
    {
      id: 'od6_q10',
      question: 'Humanity ________ colonize the Moon in the next 50 years; it is possible but not certain.',
      options: ['might', 'must', 'cannot', 'will certainly'],
      correctAnswer: 'might',
      explanation: "Ehtimoli kamroq yoki aniq bo'lmagan kelajak holati uchun 'might' (ehtimol / balki) modali ishlatiladi."
    },
    {
      id: 'od6_q11',
      question: 'If you ________ me, I would have sent you the scientific article.',
      options: ['had asked', 'asked', 'would ask', 'have asked'],
      correctAnswer: 'had asked',
      explanation: "3rd Conditional if shakli: 'had asked' (Past Perfect)."
    },
    {
      id: 'od6_q12',
      question: 'The physics teacher asked me if I ________ the formula.',
      options: ['understood', 'understand', 'had understood', 'will understand'],
      correctAnswer: 'had understood',
      explanation: "So'roq o'zlashtirilganda 'Did you understand?' savoli Past Perfect shaklga ('had understood') ko'chadi."
    },
    {
      id: 'od6_q13',
      question: 'Astronomers say that those distant stars ________ burn out soon.',
      options: ['might', 'must', 'shoulds', 'are to'],
      correctAnswer: 'might',
      explanation: "Kelajakda ruxsat etilgan noaniq taxmin: 'might burn out'."
    },
    {
      id: 'od6_q14',
      question: 'If he ________ worn a winter coat, he would not have caught a cold.',
      options: ['had', 'has', 'was', 'would'],
      correctAnswer: 'had',
      explanation: "3rd Conditional 'If he had worn'."
    },
    {
      id: 'od6_q15',
      question: 'She told me that she ________ seen a real glacier before.',
      options: ['had never', 'has never', 'would never', 'did never'],
      correctAnswer: 'had never',
      explanation: "O'zlashtirmada o'tgan zamonga qadar bo'lgan tajriba Past Perfect bo'ladi: 'had never seen'."
    },
    {
      id: 'od6_q16',
      question: 'Listen! That instrument sounds amazing. It ________ very expensive.',
      options: ['must be', 'might be', 'should be', 'must to be'],
      correctAnswer: 'must be',
      explanation: "Deyarli aniq bo'lgan mantiqiy taxmin 'must be' orqali beriladi."
    },
    {
      id: 'od6_q17',
      question: 'If we ________ the plastic pollution, marine animals would have survived.',
      options: ['had reduced', 'reduced', 'have reduced', 'would reduce'],
      correctAnswer: 'had reduced',
      explanation: "3rd Conditional If formulasi: had + reduced."
    },
    {
      id: 'od6_q18',
      question: 'The prime minister announced that they ________ build a new clean power grid.',
      options: ['would', 'will', 'are going to', 'shall'],
      correctAnswer: 'would',
      explanation: "O'zlashtirmada kelasi zamon istagi 'will' dan 'would' ga muvofiqlashadi."
    },
    {
      id: 'od6_q19',
      question: 'He looks extremely pale. He ________ sick.',
      options: ['must be', 'cannot be', 'should to be', 'was'],
      correctAnswer: 'must be',
      explanation: "Tashqi ko'rinishdan kuchli taxmin: 'He must be sick' (U kasal bo'lishi kerak)."
    },
    {
      id: 'od6_q20',
      question: 'If the scientific probe ________ landed safely, we would have received pictures.',
      options: ['had', 'has', 'was', 'visited'],
      correctAnswer: 'had',
      explanation: "3rd Conditional If qismi: 'If the probe had landed'."
    },
    {
      id: 'od6_q21',
      question: 'She said that she ______ not come to the lab the next day.',
      options: ['would', 'will', 'is', 'does'],
      correctAnswer: 'would',
      explanation: "O'zlashtirish kelasi zamoni: 'would not come'."
    },
    {
      id: 'od6_q22',
      question: 'Astronomers think that those lights ________ satellites.',
      options: ['might be', 'must to be', 'are to', 'should to be'],
      correctAnswer: 'might be',
      explanation: "Astronomlar mutlaq amin bo'lmagani uchun taxmin: 'might be' (sun'iy yo'ldoshlar bo'lishi mumkin)."
    },
    {
      id: 'od6_q23',
      question: 'If you had warned us about the storm, we ________ home.',
      options: ['would have stayed', 'stayed', 'would stay', 'will stay'],
      correctAnswer: 'would have stayed',
      explanation: "3rd Conditional oqibati: would have + V3 ('stayed')."
    },
    {
      id: 'od6_q24',
      question: 'The professor explained that water ________ at 100 degrees.',
      options: ['boils', 'boiled', 'boil', 'boiling'],
      correctAnswer: 'boils',
      explanation: "Ilmiy haqiqat o'zlashtirilganda Present Simple o'zgarishsiz qolishi mumkin."
    },
    {
      id: 'od6_q25',
      question: 'Where is my pen? It is not here. Somebody ________ taken it.',
      options: ['must have', 'must', 'can', 'should have to'],
      correctAnswer: 'must have',
      explanation: "O'tmishdagi harakatga nisbatan kuchli mantiqiy xulosa: must have + V3."
    },
    {
      id: 'od6_q26',
      question: 'If they ________ the research project, they would have discovered the cure.',
      options: ['had funded', 'funded', 'have funded', 'would fund'],
      correctAnswer: 'had funded',
      explanation: "3rd Conditional If qismining to'g'ri shakli: had + funded."
    },
    {
      id: 'od6_q27',
      question: 'He whispered that he ________ finished the biology exam.',
      options: ['had', 'has', 'was', 'did'],
      correctAnswer: 'had',
      explanation: "O'zlashtirmada 'I have finished' bo'lgan gap 'he had finished' ga almashadi."
    },
    {
      id: 'od6_q28',
      question: 'These footprint marks in the forest ________ be from a large grizzly bear.',
      options: ['could', 'shoulds', 'must to', 'are'],
      correctAnswer: 'could',
      explanation: "Ehtimollikni (mukammal emas) ifodalashda 'could' (bo'lishi mumkin) qo'llaniladi."
    },
    {
      id: 'od6_q29',
      question: 'If you had arrived on time, you ________ the train.',
      options: ['would have caught', 'caught', 'would catch', 'will catch'],
      correctAnswer: 'would have caught',
      explanation: "3rd Conditional oqibati Past formatda: 'would have caught'."
    },
    {
      id: 'od6_q30',
      question: 'They stated that they ________ launching a green research rocket.',
      options: ['were', 'are', 'was', 'been'],
      correctAnswer: 'were',
      explanation: "O'zlashtirma gapda ko'plik 'they' hamrohida 'were launching' to'g'ri keladi."
    }
  ]
};
