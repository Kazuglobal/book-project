'use client'

import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import Image from 'next/image'
import { Languages, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { ErrorBoundary } from 'react-error-boundary'
import { SpeechButton } from '@/components/ui/speech-button'

/* =======================
   Type Definitions
======================= */
interface PageContent {
  title?: {
    en: string
    ja: string
    es: string
  }
  text: {
    en: string
    ja: string
    es: string
  }
  image: string
}

interface Page {
  type: 'cover' | 'page'
  content: PageContent
}

interface Storybook {
  id: string
  title: string
  description: string
  japaneseDescription: string
  coverImage: string
  pages: Page[]
}

/* =======================
   Storybooks Data
======================= */
const storybooks: Storybook[] = [
  {
    id: "protect-from-thieves",
    title: "Protect from Thieves",
    description: "An interactive children's storybook about staying safe.",
    japaneseDescription: "子供の安全を守るためのインタラクティブな絵本。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/１-DSVP0xHyBmZw7ddVbVQQOAv7U0XWD5.png",
    pages: [
      {
        type: 'cover',
        content: {
          title: {
            en: "Protect from Thieves",
            ja: "どろぼうからまもれ",
            es: "Proteger de los Ladrones"
          },
          text: {
            en: "",
            ja: "",
            es: ""
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/１-DSVP0xHyBmZw7ddVbVQQOAv7U0XWD5.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Once upon a time, in a beautiful kingdom, there lived two young princesses named Kanoha and Kirara. They were the best of friends and loved to go on adventures together.",
            ja: "むかしむかし、きれいな<ruby>国<rt>くに</rt></ruby>に、\nかのはとキララという<ruby>姫<rt>ひめ</rt></ruby>さまがいました。\nふたりはなかよしで、\nいっしょに<ruby>冒険<rt>ぼうけん</rt></ruby>するのがだいすきでした。",
            es: "Érase una vez, en un hermoso reino, vivían dos jóvenes princesas llamadas Kanoha y Kirara. Eran las mejores amigas y amaban ir juntas a aventuras."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FyXGYj4ksEO7oNCVE5cct2x7FsR10Z.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Carrier is driving around looking for a place to have lunch. ",
            ja: "キャリアは<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>探<rt>さが</rt></ruby>している。",
            es: "Carrier está manejando buscando un lugar para almorzar. "
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/１-g5fVsecgzB5wmmpRuDGvu8wCw6is6G.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "When she was about to enter the restaurant, a bad person appeared and tried to steal money from other people.",
            ja: "<ruby>店<rt>みせ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ろうとしたらぶっこうが<ruby>出<rt>で</rt></ruby>てきて<ruby>他<rt>ほか</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>の<ruby>お金<rt>かね</rt></ruby>を<ruby>盗<rt>ぬす</rt></ruby>もうとした。",
            es: "Cuando ella estaba a punto de entrar al restaurante, apareció una mala persona que intentaba robar dinero a otras personas."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ビーフ%20(2)-8OOjK5dIGj3TVjR0Xvf0HgKTegn34W.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "When Carrier tried to stop him, the bad person turned towards her.",
            ja: "キャリアが<ruby>止<rt>と</rt></ruby>めようとしたら、ぶっこうが<ruby>向<rt>む</rt></ruby>かってきた。",
            es: "Cuando Carrier intentó detenerlo, la mala persona se volvió hacia ella."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/４-29RVxyzo50LcNpYHgLatjORbnoaHDl.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "After defeating the bad person, Carrier is enjoying her lunch of hamburger steak and rice. ",
            ja: "キャリアがぶっこうに<ruby>勝<rt>か</rt></ruby>って、<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>にハンバーグとライスを<ruby>食<rt>た</rt></ruby>べている。",
            es: "Después de vencer a la mala persona, Carrier está disfrutando su almuerzo de hamburguesa con arroz."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/５.jpg-fA6IpSRvmx9ahDgwLKE5zxF3pTOVga.png"
        }
      }
    ]
  },
  {
    id: "adventures-of-kumataro-and-usa",
    title: "The Adventures of Kumataro and Usa",
    description: "An exciting tale of a bear and a rabbit wizard's journey through a dangerous dungeon.",
    japaneseDescription: "クマとウサギの魔法使いが危険なダンジョンを冒険する exciting な物語。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/６-9XEkuM6Ki481j47vxiKpudWXg4joFq.png",
    pages: [
      {
        type: 'cover',
        content: {
          title: {
            en: "The Adventures of Kumataro and Usa",
            ja: "クマたろうとうさのぼうけん",
            es: "Las Aventuras de Kumataro y Usa"
          },
          text: {
            en: "",
            ja: "",
            es: ""
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/６-9XEkuM6Ki481j47vxiKpudWXg4joFq.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "In a mysterious mansion, there lived a brave bear named Kumataro who loved boxing, and a clever rabbit wizard named Usa. Together they faced many adventures, including confronting a mighty dragon.",
            ja: "ふしぎなやしきに、<ruby>拳闘<rt>けんとう</rt></ruby>が<ruby>大好<rt>だいす</rt></ruby>きな<ruby>勇気<rt>ゆうき</rt></ruby>のある<ruby>熊<rt>くま</rt></ruby>のクマたろうと、<ruby>賢<rt>かしこ</rt></ruby>いウサギの<ruby>魔法使<rt>まほうつか</rt></ruby>いのうさが<ruby>住<rt>す</rt></ruby>んでいました。ふたりはいっしょにたくさんの<ruby>冒険<rt>ぼうけん</rt></ruby>をして、<ruby>強<rt>つよ</rt></ruby>いドラゴンとも<ruby>戦<rt>たたか</rt></ruby>いました。",
            es: "En una mansión misteriosa, vivían un valiente oso llamado Kumataro que amaba el boxeo, y un conejo mago astuto llamado Usa. Juntos enfrentaron muchas aventuras, incluyendo el confrontar a un poderoso dragón."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/６-9XEkuM6Ki481j47vxiKpudWXg4joFq.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "When Kumataro turned 18 years old, he went to the Adventurer's Guild to become a fighter. With his red boxing gloves ready, he was excited to start his new journey.",
            ja: "クマたろうは18<ruby>歳<rt>さい</rt></ruby>になり、<ruby>冒険者<rt>ぼうけんしゃ</rt></ruby>ギルドに<ruby>行<rt>い</rt></ruby>き、<ruby>格闘家<rt>かくとうか</rt></ruby>になりました。",
            es: "Cuando Kumataro cumplió 18 años, fue al Gremio de Aventureros para convertirse en luchador. Con sus guantes de boxeo rojos listos, estaba emocionado por comenzar su nueva aventura."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/１-f6usbi8n01yGtbs1D16v6Fpp2y0dYM.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "While walking around the Adventurer's Guild, Kumataro met Usa who was looking for a teammate. They decided to work together and became friends.",
            ja: "<ruby>冒険者<rt>ぼうけんしゃ</rt></ruby>ギルドをうろうろしていると、<ruby>仲間<rt>なかま</rt></ruby>を<ruby>募集<rt>ぼしゅう</rt></ruby>していたうさと<ruby>仲間<rt>なかま</rt></ruby>になった。",
            es: "Mientras caminaba por el Gremio de Aventureros, Kumataro conoció a Usa, quien estaba buscando un compañero. Decidieron trabajar juntos y se hicieron amigos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/２-Ah1OlFyF4x4TUbY12qP9oVBvRphxEE.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Kumataro and Usa easily defeated the local bosses. They realized they were much stronger than they thought, so they decided to explore the dangerous dungeon.",
            ja: "クマたろうとうさは、そこらの<ruby>boss<rt>ボス</rt></ruby>を<ruby>倒<rt>たお</rt></ruby>すが<ruby>boss<rt>ボス</rt></ruby>が<ruby>弱<rt>よわ</rt></ruby>くて、<ruby>自分<rt>じぶん</rt></ruby>たちが<ruby>強<rt>つよ</rt></ruby>い<ruby>事<rt>こと</rt></ruby>が<ruby>分<rt>わ</rt></ruby>かりダンジョンに<ruby>行<rt>い</rt></ruby>くことにした。",
            es: "Kumataro y Usa derrotaron fácilmente a los jefes locales. Se dieron cuenta de que eran mucho más fuertes de lo que pensaban, así que decidieron explorar la mazmorra peligrosa."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/３-v6JjojykwctQsGjbyhJfC0OoXWsDaj.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Finally, they entered the dungeon. After fighting many monsters, they reached the bottom floor.",
            ja: "ついにダンジョンに<ruby>入<rt>はい</rt></ruby>った。そして、<ruby>一番下<rt>いちばんした</rt></ruby>の<ruby>階<rt>かい</rt></ruby>に<ruby>着<rt>つ</rt></ruby>いた。",
            es: "Finalmente, entraron en la mazmorra. Después de luchar contra muchos monstruos, llegaron al piso más bajo."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/４.jpg-mvJg4vtYzD9P29IJM8Sw5PxEw8HMPu.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "The boss on floor 150 was really strong. Until now, they hadn't gotten hurt at all, but this floor was proving to be much tougher!",
            ja: "150<ruby>階<rt>かい</rt></ruby>のボスは<ruby>強<rt>つよ</rt></ruby>かった。それまでは<ruby>無傷<rt>むきず</rt></ruby>だったが、150<ruby>階<rt>かい</rt></ruby>ともなると<ruby>手強<rt>てごわ</rt></ruby>くなってきたぞ。",
            es: "El jefe del piso 150 era muy fuerte. Hasta ahora, no habían sufrido ningún daño, ¡pero este piso estaba resultando mucho más difícil!"
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ｐ５-pfR28f6kJetjoJ9rz38lwo1YM1gLh7.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Finally, Kumataro and Usa reached floor 200. There, a huge dragon stood before them as the dungeon's final boss!",
            ja: "とうとう200<ruby>階<rt>かい</rt></ruby>に<ruby>来<rt>き</rt></ruby>たクマたろうたち。そこには、<ruby>大<rt>おお</rt></ruby>きなドラゴンがダンジョンのボスとして<ruby>立<rt>た</rt></ruby>ち<ruby>向<rt>む</rt></ruby>かう！",
            es: "¡Finalmente, Kumataro y Usa llegaron al piso 200. Allí, un enorme dragón los esperaba como el jefe final de la mazmorra!"
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/６-Cxgb58WyaEmiP1jWldoxyjxgocXxpK.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "The lightning was scary, but they found the dragon's weak spot - its wings! With Usa's healing magic helping them, they were ready to defeat it together!",
            ja: "カミナリで<ruby>怖<rt>こわ</rt></ruby>いけど<ruby>弱点<rt>じゃくてん</rt></ruby>が<ruby>分<rt>わ</rt></ruby>かった！<ruby>羽<rt>はね</rt></ruby>だ！うさに<ruby>回復<rt>かいふく</rt></ruby>してもらって<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>倒<rt>たお</rt></ruby>すぞ！",
            es: "¡Los relámpagos daban miedo, pero encontraron el punto débil del dragón - sus alas! ¡Con la magia curativa de Usa ayudándoles, estaban listos para derrotarlo juntos!"
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/７-YFCbqFOEkqyXIIIAmN3ht1zxKusBcb.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "After defeating the dragon, Kumataro and Usa returned to town as heroes. They became very rich and continued their adventures together.",
            ja: "やっとドラゴンを<ruby>倒<rt>たお</rt></ruby>したクマたちは、<ruby>町<rt>まち</rt></ruby>にもどって<ruby>大金持<rt>おおかねも</rt></ruby>ちになって<ruby>冒険<rt>ぼうけん</rt></ruby>をつづけている。",
            es: "Después de derrotar al dragón, Kumataro y Usa regresaron al pueblo como héroes. Se volvieron muy ricos y continuaron sus aventuras juntos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/８-MnC05KhqgE1mEGN8ITstQKiyD6Cjz6.png"
        }
      }
    ]
  },
  {
    id: "christmas-incident",
    title: "The Christmas Incident",
    description: "A heartwarming Christmas tale about the magic of giving and friendship.",
    japaneseDescription: "クリスマスの贈り物と友情の魔法についての心温まる物語。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/デザイン%20(4)-8x9nRANx0lakNdtVcFetUkS4GXCZoU.png",
    pages: [
      {
        type: 'cover',
        content: {
          title: {
            en: "The Christmas Incident",
            ja: "クリスマス大事件",
            es: "El Incidente Navideño"
          },
          text: {
            en: "",
            ja: "",
            es: ""
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/デザイン%20(4)-8x9nRANx0lakNdtVcFetUkS4GXCZoU.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Once upon a time, in a beautiful kingdom, there lived two young princesses named Kanoha and Kirara. They were the best of friends and loved to go on adventures together.",
            ja: "むかしむかし、きれいな<ruby>国<rt>くに</rt></ruby>に、\nかのはとキララという<ruby>姫<rt>ひめ</rt></ruby>さまがいました。\nふたりはなかよしで、\nいっしょに<ruby>冒険<rt>ぼうけん</rt></ruby>するのがだいすきでした。",
            es: "Érase una vez, en un hermoso reino, vivían dos jóvenes princesas llamadas Kanoha y Kirara. Eran las mejores amigas y amaban ir juntas a aventuras."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FyXGYj4ksEO7oNCVE5cct2x7FsR10Z.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "There was a five-year-old girl who was excited about her present. She was thinking about using the present as a hair accessory...",
            ja: "<ruby>プレゼント<rt></rt></ruby>をたのしみにしている5<ruby>歳<rt>さい</rt></ruby>の<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>がいました。<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>は、<ruby>プレゼント<rt></rt></ruby>を<ruby>髪<rt>かみ</rt></ruby>かざりにしようかなとかんがえていました。",
            es: "Había una niña de cinco años que estaba emocionada por su regalo. Estaba pensando en usar el regalo como accesorio para el cabello..."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/クリスマス大事件！-ZLFqk7Jyfc4zXA27mxgN34jJyg7Auw.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "In the factory, little Santa helpers and their animal friends - a Cat, Rabbit, Panda, and Parakeet - were busy making presents.",
            ja: "<ruby>工場<rt>こうじょう</rt></ruby>では、<ruby>小<rt>ちい</rt></ruby>さなサンタさんたちと、<ruby>動物<rt>どうぶつ</rt></ruby>のおともだち - ネコ、ウサギ、パンダ、インコが<ruby>プレゼント<rt></rt></ruby>を<ruby>作<rt>つく</rt></ruby>っていました。",
            es: "En la fábrica, los pequeños ayudantes de Santa y sus amigos animales - un gato, un conejo, un panda y un periquito - estaban ocupados haciendo regalos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/名称未設定のデザイン%20(4)-6G9wbNNjxMHYwqN1hiuGQPYblmxgew.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "The reindeer, lion, little Santa helper, and rabbit were riding the sleigh across the field. However, suddenly the reindeer got injured. While everyone was wondering what to do, a dolphin appeared and asked, 'What's wrong?'",
            ja: "トナカイ、ライオン、<ruby>小<rt>ちい</rt></ruby>さなサンタさん、ウサギが<ruby>野原<rt>のはら</rt></ruby>をそりで<ruby>走<rt>はし</rt></ruby>っていました。でも、トナカイが<ruby>怪我<rt>けが</rt></ruby>をしてしまいました。みんながこまっていると、イルカがやってきて「どうしたの？」とききました。",
            es: "Los renos, el león, el pequeño ayudante de Santa y el conejo estaban montando el trineo a través del campo. Sin embargo, de repente, el reno resultó herido. Mientras todos se preguntaban qué hacer, apareció un delfín y preguntó: '¿Qué pasa?'"
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/デザイン%20(4)-QlWhb50wS5ODN9HXhQZgBCNcFd6JpY.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "'I'll carry you all to your destination!' said the dolphin, and began swimming across the sea with the three friends on its back.",
            ja: "「<ruby>家<rt>いえ</rt></ruby>まで<ruby>運<rt>はこ</rt></ruby>んであげるよ！」とイルカがいいました。そして、3<ruby>人<rt>にん</rt></ruby>を<ruby>背中<rt>せなか</rt></ruby>にのせて<ruby>海<rt>うみ</rt></ruby>を<ruby>泳<rt>およ</rt></ruby>ぎはじめました。",
            es: "'¡Los llevaré a todos a su destino!', dijo el delfín, y comenzó a nadar a través del mar con los tres amigos sobre su espalda."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/名称未設定のデザイン%20(5)-Gey0mqFy5vdycJwSnwToY3L3sLJHus.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "When the girl looked at her bedside, she found a present. She was overjoyed and put on the hair accessory.",
            ja: "<ruby>枕<rt>まくら</rt></ruby>もとを<ruby>見<rt>み</rt></ruby>たとき、<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>は<ruby>プレゼント<rt></rt></ruby>を<ruby>見<rt>み</rt></ruby>つけました。とてもうれしくなって、<ruby>髪<rt>かみ</rt></ruby>かざりをつけました。",
            es: "Cuando la niña miró a su lado de la cama, encontró un regalo. Estaba muy contenta y se puso el accesorio para el cabello."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12-n8S0WGrCkVK1FsMr55NFTEOCWtzMQM.png"
        }
      }
    ]
  },
  {
    id: "fantasy-forest",
    title: "Fantasy Forest",
    description: "A magical journey through an enchanted forest with a mysterious girl.",
    japaneseDescription: "不思議な少女と魔法の森を巡る冒険。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2023.57.02%20-%20A%20whimsical%20and%20dreamy%20pastel-style%20illustration%20of%20a%20pink-haired%20girl%20standing%20in%20a%20garden.%20She%20is%20wearing%20a%20green%20dress%20and%20a%20glowing%20pendant%20around-fp74mhe73kaX1DG8bjEIxjfyiavCM1.webp",
    pages: [
      {
        type: 'cover',
        content: {
          title: {
            en: "Fantasy Forest",
            ja: "ファンタジーの森",
            es: "El Bosque Fantástico"
          },
          text: {
            en: "",
            ja: "",
            es: ""
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2023.57.02%20-%20A%20whimsical%20and%20dreamy%20pastel-style%20illustration%20of%20a%20pink-haired%20girl%20standing%20in%20a%20garden.%20She%20is%20wearing%20a%20green%20dress%20and%20a%20glowing%20pendant%20around-fp74mhe73kaX1DG8bjEIxjfyiavCM1.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Once upon a time, there was a girl named Rina. She was a special girl with mysterious powers.",
            ja: "ある<ruby>日<rt>ひ</rt></ruby>、<ruby>莉奈<rt>りな</rt></ruby>という<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>がいました。その<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>は、<ruby>不思議<rt>ふしぎ</rt></ruby>な<ruby>力<rt>ちから</rt></ruby>をもっていました。",
            es: "Había una vez una niña llamada Rina. Era una niña especial con poderes misteriosos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ビーフ%20(1)-r0Y4rTc98kRWJ1sql8ReBPDYnlZAO4.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "One day, there was a girl named Rina. This girl had mysterious powers.",
            ja: "ある<ruby>日<rt>ひ</rt></ruby>、りなという<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>がいました。その<ruby>女<rt>おんな</rt></ruby>の<ruby>子<rt>こ</rt></ruby>は、<ruby>不思議<rt>ふしぎ</rt></ruby>な<ruby>力<rt>ちから</rt></ruby>をもっていました。",
            es: "Un día, había una niña llamada Rina. Esta niña tenía poderes misteriosos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ビーフ%20(1)-r0Y4rTc98kRWJ1sql8ReBPDYnlZAO4.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "At dinner time, Rina's father Miri called out, \"Dinner's ready!\" But when Rina was about to eat, her pendant started to glow, and suddenly she vanished.",
            ja: "<ruby>夕<rt>ゆう</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>になって、お<ruby>父<rt>とう</rt></ruby>さんのみりが「ご<ruby>飯<rt>はん</rt></ruby>だよ」と<ruby>言<rt>い</rt></ruby>いました。そして、りながご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べようとした<ruby>時<rt>とき</rt></ruby>ペンダントが<ruby>光<rt>ひか</rt></ruby>って、りなは<ruby>消<rt>き</rt></ruby>えてしまいました。",
            es: "A la hora de cenar, el padre de Rina, Miri, gritó, \"¡La cena está lista!\" Pero cuando Rina iba a comer, su colgante empezó a brillar, y de repente desapareció."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2023.57.02%20-%20A%20whimsical%20and%20dreamy%20pastel-style%20illustration%20of%20a%20pink-haired%20girl%20standing%20in%20a%20garden.%20She%20is%20wearing%20a%20green%20dress%20and%20a%20glowing%20pendant%20around-KKNMP7ZMaXP66F0W2YaPATMzP9k2cu.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "At that moment, Rina found herself in bed. When she woke up, she saw her dog Ria beside her.",
            ja: "その<ruby>頃<rt>ころ</rt></ruby>、りなは<ruby>ベッド<rt>べっど</rt></ruby>にいました。<ruby>起<rt>お</rt></ruby>きてみると、<ruby>犬<rt>いぬ</rt></ruby>のりあがいました。",
            es: "En ese momento, Rina se encontró en su cama. Cuando se despertó, vio a su perro Ria a su lado."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-30%2000.24.27%20-%20A%20whimsical%20and%20dreamy%20pastel-style%20illustration%20of%20a%20pink-haired%20girl%20lying%20on%20a%20bed%20with%20a%20dog%20licking%20her%20face.%20The%20girl%20is%20smiling%20with%20joy,%20her%20p-FCPtvyRedU7CYOXTTPVym6BhND7RGb.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "\"What are you doing here?\" asked Ria. \"I don't know, but I'm here,\" Rina replied. \"Let's quickly run away from here!\" Rina said.",
            ja:"「ここで<ruby>何<rt>なに</rt></ruby>をしているの？」と<ruby>言<rt>い</rt></ruby>いました。そして、りなが<ruby>言<rt>い</rt></ruby>いました。「わからないけどここにいる」とりなが<ruby>言<rt>い</rt></ruby>いました。「ここから<ruby>早<rt>はや</rt></ruby>く<ruby>逃<rt>に</rt></ruby>げよう！」とりなが<ruby>言<rt>い</rt></ruby>いました。",
            es: "\"¿Qué haces aquí?\" preguntó Ria. \"No lo sé, pero estoy aquí,\" respondió Rina. \"¡Vámonos rápido de aquí!\" dijo Rina."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-30%2000.43.30%20-%20A%20whimsical%20and%20dreamy%20pastel-style%20illustration%20of%20a%20pink-haired%20girl%20lying%20on%20a%20bed%20with%20a%20dog%20licking%20her%20face.%20The%20girl%20is%20crying%20softly,%20her%20pink-XJzTFlmvbwwXwT1VQGuHYktiKyBQe4.webp"
        }
      }
    ]
  },
  {
    id: "nobunaga-who-conquered-the-land",
    title: "Nobunaga Who Conquered the Land!?",
    description: "A time-slip adventure featuring Nobunaga Oda and a modern girl.",
    japaneseDescription: "織田信長と現代の少女のタイムスリップ冒険。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-28%2023.55.34%20-%20A%20colorful%20and%20detailed%20illustration%20depicting%20a%20time%20slip%20to%20the%20Sengoku%20period.%20A%2012-year-old%20girl%20with%20a%20ponytail%20is%20shown%20from%20the%20back,%20wearing%20a-mJag0gYTGZGcBTRmbMzs7F5ADgGTcG.webp",
    pages: [
      {
        type: 'cover',
        content: {
          title: {
            en: "Nobunaga Who Conquered the Land!?",
            ja: "天下をとった信長！？",
            es: "¡¿Nobunaga Quien Conquistó la Tierra!?"
          },
          text: {
            en: "",
            ja: "",
            es: ""
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-28%2023.55.34%20-%20A%20colorful%20and%20detailed%20illustration%20depicting%20a%20time%20slip%20to%20the%20Sengoku%20period.%20A%2012-year-old%20girl%20with%20a%20ponytail%20is%20shown%20from%20the%20back,%20wearing%20a-mJag0gYTGZGcBTRmbMzs7F5ADgGTcG.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Once upon a time, in a beautiful kingdom, there lived two young princesses named Kanoha and Kirara. They were the best of friends and loved to go on adventures together.",
            ja: "むかしむかし、きれいな<ruby>国<rt>くに</rt></ruby>に、\nかのはとキララという<ruby>姫<rt>ひめ</rt></ruby>さまがいました。\nふたりはなかよしで、\nいっしょに<ruby>冒険<rt>ぼうけん</rt></ruby>するのがだいすきでした。",
            es: "Érase una vez, en un hermoso reino, vivían dos jóvenes princesas llamadas Kanoha y Kirara. Eran las mejores amigas y amaban ir juntas a aventuras."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FyXGYj4ksEO7oNCVE5cct2x7FsR10Z.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "One day, Yuna, who loves Nobunaga, was traveling in Kyoto. She bought some star-shaped candy with Oda's picture on it and sat on a bench at the Honnoji Temple ruins to eat it.",
            ja: "ある<ruby>日<rt>ひ</rt></ruby>、<ruby>京都<rt>きょうと</rt></ruby>を<ruby>旅<rt>たび</rt></ruby>していた<ruby>信長<rt>のぶなが</rt></ruby><ruby>好<rt>ず</rt></ruby>きのゆうなが、<ruby>織田<rt>おだ</rt></ruby>もっこうのイラスト<ruby>付<rt>つ</rt></ruby>きの<ruby>金平糖<rt>こんぺいとう</rt></ruby>を<ruby>買<rt>か</rt></ruby>い、<ruby>本能寺<rt>ほんのうじ</rt></ruby><ruby>跡<rt>あと</rt></ruby>のベンチで<ruby>金平糖<rt>こんぺいとう</rt></ruby>を<ruby>食<rt>た</rt></ruby>べていた。",
            es: "Un día, Yuna, que adora a Nobunaga, estaba viajando en Kioto. Compró unos dulces con forma de estrella que tenían la imagen de Oda y se sentó en una banca en las ruinas del Templo Honnoji para comerlos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/なかまぼしゅう-scThT8bxvwnQLuBo8eY2lnWL7wQeiu.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Suddenly, she found herself in the Azuchi-Momoyama period at Honnoji Temple. While she was looking around in confusion, Nobunaga spotted her.",
            ja: "<ruby>気<rt>き</rt></ruby>が<ruby>付<rt>つ</rt></ruby>いたら、そこは<ruby>安土桃山時代<rt>あづちももやまじだい</rt></ruby>の<ruby>本能寺<rt>ほんのうじ</rt></ruby>。キョロキョロしていると<ruby>信長<rt>のぶなが</rt></ruby>に<ruby>見<rt>み</rt></ruby>つかった。",
            es: "De repente, se encontró en el período Azuchi-Momoyama en el Templo Honnoji. Mientras miraba a su alrededor confundida, Nobunaga la descubrió."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-28%2023.55.34%20-%20A%20colorful%20and%20detailed%20illustration%20depicting%20a%20time%20slip%20to%20the%20Sengoku%20period.%20A%2012-year-old%20girl%20with%20a%20ponytail%20is%20shown%20from%20the%20back,%20wearing%20a-mJag0gYTGZGcBTRmbMzs7F5ADgGTcG.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Using items from her backpack, Yuna and Nobunaga became friends and talked about the upcoming battle they would face together.",
            ja: "<ruby>鞄<rt>かばん</rt></ruby>に<ruby>入<rt>はい</rt></ruby>っていたもので、<ruby>信長<rt>のぶなが</rt></ruby>とゆうなは<ruby>仲<rt>なか</rt></ruby>を<ruby>深<rt>ふか</rt></ruby>め、これから<ruby>起<rt>お</rt></ruby>こる<ruby>反撃<rt>はんげき</rt></ruby>のことを<ruby>説明<rt>せつめい</rt></ruby>していた。",
            es: "Usando las cosas de su mochila, Yuna y Nobunaga se hicieron amigos y hablaron sobre la batalla que enfrentarían juntos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/なかまぼしゅう%20(2)-6R7iucjfntT9MQFKYtc0YimFLiAWoa.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Suddenly, the counterattack began and the war started. Many samurai warriors gathered around the temple, ready for battle.",
            ja: "いきなり<ruby>反撃<rt>はんげき</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まり、<ruby>戦争<rt>せんそう</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まった。",
            es: "De repente, comenzó el contraataque y empezó la guerra. Muchos guerreros samurái se reunieron alrededor del templo, listos para la batalla."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2001.31.28%20-%20A%20colorful%20and%20detailed%20illustration%20of%20many%20Sengoku%20samurai%20surrounding%20Honnoji%20Temple.%20The%20samurai%20are%20dressed%20in%20traditional%20Sengoku%20period%20armor,%20-kgdSPe4TJUlwYYpxNvXI9bdqVGqDV9.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Yuna escaped from Honnoji Temple with Nobunaga. Suddenly, her body began to glow, and when she opened her eyes, she found herself back on the bench at the temple ruins.",
            ja: "ゆうなは<ruby>信長<rt>のぶなが</rt></ruby>と<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>本能寺<rt>ほんのうじ</rt></ruby>を<ruby>脱出<rt>だっしゅつ</rt></ruby>すると、ゆうなの<ruby>体<rt>からだ</rt></ruby>が<ruby>光<rt>ひか</rt></ruby>り<ruby>気<rt>き</rt></ruby>が<ruby>付<rt>つ</rt></ruby>くと<ruby>本能寺跡<rt>ほんのうじあと</rt></ruby>のベンチに<ruby>戻<rt>もど</rt></ruby>っていた。",
            es: "Yuna escapó del Templo Honnoji con Nobunaga. De repente, su cuerpo comenzó a brillar, y cuando abrió los ojos, se encontró de nuevo en la banca de las ruinas del templo."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2001.02.03%20-%20A%20pastel-style%20illustration%20depicting%20a%20tense%20and%20dangerous%20scene.%20A%2012-year-old%20girl%20with%20a%20ponytail,%20wearing%20a%20green%20hoodie%20and%20blue%20jeans,%20is%20escap-Ii7aS6qxfHzcrvjz9ON7lEHxIDbZlJ.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "History had changed, and now it showed that Nobunaga had united the country. But the world remained peaceful, just as it should be.",
            ja: "<ruby>歴史<rt>れきし</rt></ruby>は、<ruby>信長<rt>のぶなが</rt></ruby>が<ruby>天下<rt>てんか</rt></ruby>をとったことになっていたが、<ruby>世<rt>よ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>は<ruby>平和<rt>へいわ</rt></ruby>のままだった。",
            es: "La historia había cambiado, y ahora mostraba que Nobunaga había unificado el país. Pero el mundo permaneció en paz, tal como debía ser."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/なかまぼしゅう%20(1)-uoxOj5dxLDyN1bDfz7Jvoh7wPa612Y.png"
        }
      }
    ]
  },
  {
    id: "wizard-mysterious-dish",
    title: "The Wizard and the Mysterious Dish",
    description: "A magical cooking adventure with three wizard triplets.",
    japaneseDescription: "3人の魔法使いの三つ子による魔法の料理冒険。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2018.52.22%20-%20A%20paper%20craft%20style%20illustration%20featuring%20a%20whimsical%20bowl%20of%20soup%20with%20various%20ingredients,%20characterized%20by%20a%20mysterious%20purple%20color.%20The%20textured-iaHKUJF6J3tsdDGFmWj6bTi3unXWqq.webp",
    pages: [
      {
        type: 'cover',
        content: {
          title: {
            en: "The Wizard and the Mysterious Dish",
            ja: "まほうつかいとふしぎな料理",
            es: "El Mago y el Plato Misterioso"
          },
          text: {
            en: "",
            ja: "",
            es: ""
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2018.52.22%20-%20A%20paper%20craft%20style%20illustration%20featuring%20a%20whimsical%20bowl%20of%20soup%20with%20various%20ingredients,%20characterized%20by%20a%20mysterious%20purple%20color.%20The%20textured-iaHKUJF6J3tsdDGFmWj6bTi3unXWqq.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Once upon a time, there were three wizard triplets named Moyashi, Natto, and Coconut. They loved to cook magical dishes together.",
            ja: "むかしむかし、<ruby>三<rt>みっ</rt></ruby>つ<ruby>子<rt>ご</rt></ruby>の<ruby>魔法使<rt>まほうつか</rt></ruby>いの、もやしと、なっとう、ココナッツがいました。",
            es: "Había una vez tres hermanos magos trillizos llamados Moyashi, Natto y Coconut. Les encantaba cocinar platos mágicos juntos."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ビーフ%20(1)-IxZEzheuoEssKUFrda5xJTnJMDhkV3.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Three wizard triplets named Moyashi, Natto, and Coconut went on an adventure to find ingredients for their special cooking.",
            ja: "<ruby>三<rt>みっ</rt></ruby>つ<ruby>子<rt>ご</rt></ruby>の<ruby>魔法使<rt>まほうつか</rt></ruby>いの、もやしと、なっとう、ココナッツがいました。<ruby>料理<rt>りょうり</rt></ruby>を<ruby>作<rt>つく</rt></ruby>るために<ruby>冒険<rt>ぼうけん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きました。",
            es: "Los tres hermanos magos trillizos llamados Moyashi, Natto y Coconut fueron de aventura para buscar ingredientes para su cocina especial."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ビーフ%20(1)-IxZEzheuoEssKUFrda5xJTnJMDhkV3.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Together, they gathered all the ingredients they needed for their magical recipe.",
            ja: "<ruby>皆<rt>みな</rt></ruby>で<ruby>料理<rt>りょうり</rt></ruby>の<ruby>材料<rt>ざいりょう</rt></ruby>を<ruby>用意<rt>ようい</rt></ruby>しています。",
            es: "Juntos, reunieron todos los ingredientes que necesitaban para su receta mágica."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ビーフ%20(2)-7B8O8Psm5Hs9SDltVn68OGX6ciNjR5.png"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "They finished making their soup with many different ingredients. To their surprise, it turned into a mysterious purple color!",
            ja: "<ruby>色々<rt>いろいろ</rt></ruby>な<ruby>材料<rt>ざいりょう</rt></ruby>をいれたスープが<ruby>完成<rt>かんせい</rt></ruby>しました。とても<ruby>不思議<rt>ふしぎ</rt></ruby>で<ruby>紫色<rt>むらさきいろ</rt></ruby>のスープができてびっくりです。",
            es: "Terminaron de hacer su sopa con muchos ingredientes diferentes. ¡Para su sorpresa, se volvió de un misterioso color morado!"
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2018.52.22%20-%20A%20paper%20craft%20style%20illustration%20featuring%20a%20whimsical%20bowl%20of%20soup%20with%20various%20ingredients,%20characterized%20by%20a%20mysterious%20purple%20color.%20The%20textured-AVgoxbu4o2n3AK4gmpnrqvHaCBE0QD.webp"
        }
      },
      {
        type: 'page',
        content: {
          text: {
            en: "Everyone enjoyed eating their delicious meal together outside.",
            ja: "<ruby>皆<rt>みな</rt></ruby>でお<ruby>外<rt>そと</rt></ruby>で<ruby>食<rt>た</rt></ruby>べておいしいな。",
            es: "Todos disfrutaron comiendo su deliciosa comida juntos al aire libre."
          },
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-29%2019.01.45%20-%20A%20charming%20paper%20craft%20style%20illustration%20of%20three%20triplets%20enjoying%20their%20meal%20outdoors%20under%20a%20bright%20blue%20sky.%20The%20setting%20includes%20a%20whimsical%20pur-mkYzjfY9Px3lawrXef4aTwutebWKXS.webp"
        }
      }
    ]
  }
]

/* =======================
   Error Boundary
======================= */
function ErrorFallback({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
        <p className="text-gray-700">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

/* =======================
   Main Export
======================= */
export function GlobalbunnyStoryGalleryComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GlobalbunnyStoryGalleryContent />
    </ErrorBoundary>
  )
}

/* =======================
   Main Component
======================= */
function GlobalbunnyStoryGalleryContent() {
  // Define languageMap at the top level of the component
  const languageMap = {
    en: 'en-US',
    ja: 'ja-JP',
    es: 'es-ES'
  } as const;

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const [selectedStorybook, setSelectedStorybook] = useState<Storybook | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null)
  const [dragState, setDragState] = useState({
    startX: 0,
    currentX: 0,
    isDragging: false,
    progress: 0,
    velocity: 0,
    lastTime: 0
  })
  const [windowWidth, setWindowWidth] = useState(0)
  const [language, setLanguage] = useState<'en' | 'ja' | 'es'>('en')
  const [showInfo, setShowInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 慣性アニメーションのRef
  const inertiaAnimationRef = useRef<number>()
  const lastVelocityRef = useRef(0)

  // ウィンドウサイズを監視
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // THREE.jsによる3D描画のセットアップ
  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    // CSS2DRenderer (ラベル用)
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    document.body.appendChild(labelRenderer.domElement)

    // カメラコントロール
    const controls = new OrbitControls(camera, labelRenderer.domElement)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableDamping = true

    camera.position.set(0, 5, 15)
    camera.lookAt(0, 5, 0)

    // 背景HDRI読み込み
    const loader = new THREE.TextureLoader()
    loader.load(
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/オーロラ_大自然のHDRI360度パノラマ背景画像.jpg-Z4YemssYBjncOCJzd6ZE4eTlmZMoTv.jpeg',
      (texture) => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
        rt.fromEquirectangularTexture(renderer, texture)
        scene.background = rt.texture
      }
    )

    // 本を並べるギャラリー
    const galleryRadius = 10
    const galleryHeight = 5
    const planeWidth = 3
    const planeHeight = 4.5
    const planes: THREE.Mesh[] = []

    storybooks.forEach((storybook, i) => {
      const angle = (i / storybooks.length) * Math.PI * 2
      const x = Math.cos(angle) * galleryRadius
      const z = Math.sin(angle) * galleryRadius

      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      })
      const plane = new THREE.Mesh(geometry, material)
      plane.position.set(x, galleryHeight, z)
      plane.lookAt(0, galleryHeight, 0)
      plane.userData = { storybookId: storybook.id }
      scene.add(plane)
      planes.push(plane)

      loader.load(storybook.coverImage, (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        plane.material.map = texture
        plane.material.needsUpdate = true
      })

      // タイトルをラベルとして表示
      const labelDiv = document.createElement('div')
      labelDiv.className = 'label'
      labelDiv.textContent = storybook.title
      labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
      labelDiv.style.color = 'white'
      labelDiv.style.padding = '5px 10px'
      labelDiv.style.borderRadius = '5px'
      labelDiv.style.fontSize = '14px'
      const label = new CSS2DObject(labelDiv)
      label.position.set(0, -planeHeight / 2 - 0.5, 0)
      plane.add(label)
    })

    // レイキャスト準備
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    function onMouseClick() {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(planes)
      if (intersects.length > 0) {
        const clickedPlane = intersects[0].object
        const storybookId = clickedPlane.userData.storybookId
        const selectedBook = storybooks.find((book) => book.id === storybookId)
        if (selectedBook) {
          setSelectedStorybook(selectedBook)
          setCurrentPage(0)
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onMouseClick)

    // アニメーションループ
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animate()

    // リサイズ処理
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      labelRenderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onMouseClick)
      
      // DOMから要素を削除
      if (labelRenderer && labelRenderer.domElement && document.body.contains(labelRenderer.domElement)) {
        document.body.removeChild(labelRenderer.domElement)
      }
      
      // レンダラーのリソースを解放
      if (renderer && typeof renderer.dispose === 'function') {
        renderer.dispose()
      }
      
      // CSS2DRendererのdisposeメソッドは呼び出さない
      // 代わりにDOMから要素を削除するだけ（上で実行済み）
    }
  }, [])

  // タッチイベントのハンドラー
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isFlipping) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const now = performance.now();
    
    setDragState(prev => ({
      ...prev,
      startX: clientX,
      currentX: clientX,
      isDragging: true,
      progress: 0,
      velocity: 0,
      lastTime: now
    }));

    if (inertiaAnimationRef.current) {
      cancelAnimationFrame(inertiaAnimationRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragState.isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const now = performance.now();
    const deltaTime = now - dragState.lastTime;
    const deltaX = clientX - dragState.currentX;
    const velocity = deltaTime > 0 ? deltaX / deltaTime : 0;
    
    const diff = clientX - dragState.startX;
    const progress = Math.min(Math.abs(diff) / 100, 1);
    const direction = diff < 0 ? 'next' : 'prev';

    // 方向に応じた制限チェック
    if ((direction === 'next' && currentPage >= (selectedStorybook?.pages.length || 0) - 1) ||
        (direction === 'prev' && currentPage <= 0)) {
      return;
    }

    setDragState(prev => ({
      ...prev,
      currentX: clientX,
      progress,
      velocity,
      lastTime: now
    }));
    lastVelocityRef.current = velocity;
    setFlipDirection(direction);
  };

  const handleTouchEnd = () => {
    if (!dragState.isDragging) return;
    const diff = dragState.currentX - dragState.startX;
    const threshold = 30;
    const direction = diff < 0 ? 'next' : 'prev';
    const velocity = lastVelocityRef.current;
    const velocityThreshold = 0.5;

    if (Math.abs(diff) >= threshold || Math.abs(velocity) > velocityThreshold) {
      // 慣性アニメーションを開始
      let currentVelocity = velocity;
      let currentProgress = dragState.progress;
      const startTime = performance.now();

      const animateInertia = () => {
        const now = performance.now();
        const deltaTime = (now - startTime) / 1000; // 秒単位に変換

        // 減速
        currentVelocity *= Math.pow(0.9, deltaTime * 60);
        currentProgress += currentVelocity * 0.016; // 60fpsを想定

        if (currentProgress >= 1) {
          flipPage(direction);
        } else if (Math.abs(currentVelocity) > 0.01) {
          setDragState(prev => ({
            ...prev,
            progress: currentProgress
          }));
          inertiaAnimationRef.current = requestAnimationFrame(animateInertia);
        } else {
          // 速度が十分小さくなったら元の位置に戻す
          setDragState(prev => ({ ...prev, progress: 0 }));
          setFlipDirection(null);
        }
      };

      inertiaAnimationRef.current = requestAnimationFrame(animateInertia);
    } else {
      // 閾値未満の場合はアニメーションを元に戻す
      setDragState(prev => ({ ...prev, progress: 0 }));
      setFlipDirection(null);
    }

    setDragState(prev => ({ ...prev, isDragging: false }));
  };

  // ページをめくる動作
  const flipPage = (direction: 'next' | 'prev') => {
    if (isFlipping || !selectedStorybook) return;
    setIsFlipping(true);
    setFlipDirection(direction);
    setCurrentPage((prev) => {
      if (direction === 'next' && prev < selectedStorybook.pages.length - 1) return prev + 1;
      if (direction === 'prev' && prev > 0) return prev - 1;
      return prev;
    });
    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
      setDragState(prev => ({ ...prev, progress: 0 }));
    }, 800);
  };

  // 言語切り替え
  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === 'en') return 'ja'
      if (prev === 'ja') return 'es'
      return 'en'
    })
  }

  const bookWidth = windowWidth < 640 ? 300 : windowWidth < 768 ? 500 : 700
  const bookHeight = windowWidth < 640 ? 400 : windowWidth < 768 ? 600 : 800

  const renderPageContent = (pageIndex: number) => {
    if (!selectedStorybook) return null
    const page = selectedStorybook.pages[pageIndex]
    if (!page) return null

    if (page.type === 'cover') {
      return (
        <div className="w-full h-full relative overflow-hidden">
          <Image
            src={page.content.image}
            alt="Cover image"
            layout="fill"
            objectFit="cover"
            className="brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-sm">
                {page.content.title?.[language] || ''}
              </h1>
              {page.content.title?.[language] && (
                <SpeechButton
                  text={page.content.title[language]}
                  lang={languageMap[language]}
                  className="ml-4"
                />
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full h-full flex flex-col">
        <div className="relative w-full h-[70%] bg-white">
          <Image
            src={page.content.image}
            alt={`Illustration for page ${pageIndex}`}
            layout="fill"
            objectFit="contain"
            priority={pageIndex <= 1}  // 最初の2ページは優先的に読み込み
            className="rounded-t-lg"
          />
        </div>
        <div className="h-[30%] bg-white bg-opacity-80 p-4 pb-8 overflow-hidden relative">
          <div className="flex items-start justify-between">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
              {language === 'ja' ? (
                <span dangerouslySetInnerHTML={{ __html: page.content.text[language] }} />
              ) : (
                page.content.text[language]
              )}
            </p>
            <SpeechButton
              text={page.content.text[language]}
              lang={languageMap[language]}
              className="ml-4"
            />
          </div>
          <div className="absolute bottom-2 right-2 text-xs sm:text-sm font-semibold text-gray-600">
            {language === 'en'
              ? `Page ${pageIndex}`
              : language === 'ja'
              ? `${pageIndex} ページ`
              : `Página ${pageIndex}`}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        ruby {
          ruby-align: center;
        }
        rt {
          font-size: 0.6em;
          text-align: center;
          color: #666;
        }
        .page-transform {
          will-change: transform, opacity;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.45, 1.1);
        }
        .page-shadow {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0));
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          will-change: opacity;
        }
        .page-gradient {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3));
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          will-change: opacity;
        }
        .page-content {
          will-change: transform, opacity;
          transition: opacity 0.3s ease;
        }
      `}</style>
      <div className="relative w-full h-screen">
        <canvas ref={canvasRef} className="w-full h-full" />
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
          <h1 className="text-2xl font-bold">Globalbunny Storybook Gallery</h1>
          <button onClick={() => setShowInfo(true)} className="p-2">
            <Info size={24} />
          </button>
        </header>
        {selectedStorybook && (
          <div 
            ref={bookRef}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            <div
              className="relative mb-4"
              style={{
                width: `${bookWidth}px`,
                height: `${bookHeight}px`,
                perspective: '2000px'
              }}
            >
              {/* Book pages */}
              {/* Book cover */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg shadow-2xl overflow-hidden page-transform"
                style={{
                  transform: `
                    rotateY(${currentPage === 0 ? '0deg' : '-180deg'})
                    ${(isFlipping || dragState.isDragging) && currentPage === 0 ? `
                      scale(${0.98 + (dragState.progress * 0.02)})
                      translateZ(${dragState.progress * 20}px)
                    ` : ''}
                  `,
                  transformOrigin: 'left',
                  zIndex: selectedStorybook.pages.length + 1
                }}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={selectedStorybook.pages[0].content.image}
                    alt="Cover image"
                    layout="fill"
                    objectFit="cover"
                    priority={true}
                    className="brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-sm">
                        {selectedStorybook.pages[0].content.title?.[language] || ''}
                      </h1>
                      {selectedStorybook.pages[0].content.title?.[language] && (
                        <SpeechButton
                          text={selectedStorybook.pages[0].content.title[language]}
                          lang={languageMap[language]}
                          className="ml-4"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book spine */}
              <div
                className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-pink-600 to-purple-700 rounded-l-lg shadow-inner"
                style={{
                  transform: 'rotateY(-80deg) translateX(-8px)',
                  transformOrigin: 'left',
                  boxShadow: (isFlipping || dragState.isDragging) ? '5px 0 15px rgba(0,0,0,0.3)' : '2px 0 10px rgba(0,0,0,0.2)',
                  transition: 'box-shadow 0.8s ease'
                }}
              ></div>

              {/* Book pages */}
              {selectedStorybook.pages.map((page, index) => (
                <div
                  key={index}
                  className="absolute inset-0 flex rounded-lg shadow-md overflow-hidden page-transform"
                  style={{
                    transform: `
                      rotateY(${index <= currentPage ? '-180deg' : '0deg'})
                      ${(isFlipping || dragState.isDragging) && (
                        (index === currentPage && flipDirection === 'next') ||
                        (index === currentPage - 1 && flipDirection === 'prev')
                      ) ? `
                        scale(${0.98 + (dragState.progress * 0.02)})
                        translateZ(${dragState.progress * 20}px)
                        rotateY(${flipDirection === 'next' ? 
                          -180 + (180 * (1 - dragState.progress)) + (Math.sin(dragState.progress * Math.PI) * 5) :
                          -180 * dragState.progress + (Math.sin(dragState.progress * Math.PI) * 5)
                        }deg)
                      ` : ''}
                    `,
                    transformOrigin: 'left',
                    zIndex: selectedStorybook.pages.length - index
                  }}
                >
                  {/* Front of the page */}
                  <div 
                    className="w-full h-full bg-white relative page-content"
                    style={{
                      boxShadow: (isFlipping || dragState.isDragging) ? 
                        `0 ${5 + (dragState.progress * 10)}px ${10 + (dragState.progress * 15)}px rgba(0,0,0,${0.1 + (dragState.progress * 0.1)})` : 
                        'none',
                      transform: dragState.isDragging ? 
                        `perspective(2000px) rotateX(${Math.sin(dragState.progress * Math.PI) * 2}deg)` : 
                        'none'
                    }}
                  >
                    {renderPageContent(index)}
                    <div 
                      className="page-shadow"
                      style={{
                        opacity: (isFlipping || dragState.isDragging) ? 0.15 + (dragState.progress * 0.15) : 0,
                        left: flipDirection === 'next' ? 0 : 'auto',
                        right: flipDirection === 'prev' ? 0 : 'auto',
                        transform: `scaleX(${1 + (dragState.progress * 0.2)})`
                      }}
                    />
                    <div 
                      className="page-gradient"
                      style={{
                        opacity: dragState.isDragging ? dragState.progress * 0.3 : 0,
                        left: flipDirection === 'next' ? 0 : 'auto',
                        right: flipDirection === 'prev' ? 0 : 'auto'
                      }}
                    />
                  </div>

                  {/* Back of the page */}
                  <div
                    className="absolute inset-0 bg-white page-content"
                    style={{
                      transform: `
                        rotateY(180deg)
                        ${dragState.isDragging ? 
                          `rotateX(${Math.sin(dragState.progress * Math.PI) * 2}deg)` : 
                          ''
                        }
                      `,
                      backfaceVisibility: 'hidden',
                      boxShadow: (isFlipping || dragState.isDragging) ? 
                        `0 ${5 + (dragState.progress * 10)}px ${10 + (dragState.progress * 15)}px rgba(0,0,0,${0.1 + (dragState.progress * 0.1)})` : 
                        'none',
                      opacity: dragState.isDragging ? 1 - (dragState.progress * 0.3) : 1
                    }}
                  >
                    {renderPageContent(index + 1)}
                    <div 
                      className="page-shadow"
                      style={{
                        opacity: (isFlipping || dragState.isDragging) ? 0.15 + (dragState.progress * 0.15) : 0,
                        left: flipDirection === 'prev' ? 0 : 'auto',
                        right: flipDirection === 'next' ? 0 : 'auto',
                        transform: `scaleX(${1 + (dragState.progress * 0.2)})`
                      }}
                    />
                    <div 
                      className="page-gradient"
                      style={{
                        opacity: dragState.isDragging ? dragState.progress * 0.3 : 0,
                        left: flipDirection === 'prev' ? 0 : 'auto',
                        right: flipDirection === 'next' ? 0 : 'auto'
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Navigation and controls */}
              <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-4 z-50">
                <div className="bg-black bg-opacity-50 px-6 py-3 rounded-full flex items-center gap-4">
                  <Button
                    onClick={() => flipPage('prev')}
                    disabled={currentPage === 0 || isFlipping}
                    aria-label={language === 'en' ? 'Previous page' : '前のページ'}
                    className="shadow-lg"
                    variant="outline"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  {/* Language toggle */}
                  <Button
                    onClick={toggleLanguage}
                    className="shadow-lg bg-white hover:bg-gray-100 min-w-[100px]"
                    variant="outline"
                  >
                    <Languages className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'English' : language === 'ja' ? '日本語' : 'Español'}
                  </Button>

                  <Button
                    onClick={() => flipPage('next')}
                    disabled={currentPage === selectedStorybook.pages.length - 1 || isFlipping}
                    aria-label={language === 'en' ? 'Next page' : '次のページ'}
                    className="shadow-lg"
                    variant="outline"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  <Button
                    onClick={() => setSelectedStorybook(null)}
                    aria-label={language === 'en' ? 'Return to gallery' : 'ギャラリーに戻る'}
                    className="shadow-lg"
                    variant="outline"
                  >
                    {language === 'en' ? 'Back to Gallery' : 'ギャラリーに戻る'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showInfo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[calc(100vh-8rem)] overflow-auto">
              <h2 className="text-2xl font-bold mb-4">About the Gallery</h2>
              <p className="mb-4">
                This interactive 3D gallery showcases a collection of multilingual storybooks.
                Navigate through the space to discover different stories and immerse yourself in
                their worlds.
              </p>
              <h3 className="text-xl font-bold mb-2">How to Use</h3>
              <ul className="list-disc list-inside mb-4">
                <li>Click and drag to rotate the view</li>
                <li>Click on a book cover to open and read the story</li>
                <li>Use the language toggle to switch between English, Japanese, and Spanish</li>
                <li>Navigate through the pages using the arrow buttons</li>
              </ul>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

