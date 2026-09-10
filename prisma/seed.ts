import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedWord = { kana: string; romaji: string; meaning?: string };
type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  order: number;
  words: SeedWord[];
};

const categories: SeedCategory[] = [
  {
    slug: "vowels",
    name: "Vowels (a, i, u, e, o)",
    description: "The five basic hiragana vowels — the foundation of every other sound.",
    order: 1,
    words: [
      { kana: "あ", romaji: "a" },
      { kana: "い", romaji: "i" },
      { kana: "う", romaji: "u" },
      { kana: "え", romaji: "e" },
      { kana: "お", romaji: "o" },
    ],
  },
  {
    slug: "k-row",
    name: "K-Row (ka, ki, ku, ke, ko)",
    description: "Hiragana starting with the K sound.",
    order: 2,
    words: [
      { kana: "か", romaji: "ka" },
      { kana: "き", romaji: "ki" },
      { kana: "く", romaji: "ku" },
      { kana: "け", romaji: "ke" },
      { kana: "こ", romaji: "ko" },
    ],
  },
  {
    slug: "s-row",
    name: "S-Row (sa, shi, su, se, so)",
    description: "Hiragana starting with the S sound.",
    order: 3,
    words: [
      { kana: "さ", romaji: "sa" },
      { kana: "し", romaji: "shi" },
      { kana: "す", romaji: "su" },
      { kana: "せ", romaji: "se" },
      { kana: "そ", romaji: "so" },
    ],
  },
  {
    slug: "t-row",
    name: "T-Row (ta, chi, tsu, te, to)",
    description: "Hiragana starting with the T sound.",
    order: 4,
    words: [
      { kana: "た", romaji: "ta" },
      { kana: "ち", romaji: "chi" },
      { kana: "つ", romaji: "tsu" },
      { kana: "て", romaji: "te" },
      { kana: "と", romaji: "to" },
    ],
  },
  {
    slug: "n-row",
    name: "N-Row (na, ni, nu, ne, no)",
    description: "Hiragana starting with the N sound.",
    order: 5,
    words: [
      { kana: "な", romaji: "na" },
      { kana: "に", romaji: "ni" },
      { kana: "ぬ", romaji: "nu" },
      { kana: "ね", romaji: "ne" },
      { kana: "の", romaji: "no" },
    ],
  },
  {
    slug: "h-row",
    name: "H-Row (ha, hi, fu, he, ho)",
    description: "Hiragana starting with the H sound.",
    order: 6,
    words: [
      { kana: "は", romaji: "ha" },
      { kana: "ひ", romaji: "hi" },
      { kana: "ふ", romaji: "fu" },
      { kana: "へ", romaji: "he" },
      { kana: "ほ", romaji: "ho" },
    ],
  },
  {
    slug: "m-row",
    name: "M-Row (ma, mi, mu, me, mo)",
    description: "Hiragana starting with the M sound.",
    order: 7,
    words: [
      { kana: "ま", romaji: "ma" },
      { kana: "み", romaji: "mi" },
      { kana: "む", romaji: "mu" },
      { kana: "め", romaji: "me" },
      { kana: "も", romaji: "mo" },
    ],
  },
  {
    slug: "y-row",
    name: "Y-Row (ya, yu, yo)",
    description: "Hiragana starting with the Y sound.",
    order: 8,
    words: [
      { kana: "や", romaji: "ya" },
      { kana: "ゆ", romaji: "yu" },
      { kana: "よ", romaji: "yo" },
    ],
  },
  {
    slug: "r-row",
    name: "R-Row (ra, ri, ru, re, ro)",
    description: "Hiragana starting with the R sound.",
    order: 9,
    words: [
      { kana: "ら", romaji: "ra" },
      { kana: "り", romaji: "ri" },
      { kana: "る", romaji: "ru" },
      { kana: "れ", romaji: "re" },
      { kana: "ろ", romaji: "ro" },
    ],
  },
  {
    slug: "w-row-n",
    name: "W-Row & N (wa, i, e, o, n)",
    description: "The final basic sounds, including the standalone ん (n).",
    order: 10,
    words: [
      { kana: "わ", romaji: "wa" },
      { kana: "ゐ", romaji: "i", meaning: "archaic wi" },
      { kana: "ゑ", romaji: "e", meaning: "archaic we" },
      { kana: "を", romaji: "o", meaning: "particle o" },
      { kana: "ん", romaji: "n" },
    ],
  },
  {
    slug: "dakuten-g-z",
    name: "Dakuten: G & Z rows",
    description: "Voiced sounds marked with dakuten (゛): ga-row and za-row.",
    order: 11,
    words: [
      { kana: "が", romaji: "ga" },
      { kana: "ぎ", romaji: "gi" },
      { kana: "ぐ", romaji: "gu" },
      { kana: "げ", romaji: "ge" },
      { kana: "ご", romaji: "go" },
      { kana: "ざ", romaji: "za" },
      { kana: "じ", romaji: "ji" },
      { kana: "ず", romaji: "zu" },
      { kana: "ぜ", romaji: "ze" },
      { kana: "ぞ", romaji: "zo" },
    ],
  },
  {
    slug: "dakuten-d-b",
    name: "Dakuten: D & B rows",
    description: "Voiced sounds marked with dakuten (゛): da-row and ba-row.",
    order: 12,
    words: [
      { kana: "だ", romaji: "da" },
      { kana: "ぢ", romaji: "ji" },
      { kana: "づ", romaji: "zu" },
      { kana: "で", romaji: "de" },
      { kana: "ど", romaji: "do" },
      { kana: "ば", romaji: "ba" },
      { kana: "び", romaji: "bi" },
      { kana: "ぶ", romaji: "bu" },
      { kana: "べ", romaji: "be" },
      { kana: "ぼ", romaji: "bo" },
    ],
  },
  {
    slug: "handakuten-p",
    name: "Handakuten: P-Row",
    description: "Semi-voiced sounds marked with handakuten (゜): pa-row.",
    order: 13,
    words: [
      { kana: "ぱ", romaji: "pa" },
      { kana: "ぴ", romaji: "pi" },
      { kana: "ぷ", romaji: "pu" },
      { kana: "ぺ", romaji: "pe" },
      { kana: "ぽ", romaji: "po" },
    ],
  },
  {
    slug: "yoon-k-s",
    name: "Combos: Kya & Sha rows",
    description: "Contracted sounds (ya/yu/yo combined with a consonant): kya and sha rows.",
    order: 14,
    words: [
      { kana: "きゃ", romaji: "kya" },
      { kana: "きゅ", romaji: "kyu" },
      { kana: "きょ", romaji: "kyo" },
      { kana: "しゃ", romaji: "sha" },
      { kana: "しゅ", romaji: "shu" },
      { kana: "しょ", romaji: "sho" },
    ],
  },
  {
    slug: "yoon-ch-ny",
    name: "Combos: Cha & Nya rows",
    description: "Contracted sounds: cha and nya rows.",
    order: 15,
    words: [
      { kana: "ちゃ", romaji: "cha" },
      { kana: "ちゅ", romaji: "chu" },
      { kana: "ちょ", romaji: "cho" },
      { kana: "にゃ", romaji: "nya" },
      { kana: "にゅ", romaji: "nyu" },
      { kana: "にょ", romaji: "nyo" },
    ],
  },
  {
    slug: "yoon-hy-my-ry",
    name: "Combos: Hya, Mya & Rya rows",
    description: "Contracted sounds: hya, mya, and rya rows.",
    order: 16,
    words: [
      { kana: "ひゃ", romaji: "hya" },
      { kana: "ひゅ", romaji: "hyu" },
      { kana: "ひょ", romaji: "hyo" },
      { kana: "みゃ", romaji: "mya" },
      { kana: "みゅ", romaji: "myu" },
      { kana: "みょ", romaji: "myo" },
      { kana: "りゃ", romaji: "rya" },
      { kana: "りゅ", romaji: "ryu" },
      { kana: "りょ", romaji: "ryo" },
    ],
  },
  {
    slug: "yoon-voiced",
    name: "Combos: Voiced (Gya, Ja, Bya, Pya)",
    description: "Contracted voiced sounds: gya, ja, bya, and pya rows.",
    order: 17,
    words: [
      { kana: "ぎゃ", romaji: "gya" },
      { kana: "ぎゅ", romaji: "gyu" },
      { kana: "ぎょ", romaji: "gyo" },
      { kana: "じゃ", romaji: "ja" },
      { kana: "じゅ", romaji: "ju" },
      { kana: "じょ", romaji: "jo" },
      { kana: "びゃ", romaji: "bya" },
      { kana: "びゅ", romaji: "byu" },
      { kana: "びょ", romaji: "byo" },
      { kana: "ぴゃ", romaji: "pya" },
      { kana: "ぴゅ", romaji: "pyu" },
      { kana: "ぴょ", romaji: "pyo" },
    ],
  },
];

async function main() {
  console.log("Seeding categories and words...");

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        order: cat.order,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        order: cat.order,
      },
    });

    for (let i = 0; i < cat.words.length; i++) {
      const w = cat.words[i];
      const existing = await prisma.word.findFirst({
        where: { categoryId: category.id, kana: w.kana },
      });
      if (existing) {
        await prisma.word.update({
          where: { id: existing.id },
          data: { romaji: w.romaji, meaning: w.meaning ?? null, order: i },
        });
      } else {
        await prisma.word.create({
          data: {
            kana: w.kana,
            romaji: w.romaji,
            meaning: w.meaning ?? null,
            categoryId: category.id,
            order: i,
          },
        });
      }
    }
    console.log(`  ✓ ${cat.name} (${cat.words.length} words)`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
