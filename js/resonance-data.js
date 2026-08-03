/**

 * 共鳴解析 無料版データ辞典

 * ----------------------------------------

 * 12座それぞれについて、以下を管理します。

 *

 * - key        : 算定結果で使用する一文字

 * - name       : 座の正式名称

 * - image      : 宝石カード画像

 * - cycles     : 1巡目・2巡目・3巡目の表示データ

 *

 * analysis.html では、このファイルを analysis.js より先に読み込んでください。

 *

 * <script src="js/resonance-data.js"></script>

 * <script src="js/analysis.js"></script>

 */

 

window.RESONANCE_DATA = Object.freeze({

  "感": {

    key: "感",

    name: "直感",

    image: "img/card-kan.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "天響の座",

        romaji: "Tenkyo no Za",

        text: `あなたにとって「直感」とは、思いつきや気分だけではありません。

 

心の奥から湧き上がる、自分本来の声に気付くことです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "降光の座",

        romaji: "Koko no Za",

        text: `その感覚を大切にすることで、自分らしい選択が少しずつできるようになります。

 

それは、自分を信じることにも繋がっていきます。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "透解の座",

        romaji: "Tokai no Za",

        text: `自分の直感を信じ、従った時、その選択はあなたにとって思いがけないプラスに働く経験をするでしょう。`

      })

    })

  },

 

  "現": {

    key: "現",

    name: "表現",

    image: "img/card-gen.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "言霊の座",

        romaji: "Kotodama no Za",

        text: `あなたにとって「表現」とは、自分の気持ちを伝えることだけではありません。

 

心の中にある想いや考えを、自分らしい形で外へ現していくことです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "詠唱の座",

        romaji: "Eisho no Za",

        text: `そのやり取りを通し理解することで、さらに自分の内面と向き合うことが増えるかもしれません。

 

それは、新しい視点の発見にも繋がります。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "現心の座",

        romaji: "Genshin no Za",

        text: `あなたが感じたことを素直に表現出来た時、その言葉や行動は、誰かの心を震わせることもあるでしょう。`

      })

    })

  },

 

  "関": {

    key: "関",

    name: "関係",

    image: "img/card-seki.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "結縁の座",

        romaji: "Ketsuen no Za",

        text: `あなたにとって「関係」とは、ただ人とつながることだけではありません。

 

実際に一歩を踏み出し、人と関わることで、お互いを知り、新しい世界を広げていくことでもあります。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "絆広の座",

        romaji: "Banko no Za",

        text: `人との関わりは、一方通行ではありません。

 

あなたが投げたボールがどのように返ってくるのか、相手の表現も受け入れてみてください。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "共歩の座",

        romaji: "Kyoho no Za",

        text: `人との関わりを大切に育ててきたことは、あなたにとって大きな財産となります。`

      })

    })

  },

 

  "信": {

    key: "信",

    name: "信頼",

    image: "img/card-shin.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "天門の座",

        romaji: "Tenmon no Za",

        text: `あなたにとって「信頼」とは、相手を信じることだけではありません。

 

お互いを知り、理解しながら信頼を育てていくことでもあります。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "道標の座",

        romaji: "Michishirube no Za",

        text: `育まれた信頼は、あなた自身だけでなく、周りとの関係にも良い影響を与えていきます。

 

信頼があるからこそ、お互いを理解し、安心して支え合える関係が育まれていくでしょう。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "信閃の座",

        romaji: "Shinsen no Za",

        text: `信頼から生まれた関係は、お互いを支え合える強い繋がりになり得ます。

 

それは人生にとって財産ともいえるものであり、これからのあなたを支える大切な力となるでしょう。`

      })

    })

  },

 

  "理": {

    key: "理",

    name: "理解",

    image: "img/card-ri.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "心眼の座",

        romaji: "Shingan no Za",

        text: `あなたにとって「理解」とは、知識を増やすことだけではありません。

 

物事の本質を知り、自分なりの答えを見つけていくことです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "明鏡の座",

        romaji: "Meikyo no Za",

        text: `理解を深めることで、今まで見えなかった物事の繋がりが見えてきます。

 

それは、新しい考え方や柔軟な視点にも繋がっていきます。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "知泉の座",

        romaji: "Chisen no Za",

        text: `積み重ねてきた理解は、あなた自身の言葉や考え方となって現れていきます。

 

その理解は、迷った時の道しるべとなるでしょう。`

      })

    })

  },

 

  "動": {

    key: "動",

    name: "行動",

    image: "img/card-dou.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "飛翔の座",

        romaji: "Hisho no Za",

        text: `あなたにとって「行動」とは、ただ動くことではありません。

 

考えたことを実際の経験へ変え、新しい可能性を見つけていくことです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "現化の座",

        romaji: "Genka no Za",

        text: `実際に行動を起こすことで、今まで見えなかった景色が見られるでしょう。

 

その経験は新しい気付きや選択となり、自分を成長させてくれます。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "開頁の座",

        romaji: "Kaiyo no Za",

        text: `これまで積み重ねてきた経験は、新しい行動へと繋がっていきます。

 

それは人生を切り開く力と言っても良いでしょう。`

      })

    })

  },

 

  "境": {

    key: "境",

    name: "境界",

    image: "img/card-kyou.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "調律の座",

        romaji: "Choritsu no Za",

        text: `あなたにとって「境界」とは、人との間に壁をつくることではありません。

 

自分と相手、それぞれの役割や立場を尊重し、お互いの居場所を守りながら良い距離をつくることです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "清界の座",

        romaji: "Seikai no Za",

        text: `お互いを尊重するためには、適切な距離感も大切です。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "共別の座",

        romaji: "Kyobetsu no Za",

        text: `健全な境界は、人との関係を制限するものではありません。

 

その境界は、お互いを縛るものではなく、より自由な自分へとなるための土台となるでしょう。`

      })

    })

  },

 

  "放": {

    key: "放",

    name: "手放し",

    image: "img/card-hou.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "解放の座",

        romaji: "Kaiho no Za",

        text: `あなたにとって「手放し」とは、諦めることではありません。

 

今の自分に必要のないものを受け入れ、次へ進むための余白をつくることです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "還元の座",

        romaji: "Kangen no Za",

        text: `手放していくことで、新しい考え方や価値観が自然と入ってくるようになります。

 

それは、自分自身を軽やかにしてくれるでしょう。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "新巡の座",

        romaji: "Shinmeguri no Za",

        text: `手放した後は、新しく次のものを掴める状況になっています。

 

あなたが望むものはなんでしょうか。

 

自分に問うてみてください。`

      })

    })

  },

 

  "安": {

    key: "安",

    name: "安心",

    image: "img/card-an.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "安息の座",

        romaji: "Ansoku no Za",

        text: `あなたにとって「安心」とは、不安がない状態ではありません。

 

どんな時でも、自分が戻れる場所を持つことです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "還憧の座",

        romaji: "Kando no Za",

        text: `安心できる場所では、自分らしさを発揮することができるでしょう。

 

自分自身の肯定が、あなたにとってとても重要です。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "灯火の座",

        romaji: "Tomoshibi no Za",

        text: `あなたの中にある安心は、自分だけでなく周りにも影響を与え、居心地のよさとなって現れるかもしれません。`

      })

    })

  },

 

  "受": {

    key: "受",

    name: "受容",

    image: "img/card-ju.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "和心の座",

        romaji: "Washin no Za",

        text: `あなたにとって「受容」とは、すべてを我慢することではありません。

 

違いを認め、そのまま受け止めることです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "溶心の座",

        romaji: "Yoshin no Za",

        text: `相手を受け入れることで、自分とは違う考え方や価値観にも気付けるようになります。

 

それは、自分自身の視野を広げることにも繋がります。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "掌心の座",

        romaji: "Shoshin no Za",

        text: `お互いの違いを認め合えた時、そこには自然な調和が生まれていくでしょう。`

      })

    })

  },

 

  "時": {

    key: "時",

    name: "時",

    image: "img/card-toki.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "天巡の座",

        romaji: "Tenjun no Za",

        text: `あなたにとって「時」とは、時計の時間だけではありません。

 

物事が動く流れや、自分にとって最適なタイミングを知ることです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "時極の座",

        romaji: "Jikyoku no Za",

        text: `理解できるようになると、焦らず今できることへ意識を向けられるようになります。

 

それは、自分らしい歩幅で進むことにも繋がっていきます。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "暁鐘の座",

        romaji: "Gyosho no Za",

        text: `これまでの経験から得た知恵や知識は、引き出すことができます。

 

それは自分や誰かにとって「今、必要だったもの」として助けとなるでしょう。`

      })

    })

  },

 

  "情": {

    key: "情",

    name: "感情",

    image: "img/card-jou.png",

    cycles: Object.freeze({

      1: Object.freeze({

        cycle: 1,

        symbolName: "共鳴の座",

        romaji: "Kyomei no Za",

        text: `あなたにとって「感情」とは、振り回されるものではありません。

 

心が何を感じているのかを知る、大切なサインです。`

      }),

      2: Object.freeze({

        cycle: 2,

        symbolName: "心波の座",

        romaji: "Shinpa no Za",

        text: `自分の感情と向き合うことで、本当に大切にしたいものが少しずつ見えてきます。

 

それは、自分自身を理解することにも繋がっていきます。`

      }),

      3: Object.freeze({

        cycle: 3,

        symbolName: "漣見の座",

        romaji: "Renken no Za",

        text: `感情をそのままあなたが受け入れる時、あなたや周りの心が共鳴し、人生の彩りとして豊かさを与えてくれるでしょう。`

      })

    })

  }

});

 

 

