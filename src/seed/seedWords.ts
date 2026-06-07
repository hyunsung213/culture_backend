import { testDatabaseConnection } from "../config/database";
import { MOCK_USER_ID } from "../middlewares/mockAuth.middleware";
import { Op } from "sequelize";
import {
  initModels,
  sequelize,
  User,
  Word,
  WordExample,
  WordUsagePattern,
} from "../models";

type SeedExample = {
  exampleKo: string;
  exampleEn: string;
  exampleType: "spoken" | "formal" | "writing";
};

type SeedWord = {
  korean: string;
  type: string;
  partOfSpeech: string;
  romanization: string;
  englishTitle: string;
  shortMeaningKo: string;
  shortMeaningEn: string;
  fullMeaningKo: string;
  fullMeaningEn: string;
  usageTip: string;
  difficulty: string;
  tags: string[];
  sortOrder: number;
  cultureNote: string;
  examples: SeedExample[];
};

const ensureMockUser = async (): Promise<void> => {
  await User.findOrCreate({
    where: { id: MOCK_USER_ID },
    defaults: {
      id: MOCK_USER_ID,
      loginId: "demo",
      email: "demo@ieung.app",
      name: "Demo User",
      provider: "email",
      nativeLanguage: "en",
      koreanLevel: "intermediate",
    },
  });
};

