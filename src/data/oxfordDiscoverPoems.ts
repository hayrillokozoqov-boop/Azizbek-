/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PoemLine {
  english: string;
  uzbek: string;
}

export interface OxfordPoem {
  id: string;
  title: string;
  emoji: string;
  unitRange: string;
  themeUz: string;
  bigQuestion: string;
  lines: PoemLine[];
}

export const oxfordDiscoverPoems: OxfordPoem[] = [
  {
    id: 'oxp1',
    title: 'Animal Homes',
    emoji: '🦁',
    unitRange: 'Units 1-2',
    themeUz: 'Hayvonlar uylari va joylashuvi',
    bigQuestion: 'Where do animals live?',
    lines: [
      { english: 'Where do animals live?', uzbek: 'Hayvonlar qayerda yashaydi?' },
      { english: 'Let us take a look!', uzbek: 'Keling bir ko\'z yugurtiramiz!' },
      { english: 'The birds are in high trees, reading no book.', uzbek: 'Qushlar baland daraxtlarda, kitob o\'qimaydi.' },
      { english: 'A sleepy brown bear is in a cave, quiet and deep.', uzbek: 'Semiz qo\'ng\'ir ayiq g\'orda, sokin va chuqur.' },
      { english: 'A tiny golden fish in the pond, fast asleep.', uzbek: 'Hovuzda mittigina oltin baliqcha, tezda uxlab qolgan.' },
      { english: 'The camel is walking on the dry hot sand.', uzbek: 'Tuya quruq issiq qumda yurmoqda.' },
      { english: 'And animals are everywhere in this beautiful land!', uzbek: 'Va hayvonlar bu go\'zal o\'lkada hamma joyda!' }
    ]
  },
  {
    id: 'oxp2',
    title: 'My Five Senses',
    emoji: '👀',
    unitRange: 'Units 3-4',
    themeUz: 'Inson va hayvonlar idrok sezgisi',
    bigQuestion: 'How do we use our senses?',
    lines: [
      { english: 'I see with my eyes, the trees so green.', uzbek: 'Ko\'zlarim bilan ko\'raman, shunchalar yashil daraxtlarni.' },
      { english: 'I hear with my ears, the birds in between.', uzbek: 'Quloqlarim bilan eshitaman, qushlar sadosini.' },
      { english: 'I smell with my nose, a beautiful flower.', uzbek: 'Burnim bilan hidlayman, go\'zal bitta gulni.' },
      { english: 'I taste with my tongue, sweet fruits every hour.', uzbek: 'Tilim bilan tatib ko\'raman, har soatda shirin mevalarni.' },
      { english: 'I touch with my hands, the soft warm ground.', uzbek: 'Qo\'llarim bilan ushlayman, yumshoq iliq tuproqni.' },
      { english: 'These are the five senses I have found!', uzbek: 'Bular men bilib olgan beshta sezgidir!' }
    ]
  },
  {
    id: 'oxp3',
    title: 'The Food We Grow',
    emoji: '🍎',
    unitRange: 'Units 5-6',
    themeUz: 'Oziq-ovqat va uning tabiiy kelib chiqishi',
    bigQuestion: 'Where does our food come from?',
    lines: [
      { english: 'Apples on the high trees, red and sweet.', uzbek: 'Baland daraxtlardagi olmalar, qizil va shirin.' },
      { english: 'Carrots down in the ground, a tasty treat.', uzbek: 'Er ostidagi sabzilar, mazali qizil noz-ne\'mat.' },
      { english: 'Golden wheat in the field, turning to bread.', uzbek: 'Daladagi oltin bug\'doylar, nonga aylanmoqda.' },
      { english: 'Thanks to the cool rain and the sun overhead.', uzbek: 'Tepadagi iliq quyosh va mayda yomg\'irga rahmat.' },
      { english: 'We plant the tiny seeds and watch them grow.', uzbek: 'Biz mitti urug\'larni ekamiz va ularning o\'sishini kuzatamiz.' },
      { english: 'Healthy and fresh veggies, in a neat green row.', uzbek: 'Sog\'lom va yangi sabzavotlar, tekis yashil qatorda.' }
    ]
  },
  {
    id: 'oxp4',
    title: 'Making Beautiful Music',
    emoji: '🎻',
    unitRange: 'Units 13-14',
    themeUz: 'Musiqa asboblari va ohanglar',
    bigQuestion: 'How do we make music?',
    lines: [
      { english: 'Play the small violin, slide the bow.', uzbek: 'Kichkina skripkani chal, kamonchasini yurgiz.' },
      { english: 'Play the grand piano, high and low.', uzbek: 'Katta fortepianoni chal, baland va past ohangda.' },
      { english: 'Tap the loud drums and make a clear beat.', uzbek: 'Baland barabanlarni ur va aniq ritm yarat.' },
      { english: 'Move your hands and stamp your feet.', uzbek: 'Qo\'llaringni qimirlat va oyoqlarig bilan gupillat.' },
      { english: 'We make sweet music together today.', uzbek: 'Biz bugun birgalikda shirin musiqa yaratamiz.' },
      { english: 'A lovely clear sound as we play!', uzbek: 'O\'ynayotganimizda juda yoqimli va tiniq ovoz yangraydi!' }
    ]
  },
  {
    id: 'oxp5',
    title: 'Up in the Blue Sky',
    emoji: '🚀',
    unitRange: 'Units 17-18',
    themeUz: 'Yer sayyorasi, oy va yulduzlar',
    bigQuestion: 'What is our solar system?',
    lines: [
      { english: 'The bright sun shines all through the day.', uzbek: 'Yorqin quyosh kun bo\'yi nur taratadi.' },
      { english: 'The silver moon and stars are not far away.', uzbek: 'Kumushrang oy va yulduzlar unchalik uzoqda emas.' },
      { english: 'Earth is our home planet, with oceans so blue.', uzbek: 'Yer - bizning umumiy sayyoramiz, okeanlari benihoyat moviy.' },
      { english: 'Lots of animals and plants live here with you.', uzbek: 'Ko\'plab hayvonlar va o\'simliklar siz bilan bu yerda yashaydi.' },
      { english: 'We look up high, so far and so bright.', uzbek: 'Biz baland osmonga qaraymiz, shunchalik uzoq va porloq.' },
      { english: 'And dream of the shiny stars in the quiet night.', uzbek: 'Va sokin tunda yaltiroq yulduzlar haqida orzu qilamiz.' }
    ]
  }
];