/**

 * 正式名称から一文字キーへ変換するための対応表です。

 * 既存の analysis.js が「直感」「表現」などを返す場合に使用できます。

 */

window.RESONANCE_NAME_TO_KEY = Object.freeze({

  "直感": "感",

  "表現": "現",

  "関係": "関",

  "信頼": "信",

  "理解": "理",

  "行動": "動",

  "境界": "境",

  "手放し": "放",

  "安心": "安",

  "受容": "受",

  "時": "時",

  "感情": "情"

});

 

 

/**

 * 一文字キーまたは正式名称から、座データを取得します。

 *

 * @param {string} axis 一文字キー、または正式名称

 * @returns {object|null}

 */

window.getResonanceAxisData = function getResonanceAxisData(axis) {

  const key = window.RESONANCE_DATA[axis]

    ? axis

    : window.RESONANCE_NAME_TO_KEY[axis];

 

  return key ? window.RESONANCE_DATA[key] : null;

};

 

 

/**

 * 一文字キーまたは正式名称と巡数から、表示用データを取得します。

 *

 * @param {string} axis 一文字キー、または正式名称

 * @param {number|string} cycle 1、2、3のいずれか

 * @returns {{

 *   key: string,

 *   name: string,

 *   image: string,

 *   cycle: number,

 *   symbolName: string,

 *   romaji: string,

 *   text: string

 * }|null}

 */

window.getResonanceCycleData = function getResonanceCycleData(axis, cycle) {

  const axisData = window.getResonanceAxisData(axis);

  const cycleNumber = Number(cycle);

 

  if (!axisData || !axisData.cycles[cycleNumber]) {

    return null;

  }

 

  const cycleData = axisData.cycles[cycleNumber];

 

  return {

    key: axisData.key,

    name: axisData.name,

    image: axisData.image,

    cycle: cycleData.cycle,

    symbolName: cycleData.symbolName,

    romaji: cycleData.romaji,

    text: cycleData.text

  };

};