export const seedWordsData: SeedWord[] = [
{
    "korean": "정",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Jeong",
    "englishTitle": "Affection / Attachment",
    "shortMeaningKo": "무엇을 느껴서 생기는 마음.",
    "shortMeaningEn": "A feeling that arises from experiencing something.",
    "fullMeaningKo": "1. 무엇을 느껴서 생기는 마음. 2. 사랑하거나 사이가 가깝다고 느끼는 마음.",
    "fullMeaningEn": "1. A feeling that arises from experiencing something. 2. A feeling of love or closeness to someone.",
    "usageTip": "오랜 시간 관계를 맺으며 감정이 쌓였을 때 '정이 들다', '정이 많다'와 같이 자주 사용합니다.",
    "difficulty": "intermediate",
    "tags": [
      "관계",
      "감정",
      "시간"
    ],
    "sortOrder": 1,
    "cultureNote": "한국 문화에서 인간관계와 시간의 축적을 설명하는 대표 정서어",
    "examples": [
      {
        "exampleKo": "그녀와 정이 많이 들었다.",
        "exampleEn": "I had a lot of affection for her.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그 식당 사장님은 손님들에게 정이 많다.",
        "exampleEn": "The restaurant owner has a lot of affection for the customers.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "서운하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Seounhada",
    "englishTitle": "Disappointed / Hurt",
    "shortMeaningKo": "생각처럼 되지 않아 만족스럽지 못하다.",
    "shortMeaningEn": "Feeling dissatisfied because things did not go as expected or hoped.",
    "fullMeaningKo": "1. 생각처럼 되지 않아 만족스럽지 못하다.",
    "fullMeaningEn": "1. Feeling dissatisfied because things did not go as expected or hoped.",
    "usageTip": "가까운 사이에서 기대했던 배려나 관심을 받지 못해 마음이 상했을 때 '서운해'라고 표현합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "관계",
      "기대"
    ],
    "sortOrder": 2,
    "cultureNote": "관계 속 기대가 충족되지 않았을 때 느끼는 감정을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "생일인데 친구에게 연락이 없어서 서운했다.",
        "exampleEn": "It was my birthday, but I was sad because I didn't hear from my friend.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그와 같이 가기로 했는데 그가 혼자 가서 조금 서운했다.",
        "exampleEn": "I was going to go with him, but I was a little disappointed because he went alone.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "인연",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Inyeon",
    "englishTitle": "Fate / Connection",
    "shortMeaningKo": "사람들 사이에 맺어지는 관계.",
    "shortMeaningEn": "A relationship formed between people.",
    "fullMeaningKo": "1. 사람들 사이에 맺어지는 관계. 2. 어떤 사물과 맺어지는 관계. 3. 어떤 일의 이유나 내력.",
    "fullMeaningEn": "1. A relationship formed between people. 2. A relationship formed with a certain object. 3. The reason or history behind a certain event.",
    "usageTip": "우연한 만남이 특별하게 느껴질 때 '우리는 인연인가 봐'라고 표현합니다.",
    "difficulty": "intermediate",
    "tags": [
      "관계",
      "운명",
      "만남"
    ],
    "sortOrder": 3,
    "cultureNote": "사람 간 만남을 우연 이상의 의미로 설명하는 문화어휘",
    "examples": [
      {
        "exampleKo": "우리는 우연한 인연으로 만나 결혼했다.",
        "exampleEn": "We met by chance and got married.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "좋은 인연을 만나게 되어 기쁘다.",
        "exampleEn": "I'm happy to meet a good relationship.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "의리",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Uiri",
    "englishTitle": "Loyalty / Fidelity",
    "shortMeaningKo": "사람으로서 지켜야 할 도리.",
    "shortMeaningEn": "The duty one must observe as a human being.",
    "fullMeaningKo": "1. 사람으로서 지켜야 할 도리. 2. 사람과의 관계에서 지켜야 할 바른 도리. 3. 피가 섞이지 않은 남과 맺은 혈연과 같은 관계.",
    "fullMeaningEn": "1. The duty one must observe as a human being. 2. The right duty one must observe in relationships with people. 3. A blood-like bond formed with others who are not related by blood.",
    "usageTip": "친구나 동료를 배신하지 않고 끝까지 믿음을 지킬 때 '의리를 지키다'라고 씁니다.",
    "difficulty": "intermediate",
    "tags": [
      "관계",
      "신뢰",
      "책임"
    ],
    "sortOrder": 4,
    "cultureNote": "친구나 공동체 관계에서 신뢰와 책임을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "그는 친구와의 의리를 중요하게 생각한다.",
        "exampleEn": "He values loyalty to his friends.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "어려울 때 도와주는 것이 의리라고 생각한다.",
        "exampleEn": "I think it's loyalty to help in times of need.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "효",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Hyo",
    "englishTitle": "Filial Piety",
    "shortMeaningKo": "부모를 잘 모시어 받드는 일.",
    "shortMeaningEn": "The act of devotedly serving and respecting one's parents.",
    "fullMeaningKo": "1. 부모를 잘 모시어 받드는 일.",
    "fullMeaningEn": "1. The act of devotedly serving and respecting one's parents.",
    "usageTip": "부모님께 정성을 다하는 행동을 '효도(하다)'라는 파생어로 흔히 사용합니다.",
    "difficulty": "advanced",
    "tags": [
      "가족",
      "예절",
      "전통"
    ],
    "sortOrder": 5,
    "cultureNote": "부모와 가족 관계를 설명하는 전통적 가치어",
    "examples": [
      {
        "exampleKo": "부모님께 효를 다하고 싶다.",
        "exampleEn": "I want to do my best to my parents.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "부모님을 많이 도와드리는 것이 최고의 효이다.",
        "exampleEn": "Helping your parents a lot is the best filial piety.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "한",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Han",
    "englishTitle": "Deep Sorrow / Resentment",
    "shortMeaningKo": "몹시 원망스럽고 억울하거나 안타깝고 슬퍼서 응어리진 마음.",
    "shortMeaningEn": "A deeply knotted feeling in the heart due to intense resentment, unfairness, regret, and sorrow.",
    "fullMeaningKo": "1. 몹시 원망스럽고 억울하거나 안타깝고 슬퍼서 응어리진 마음.",
    "fullMeaningEn": "1. A deeply knotted feeling in the heart due to intense resentment, unfairness, regret, and sorrow.",
    "usageTip": "가슴 속에 깊이 맺힌 억울함이나 슬픔을 묘사할 때 '한이 맺히다', '한을 풀다'라고 표현합니다.",
    "difficulty": "advanced",
    "tags": [
      "감정",
      "역사",
      "문화"
    ],
    "sortOrder": 6,
    "cultureNote": "억울함과 슬픔이 오래 쌓인 정서를 설명하는 문화어휘",
    "examples": [
      {
        "exampleKo": "그는 어린 시절의 한을 아직도 잊지 못했다.",
        "exampleEn": "He still could not forget the han from his childhood.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "오랫동안 품어 온 한이 풀렸다.",
        "exampleEn": "The han he had carried for a long time was finally resolved.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "체면",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Chemyeon",
    "englishTitle": "Face / Dignity",
    "shortMeaningKo": "남을 대하기에 떳떳한 입장이나 얼굴.",
    "shortMeaningEn": "An honorable position or face (dignity) to maintain when facing others.",
    "fullMeaningKo": "1. 남을 대하기에 떳떳한 입장이나 얼굴.",
    "fullMeaningEn": "1. An honorable position or face (dignity) to maintain when facing others.",
    "usageTip": "다른 사람의 시선이나 사회적 위치를 신경 써서 행동할 때 '체면을 차리다', '체면이 깎이다'로 활용합니다.",
    "difficulty": "advanced",
    "tags": [
      "사회생활",
      "이미지",
      "예절"
    ],
    "sortOrder": 7,
    "cultureNote": "사회적 이미지와 관계 유지 맥락을 설명하는 표현",
    "examples": [
      {
        "exampleKo": "사람들 앞에서 혼나서 체면을 구겼다.",
        "exampleEn": "I lost face because I was scolded in public.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그가 배려해줘서 체면이 섰다.",
        "exampleEn": "His consideration saved me face.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "배려",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Baeryeo",
    "englishTitle": "Consideration / Care",
    "shortMeaningKo": "도와주거나 보살펴 줌.",
    "shortMeaningEn": "Helping or taking care of someone.",
    "fullMeaningKo": "1. 도와주거나 보살펴 줌.",
    "fullMeaningEn": "1. Helping or taking care of someone.",
    "usageTip": "상대방의 입장이나 편의를 먼저 생각해주고 양보할 때 '배려하다', '배려심이 깊다'라고 말합니다.",
    "difficulty": "intermediate",
    "tags": [
      "관계",
      "예절",
      "공동체"
    ],
    "sortOrder": 8,
    "cultureNote": "상대방을 고려하는 말하기 방식과 연결되는 표현",
    "examples": [
      {
        "exampleKo": "노약자를 위한 배려가 필요하다.",
        "exampleEn": "Consideration is needed for the elderly and the weak.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그의 작은 배려에 감동했다.",
        "exampleEn": "I was moved by his little consideration.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "겸손",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Gyeomson",
    "englishTitle": "Modesty / Humility",
    "shortMeaningKo": "남을 존중하고 자기를 낮추는 마음이나 태도.",
    "shortMeaningEn": "A mind or attitude of respecting others and humbling oneself.",
    "fullMeaningKo": "1. 남을 존중하고 자기를 낮추는 마음이나 태도.",
    "fullMeaningEn": "1. A mind or attitude of respecting others and humbling oneself.",
    "usageTip": "칭찬을 받았을 때 자신을 낮추며 정중하게 대답하는 태도를 '겸손하다'고 표현합니다.",
    "difficulty": "intermediate",
    "tags": [
      "태도",
      "예절",
      "관계"
    ],
    "sortOrder": 9,
    "cultureNote": "자기표현을 낮추고 상대를 존중하는 말하기 문화와 연결된 표현",
    "examples": [
      {
        "exampleKo": "그는 여전히 겸손하다",
        "exampleEn": "He is still humble.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "겸손한 태도는 좋은 인상을 준다.",
        "exampleEn": "A humble attitude makes a good impression.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "소신",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Sosin",
    "englishTitle": "Conviction / Belief",
    "shortMeaningKo": "굳게 믿는 생각.",
    "shortMeaningEn": "A firmly held belief or conviction.",
    "fullMeaningKo": "1. 굳게 믿는 생각.",
    "fullMeaningEn": "1. A firmly held belief or conviction.",
    "usageTip": "남의 의견에 휘둘리지 않고 자신의 뚜렷한 생각을 지킬 때 '소신이 있다', '소신껏 행동하다'라고 합니다.",
    "difficulty": "advanced",
    "tags": [
      "가치관",
      "태도",
      "자기표현"
    ],
    "sortOrder": 10,
    "cultureNote": "자기 의견과 원칙을 지키는 태도를 나타내는 표현",
    "examples": [
      {
        "exampleKo": "그는 소신 있게 자신의 의견을 말했다.",
        "exampleEn": "He expressed his opinion with conviction.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "소신을 지키는 것은 쉽지 않다.",
        "exampleEn": "It is not easy to stick to one's conviction.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "낭만",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Nangman",
    "englishTitle": "Romance / Romanticism",
    "shortMeaningKo": "현실에 매이지 않고 감정적이고 이상적으로 사물을 대하는 심리 상태. 또는 그러한 분위기.",
    "shortMeaningEn": "A psychological state of treating things emotionally and ideally without being bound by reality. Or such an atmosphere.",
    "fullMeaningKo": "1. 현실에 매이지 않고 감정적이고 이상적으로 사물을 대하는 심리 상태. 또는 그러한 분위기. 2. 감미롭고 감상적인 분위기.",
    "fullMeaningEn": "1. A psychological state of treating things emotionally and ideally without being bound by reality. Or such an atmosphere. 2. A sweet and sentimental atmosphere.",
    "usageTip": "여유롭고 감성적인 분위기를 즐길 때 '낭만이 있다', '낭만적이다'라고 표현합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "분위기",
      "문화"
    ],
    "sortOrder": 11,
    "cultureNote": "단순한 romance보다 분위기와 감성을 함께 담는 표현",
    "examples": [
      {
        "exampleKo": "비 오는 날 창가에서 책을 읽는 것은 낭만이 있다.",
        "exampleEn": "Reading a book by the window on a rainy day is romantic.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "낭만적인 여행이었다",
        "exampleEn": "It was a romantic trip",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "충",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Chung",
    "englishTitle": "Loyalty / Patriotism",
    "shortMeaningKo": "임금이나 나라 등에 충성함.",
    "shortMeaningEn": "Loyalty to a king or country.",
    "fullMeaningKo": "1. 임금이나 나라 등에 충성함.",
    "fullMeaningEn": "1. Loyalty to a king or country.",
    "usageTip": "국가나 조직, 리더에 대한 굳은 믿음과 헌신을 뜻하며, '충성', '충신' 등의 단어에 기초가 됩니다.",
    "difficulty": "advanced",
    "tags": [
      "전통",
      "가치",
      "공동체"
    ],
    "sortOrder": 12,
    "cultureNote": "전통적 가치관과 역사적 맥락을 설명하는 문화어휘",
    "examples": [
      {
        "exampleKo": "그는 나라를 위해 충성을 다하는 군인이다.",
        "exampleEn": "He is a soldier loyal to his country.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "강아지는 주인에게 충을 다한다.",
        "exampleEn": "A puppy is loyal to its owner",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "권선징악",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Gwonseonjingak",
    "englishTitle": "Poetic Justice",
    "shortMeaningKo": "착한 일을 권장하고 못된 일을 벌하는 것.",
    "shortMeaningEn": "Encouraging good deeds and punishing bad deeds.",
    "fullMeaningKo": "1. 착한 일을 권장하고 못된 일을 벌하는 것.",
    "fullMeaningEn": "1. Encouraging good deeds and punishing bad deeds.",
    "usageTip": "드라마나 동화에서 악당이 벌을 받고 착한 주인공이 성공하는 결말을 '권선징악'이라고 부릅니다.",
    "difficulty": "advanced",
    "tags": [
      "도덕",
      "이야기",
      "문화"
    ],
    "sortOrder": 13,
    "cultureNote": "이야기와 콘텐츠에서 선악 구도를 설명하는 사자성어",
    "examples": [
      {
        "exampleKo": "많은 동화는 권선징악의 내용을 담고 있다.",
        "exampleEn": "Many fairy tales contain the theme of rewarding good and punishing evil.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그는 권선징악이 실현되길 바란다.",
        "exampleEn": "He hopes that good will be rewarded and evil will be punished.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "출세",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Chulse",
    "englishTitle": "Success in Life",
    "shortMeaningKo": "사회적으로 높은 지위에 오르거나 유명하게 됨.",
    "shortMeaningEn": "Rising to a high social position or becoming famous.",
    "fullMeaningKo": "1. 사회적으로 높은 지위에 오르거나 유명하게 됨.",
    "fullMeaningEn": "1. Rising to a high social position or becoming famous.",
    "usageTip": "가난하거나 평범했던 사람이 크게 성공했을 때 '출세했다'라고 표현합니다.",
    "difficulty": "intermediate",
    "tags": [
      "사회",
      "성공",
      "가치관"
    ],
    "sortOrder": 14,
    "cultureNote": "사회적 성공과 지위 상승을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "그는 출세를 위해 열심히 공부했다.",
        "exampleEn": "He studied hard for his success.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "출세했다고 해서 모두가 행복한 것은 아니다.",
        "exampleEn": "Getting ahead doesn't make everyone happy.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "궁합",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Gunghap",
    "englishTitle": "Compatibility / Chemistry",
    "shortMeaningKo": "남자와 여자가 서로 잘 맞는 짝인지를 알아보는 점. 또는 그렇게 본 점의 결과.",
    "shortMeaningEn": "Divination to see if a man and a woman are a good match for each other. Or the result of such divination.",
    "fullMeaningKo": "1. 남자와 여자가 서로 잘 맞는 짝인지를 알아보는 점. 또는 그렇게 본 점의 결과.",
    "fullMeaningEn": "1. Divination to see if a man and a woman are a good match for each other. Or the result of such divination.",
    "usageTip": "연인 사이뿐만 아니라 음식이나 동료 간의 조화가 좋을 때도 '궁합이 맞다'라고 비유적으로 사용합니다.",
    "difficulty": "intermediate",
    "tags": [
      "관계",
      "조화",
      "문화"
    ],
    "sortOrder": 15,
    "cultureNote": "사람 관계뿐 아니라 음식과 조합에도 쓰이는 확장성 있는 표현",
    "examples": [
      {
        "exampleKo": "두 사람의 궁합이 잘 맞는다고 한다.",
        "exampleEn": "It is said that the two of them go well together.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "빵과 우유는 최고의 궁합이다.",
        "exampleEn": "Bread and milk are the best combination.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "억울하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Eogulhada",
    "englishTitle": "Unfair / Falsely Accused",
    "shortMeaningKo": "잘못한 것도 없이 피해를 입어 속이 상하고 답답하다.",
    "shortMeaningEn": "Feeling upset and frustrated because one has suffered damage without having done anything wrong.",
    "fullMeaningKo": "1. 잘못한 것도 없이 피해를 입어 속이 상하고 답답하다.",
    "fullMeaningEn": "1. Feeling upset and frustrated because one has suffered damage without having done anything wrong.",
    "usageTip": "오해를 받거나 부당한 대우를 받아 마음이 답답할 때 '억울하다'고 호소합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "갈등",
      "공정성"
    ],
    "sortOrder": 16,
    "cultureNote": "부당하거나 공정하지 않다고 느낄 때 쓰이는 표현",
    "examples": [
      {
        "exampleKo": "하지 않은 일을 했다고 해서 억울했다.",
        "exampleEn": "It was unfair to do something that I didn't do.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그는 억울한 마음에 눈물을 흘렸다.",
        "exampleEn": "He shed tears of resentment.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "아쉽다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Aswipta",
    "englishTitle": "Regrettable / Lacking",
    "shortMeaningKo": "필요한 것이 없거나 모자라서 만족스럽지 못하다.",
    "shortMeaningEn": "Feeling unsatisfied because something necessary is missing or lacking.",
    "fullMeaningKo": "1. 필요한 것이 없거나 모자라서 만족스럽지 못하다. 2. 미련이 남아 안타깝고 서운하다.",
    "fullMeaningEn": "1. Feeling unsatisfied because something necessary is missing or lacking. 2. Feeling regrettable and sad due to lingering attachments.",
    "usageTip": "헤어질 때 발걸음이 떨어지지 않거나, 결과가 조금 부족해서 미련이 남을 때 자주 씁니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "기대",
      "상황"
    ],
    "sortOrder": 17,
    "cultureNote": "부족함이나 미련이 남는 상황을 표현하는 말",
    "examples": [
      {
        "exampleKo": "시험 결과가 좋아서 기쁘지만 조금 아쉽기도 하다.",
        "exampleEn": "I'm happy that the test results were good, but I'm also a little disappointed.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "시간이 없어서 함께 가지 못해 아쉽다.",
        "exampleEn": "It's a pity that I can't go with you because I don't.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "섭섭하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Seopseophada",
    "englishTitle": "Disappointed / Sad",
    "shortMeaningKo": "서운하고 아쉽다.",
    "shortMeaningEn": "Feeling disappointed and regretful.",
    "fullMeaningKo": "1. 서운하고 아쉽다. 2. 없어지는 것이 슬프고 아깝다. 3. 기대에 어긋나 서운하거나 불만스럽다.",
    "fullMeaningEn": "1. Feeling disappointed and regretful. 2. Feeling sad and pity for the loss of something. 3. Feeling disappointed or dissatisfied because it fell short of expectations.",
    "usageTip": "이별할 때 아쉬운 마음을 전하거나, 누군가의 행동이 기대에 미치지 못해 마음이 상할 때 사용합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "관계",
      "기대"
    ],
    "sortOrder": 18,
    "cultureNote": "기대와 관계 속 아쉬움을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "친한 친구가 비밀을 말해주지 않아서 섭섭했다.",
        "exampleEn": "I was disappointed that my close friend didn't tell me the secret.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "갑자기 떠난다고 하니 섭섭한 마음이 들었다.",
        "exampleEn": "I was sad to hear that I was leaving suddenly.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "민망하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Minmanghada",
    "englishTitle": "Embarrassed / Awkward",
    "shortMeaningKo": "딱하고 안타깝다.",
    "shortMeaningEn": "Feeling pitiful and regretful.",
    "fullMeaningKo": "1. 딱하고 안타깝다. 2. 사람을 대하거나 보기가 부끄럽다.",
    "fullMeaningEn": "1. Feeling pitiful and regretful. 2. Feeling embarrassed to face or look at someone.",
    "usageTip": "실수를 해서 주변 사람들의 시선이 부끄럽고 어색하게 느껴질 때 '민망해'라고 합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "체면",
      "사회상황"
    ],
    "sortOrder": 19,
    "cultureNote": "사회적 상황에서 어색하거나 부끄러운 감정을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "사람들 앞에서 넘어져서 민망했다.",
        "exampleEn": "I was embarrassed to fall in front of people.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "칭찬을 너무 많이 들어서 민망했다.",
        "exampleEn": "I was embarrassed to hear so many compliments.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "무안하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Muanhada",
    "englishTitle": "Ashamed / Embarrassed",
    "shortMeaningKo": "얼굴을 들지 못할 만큼 수줍거나 창피하다.",
    "shortMeaningEn": "Being so shy or embarrassed that one cannot lift their face.",
    "fullMeaningKo": "1. 얼굴을 들지 못할 만큼 수줍거나 창피하다.",
    "fullMeaningEn": "1. Being so shy or embarrassed that one cannot lift their face.",
    "usageTip": "자신의 호의가 거절당하거나 남들 앞에서 크게 창피를 당해 부끄러울 때 '무안하다'라고 씁니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "체면",
      "관계"
    ],
    "sortOrder": 20,
    "cultureNote": "체면이 손상되거나 부끄러운 상황에서 쓰이는 표현",
    "examples": [
      {
        "exampleKo": "인사를 했는데 못 들은 척해서 무안했다.",
        "exampleEn": "I said hello, but I pretended not to hear it, so I felt embarrassed.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "내 실수를 모두가 알아서 무안했다.",
        "exampleEn": "Everyone knew my mistake and felt ashamed.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "답답하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Dapdaphada",
    "englishTitle": "Frustrated / Stuffy",
    "shortMeaningKo": "숨이 막힐 듯하거나 숨쉬기가 어렵다.",
    "shortMeaningEn": "Feeling like one is choking or finding it hard to breathe.",
    "fullMeaningKo": "1. 숨이 막힐 듯하거나 숨쉬기가 어렵다. 2. 근심이나 걱정으로 마음이 초조하고 속이 시원하지 않다. 3. 마음이 넓지 못하거나 행동이나 모습이 시원스럽지 못하다. 4. 공간이 좁아 시원한 느낌이 없다. 5. 다른 사람의 태도나 상황이 마음에 차지 않아 안타깝다.",
    "fullMeaningEn": "1. Feeling like one is choking or finding it hard to breathe. 2. Feeling anxious and uneasy inside due to worries or concerns. 3. Not being broad-minded, or having actions or appearances that are not refreshing or decisive. 4. Lacking a refreshing feeling because the space is narrow and stuffy. 5. Feeling frustrated because another person's attitude or the situation is not satisfactory.",
    "usageTip": "공간이 좁아 숨이 막히는 느낌이나, 상황이 풀리지 않고 사람과의 소통이 막힐 때 두루 사용합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "상황",
      "소통"
    ],
    "sortOrder": 21,
    "cultureNote": "상황이 풀리지 않거나 마음이 막힌 느낌을 표현하는 말",
    "examples": [
      {
        "exampleKo": "문제가 해결되지 않아서 답답하다.",
        "exampleEn": "It's frustrating that the problem hasn't been solved.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "창문이 없어서 방이 답답하게 느껴진다.",
        "exampleEn": "The room feels stuffy because there is no window.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "야속하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Yasokhada",
    "englishTitle": "Cold-hearted / Resentful",
    "shortMeaningKo": "무정한 행동이나 그런 행동을 한 사람이 섭섭하게 여겨져 언짢다.",
    "shortMeaningEn": "Feeling displeased and disappointed by a cold-hearted action or the person who did it.",
    "fullMeaningKo": "1. 무정한 행동이나 그런 행동을 한 사람이 섭섭하게 여겨져 언짢다.",
    "fullMeaningEn": "1. Feeling displeased and disappointed by a cold-hearted action or the person who did it.",
    "usageTip": "상대방이 내 마음을 알아주지 않고 매정하게 굴어서 원망스러움과 섭섭함이 함께 들 때 씁니다.",
    "difficulty": "advanced",
    "tags": [
      "감정",
      "관계",
      "실망"
    ],
    "sortOrder": 22,
    "cultureNote": "상대가 매정하거나 기대에 어긋났다고 느낄 때 쓰는 표현",
    "examples": [
      {
        "exampleKo": "힘들 때 연락이 없는 친구가 야속했다.",
        "exampleEn": "A friend who didn't contact me when he was having a hard time was cruel.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "시간은 기다려 주지 않아서 야속하다.",
        "exampleEn": "It is pitiful that time has not been waited for.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "그립다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Geuripta",
    "englishTitle": "Missing / Longing for",
    "shortMeaningKo": "매우 보고 싶고 만나고 싶다.",
    "shortMeaningEn": "Missing someone very much and wanting to see them.",
    "fullMeaningKo": "1. 매우 보고 싶고 만나고 싶다. 2. 어떤 것이 매우 필요하거나 없어서 아쉽다.",
    "fullMeaningEn": "1. Missing someone very much and wanting to see them. 2. Feeling a strong longing or regret because something is desperately needed or missing.",
    "usageTip": "멀리 있는 가족, 지나간 시절, 예전에 즐겨 먹던 음식 등을 간절히 다시 접하고 싶을 때 사용합니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "기억",
      "관계"
    ],
    "sortOrder": 23,
    "cultureNote": "사람이나 장소를 보고 싶어하는 감정을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "어릴 때 살던 집이 그립다.",
        "exampleEn": "It is pitiful that time has not been waited for.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "멀리 있는 가족이 그립다.",
        "exampleEn": "I miss my family far away.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "애틋하다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Aeteuthada",
    "englishTitle": "Fond / Deeply Affectionate",
    "shortMeaningKo": "섭섭하고 안타까워 애가 타는 듯하다.",
    "shortMeaningEn": "Feeling as if one's heart is burning due to sadness and regret.",
    "fullMeaningKo": "1. 섭섭하고 안타까워 애가 타는 듯하다. 2. 아끼고 위하는 정이 깊다.",
    "fullMeaningEn": "1. Feeling as if one's heart is burning due to sadness and regret. 2. Having deep affection and care for someone.",
    "usageTip": "멀리 떨어져 있는 연인이나 오랜 친구를 향한, 가슴 뭉클하고 소중한 감정을 표현할 때 씁니다.",
    "difficulty": "advanced",
    "tags": [
      "감정",
      "관계",
      "기억"
    ],
    "sortOrder": 24,
    "cultureNote": "그리움과 소중함이 섞인 감정을 표현하는 말",
    "examples": [
      {
        "exampleKo": "할머니와 손자의 모습이 애틋해 보였다.",
        "exampleEn": "Grandmother and grandson looked affectionate.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "두 사람은 서로를 애틋하게 바라봤다.",
        "exampleEn": "The two looked at each other fondly.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "정겹다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "Jeonggyeopda",
    "englishTitle": "Warm and Friendly",
    "shortMeaningKo": "정이 넘칠 만큼 매우 다정하다.",
    "shortMeaningEn": "Being very affectionate, overflowing with warmth.",
    "fullMeaningKo": "1. 정이 넘칠 만큼 매우 다정하다.",
    "fullMeaningEn": "1. Being very affectionate, overflowing with warmth.",
    "usageTip": "시골 풍경, 오래된 식당, 할머니의 미소처럼 따뜻하고 친근한 느낌을 주는 것을 묘사할 때 씁니다.",
    "difficulty": "advanced",
    "tags": [
      "감정",
      "분위기",
      "관계"
    ],
    "sortOrder": 25,
    "cultureNote": "따뜻하고 친근한 느낌을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "시골 마을의 풍경이 정겹다.",
        "exampleEn": "The scenery of the country village is friendly.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "오랜 친구의 목소리가 정겹게 들렸다.",
        "exampleEn": "The old friend's voice sounded friendly.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "괜히",
    "type": "word",
    "partOfSpeech": "부사",
    "romanization": "Gwaenhi",
    "englishTitle": "Pointlessly / For nothing",
    "shortMeaningKo": "특별한 이유나 실속이 없게.",
    "shortMeaningEn": "Without any special reason or practical substance; pointlessly.",
    "fullMeaningKo": "1. 특별한 이유나 실속이 없게.",
    "fullMeaningEn": "1. Without any special reason or practical substance; pointlessly.",
    "usageTip": "'괜히 했다(I shouldn't have done that)'처럼 후회할 때나, 이유 없이 기분이 그럴 때 '괜히 기분이 좋다'라고 씁니다.",
    "difficulty": "intermediate",
    "tags": [
      "뉘앙스",
      "감정",
      "구어체"
    ],
    "sortOrder": 26,
    "cultureNote": "명확한 이유 없이 감정이나 행동이 생긴 상황을 표현하는 부사",
    "examples": [
      {
        "exampleKo": "괜히 걱정했네.",
        "exampleEn": "I was worried for no reason.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "괜히 화를 냈다가 후회했다.",
        "exampleEn": "I regret being angry for no reason.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "챙기다",
    "type": "word",
    "partOfSpeech": "동사",
    "romanization": "Chaenggida",
    "englishTitle": "To take care of / To pack",
    "shortMeaningKo": "필요한 물건을 찾아서 갖추어 놓거나 제대로 갖추었는지 살피다.",
    "shortMeaningEn": "To find and prepare necessary items or check if they are properly equipped.",
    "fullMeaningKo": "1. 필요한 물건을 찾아서 갖추어 놓거나 제대로 갖추었는지 살피다. 2. 빠뜨리거나 거르지 않다. 3. 자기의 것으로 만들다. 4. 사람을 잘 보살피거나 돌보다.",
    "fullMeaningEn": "1. To find and prepare necessary items or check if they are properly equipped. 2. Not to omit or skip something. 3. To make something one's own. 4. To take good care of or look after someone.",
    "usageTip": "여행 가방을 쌀 때('짐을 챙기다'), 혹은 주변 사람의 건강이나 안부를 돌볼 때('후배를 챙기다') 두루 쓰이는 실용적인 표현입니다.",
    "difficulty": "intermediate",
    "tags": [
      "배려",
      "관계",
      "일상"
    ],
    "sortOrder": 27,
    "cultureNote": "상대나 물건을 세심하게 돌보는 행동을 나타내는 표현",
    "examples": [
      {
        "exampleKo": "여행 가기 전에 여권을 꼭 챙기세요.",
        "exampleEn": "Make sure to bring your passport before you go on a trip.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그는 가족의 건강을 잘 챙긴다.",
        "exampleEn": "He takes good care of his family's health.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "신경 쓰다",
    "type": "expression",
    "partOfSpeech": "동사구",
    "romanization": "Singyeong sseuda",
    "englishTitle": "To care / To pay attention",
    "shortMeaningKo": "사소한 데까지 세심하게 살피다.",
    "shortMeaningEn": "To pay close attention even to trivial details; to care.",
    "fullMeaningKo": "1. 사소한 데까지 세심하게 살피다.",
    "fullMeaningEn": "1. To pay close attention even to trivial details; to care.",
    "usageTip": "타인을 배려할 때('신경 써 주셔서 감사합니다') 쓰이기도 하고, 무언가 마음에 걸려 스트레스를 받을 때('너무 신경 쓰지 마')도 사용됩니다.",
    "difficulty": "intermediate",
    "tags": [
      "관심",
      "배려",
      "부담"
    ],
    "sortOrder": 28,
    "cultureNote": "관심과 배려 또는 부담을 표현하는 실용적 구어 표현",
    "examples": [
      {
        "exampleKo": "다른 사람의 말을 너무 신경 쓰지 마세요.",
        "exampleEn": "Don't pay too much attention to what others say.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "그는 작은 실수도 신경 쓰는 편이다.",
        "exampleEn": "He tends to care about small mistakes.",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "흥겹다",
    "type": "word",
    "partOfSpeech": "형용사",
    "romanization": "heunggyeopda",
    "englishTitle": "Joyful / Excited",
    "shortMeaningKo": "흥이 나서 기분이 좋고 즐겁다.",
    "shortMeaningEn": "Feeling good and joyful out of excitement. happy; joyful; merrily",
    "fullMeaningKo": "1. 흥이 나서 기분이 좋고 즐겁다.",
    "fullMeaningEn": "1. Feeling good and joyful out of excitement. happy; joyful; merrily",
    "usageTip": "노래, 장단, 축제처럼 흥이 나는 분위기와 함께 쓰면 자연스럽습니다.",
    "difficulty": "intermediate",
    "tags": [
      "감정",
      "분위기",
      "문화"
    ],
    "sortOrder": 29,
    "cultureNote": "흥이 나고 즐거운 분위기를 나타내는 표현",
    "examples": [
      {
        "exampleKo": "노래가 너무 흥겨워서 가만히 있을 수 없다",
        "exampleEn": "The song is so exciting that I can't stay still",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "한국의 장단은 너무 흥겹다",
        "exampleEn": "The Korean rhythm is so exciting",
        "exampleType": "spoken"
      }
    ]
  },
{
    "korean": "눈치",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Nunchi",
    "englishTitle": "Social Sense / Tact",
    "shortMeaningKo": "상대가 말하지 않아도 그 사람의 마음이나 일의 상황을 이해하고 아는 능력.",
    "shortMeaningEn": "The ability to understand and know someone's mind or the situation even if they don't say it.",
    "fullMeaningKo": "1. 상대가 말하지 않아도 그 사람의 마음이나 일의 상황을 이해하고 아는 능력. 2. 속마음이나 상황을 짐작하게 하는 태도나 표정.",
    "fullMeaningEn": "1. The ability to understand and know someone's mind or the situation even if they don't say it. 2. An attitude or facial expression that allows one to guess inner feelings or a situation.",
    "usageTip": "'눈치가 빠르다(quick-witted)', '눈치가 없다(clueless)' 형태로 사람의 사회적 센스를 묘사할 때 씁니다.",
    "difficulty": "intermediate",
    "tags": [
      "관계",
      "상황판단",
      "사회생활"
    ],
    "sortOrder": 30,
    "cultureNote": "상대의 마음과 상황을 읽는 한국어 대화 문화와 연결된 표현",
    "examples": [
      {
        "exampleKo": "그는 눈치가 빨라서 분위기를 잘 파악한다.",
        "exampleEn": "He is quick-witted and has a good sense of the atmosphere.",
        "exampleType": "spoken"
      },
      {
        "exampleKo": "눈치 없이 계속 혼자 이야기했다.",
        "exampleEn": "I kept talking to myself without noticing.",
        "exampleType": "spoken"
      }
    ]
  }
];

export const seedWords = async (): Promise<void> => {
  await ensureMockUser();
  const seedWordKoreans = seedWordsData.map((item) => item.korean);

  await Word.update(
    { isActive: false },
    {
      where: {
        korean: {
          [Op.notIn]: seedWordKoreans,
        },
      },
    }
  );

  for (const item of seedWordsData) {
    const baseWord = {
      korean: item.korean,
      type: item.type,
      partOfSpeech: item.partOfSpeech,
      romanization: item.romanization,
      englishTitle: item.englishTitle,
      shortMeaningKo: item.shortMeaningKo,
      shortMeaningEn: item.shortMeaningEn,
      fullMeaningKo: item.fullMeaningKo,
      fullMeaningEn: item.fullMeaningEn,
      usageTip: item.usageTip,
      difficulty: item.difficulty,
      tags: item.tags,
      sortOrder: item.sortOrder,
      cultureNote: item.cultureNote,
      isActive: true,
    };

    const [word] = await Word.findOrCreate({
      where: { korean: item.korean },
      defaults: baseWord,
    });

    await word.update(baseWord);
    await WordExample.destroy({ where: { wordId: word.id } });
    await WordUsagePattern.destroy({ where: { wordId: word.id } });

    await WordExample.bulkCreate(
      item.examples.map((example) => ({
        wordId: word.id,
        exampleKo: example.exampleKo,
        exampleEn: example.exampleEn,
        exampleType: example.exampleType,
        source: "hwp-seed",
      }))
    );
  }
};

const runSeed = async (): Promise<void> => {
  try {
    initModels();
    await testDatabaseConnection();
    await sequelize.sync({ alter: true });
    await seedWords();
    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  void runSeed();
}
