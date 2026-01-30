import { create } from 'zustand';

export type Language = 'EN' | 'ZH' | 'JP';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
    EN: {
        'system.title': 'TYPE-MOON HOLOGRAPH',
        'system.subtitle': 'World Structure Visualization System',
        'layer.surface': 'SURFACE',
        'layer.reverse': 'REVERSE',
        'layer.control': 'LAYER',
        'geo.asia': 'ASIA',
        'geo.europe': 'EUROPE',
        'geo.africa': 'AFRICA',
        'geo.na': 'NORTH\nAMERICA',
        'geo.sa': 'SOUTH\nAMERICA',
        'geo.oceania': 'OCEANIA',
        'geo.antarctica': 'ANTARCTICA',
        'country.russia': 'Russia',
        'country.usa': 'USA',
        'country.china': 'China',
        'country.japan': 'Japan',
        'country.taiwan': 'Taiwan',
        'country.uk': 'UK',
        'era.genesis': 'GENESIS',
        'era.history': 'HISTORY',
        'era.modern': 'MODERN',
        'era.future': 'FUTURE',
        // Location Details
        'loc.fuyuki.name': 'Fuyuki City',
        'loc.fuyuki.desc': 'A provincial city in Japan that served as the stage for the Holy Grail Wars. Situated on a strong leyline, it is divided into the traditional Miyama Town and the modernized Shinto.',
        'loc.clocktower.name': 'Clock Tower',
        'loc.clocktower.desc': 'The headquarters of the Mage\'s Association, located beneath the British Museum in London. It is the center of the magical world, preserving Mystery and managing mages.',
        // Works
        'work.fsn': 'Fate/stay night',
        'work.fz': 'Fate/Zero',
        'work.casefiles': 'Lord El-Melloi II Case Files',
        // Characters
        'char.saber': 'Altria Pendragon',
        'char.rin': 'Rin Tohsaka',
        'char.shirou': 'Shirou Emiya',
        'char.waver': 'Lord El-Melloi II',
        'char.zelretch': 'Kischur Zelretch Schweinorg',
    },
    ZH: {
        'system.title': '型月 全息投影系統',
        'system.subtitle': '世界構造可視化系統',
        'layer.surface': '表側',
        'layer.reverse': '裏側',
        'layer.control': '層級',
        'geo.asia': '亞洲',
        'geo.europe': '歐洲',
        'geo.africa': '非洲',
        'geo.na': '北美洲',
        'geo.sa': '南美洲',
        'geo.oceania': '大洋洲',
        'geo.antarctica': '南極洲',
        'country.russia': '俄羅斯',
        'country.usa': '美國',
        'country.china': '中國',
        'country.japan': '日本',
        'country.taiwan': '台灣',
        'country.uk': '英國',
        'era.genesis': '神代',
        'era.history': '人類史',
        'era.modern': '近代',
        'era.future': '未來',
        // Location Details
        'loc.fuyuki.name': '冬木市',
        'loc.fuyuki.desc': '位於日本的極東之地，作為「聖杯戰爭」舞台的地方都市。擁有強力的靈脈，分為古老的深山町與現代化的新都。',
        'loc.clocktower.name': '時鐘塔',
        'loc.clocktower.desc': '魔術協會的總部，位於倫敦大英博物館的地下。是魔術世界的中心，負責神祕的各種管理與魔術師的教育。',

        // Works
        'work.fsn': 'Fate/stay night',
        'work.fz': 'Fate/Zero',
        'work.casefiles': '艾梅洛閣下II世事件簿',
        // Characters
        'char.saber': '阿爾托莉雅·潘德拉貢',
        'char.rin': '遠坂 凜',
        'char.shirou': '衛宮 士郎',
        'char.waver': '艾梅洛閣下II世',
        'char.zelretch': '基修亞·澤爾里奇·修拜因奧古',
    },
    JP: {
        'system.title': 'TYPE-MOON ホログラフ',
        'system.subtitle': '世界構造可視化システム',
        'layer.surface': '表層',
        'layer.reverse': '裏側',
        'layer.control': '階層',
        'geo.asia': 'アジア',
        'geo.europe': 'ヨーロッパ',
        'geo.africa': 'アフリカ',
        'geo.na': '北アメリカ',
        'geo.sa': '南アメリカ',
        'geo.oceania': 'オセアニア',
        'geo.antarctica': '南極',
        'country.russia': 'ロシア',
        'country.usa': 'アメリカ',
        'country.china': '中国',
        'country.japan': '日本',
        'country.taiwan': '台湾',
        'country.uk': 'イギリス',
        'era.genesis': '神代',
        'era.history': '人類史',
        'era.modern': '現代',
        'era.future': '未来',
        // Location Details
        'loc.fuyuki.name': '冬木市',
        'loc.fuyuki.desc': '日本の地方都市。「聖杯戦争」の舞台となった。強力な霊脈があり、深山町と新都に分かれている。',
        'loc.clocktower.name': '時計塔',
        'loc.clocktower.desc': 'ロンドン・大英博物館の地下に位置する魔術協会の本部。魔術世界の中心であり、神秘の隠匿と管理を行っている。',

        // Works
        'work.fsn': 'Fate/stay night',
        'work.fz': 'Fate/Zero',
        'work.casefiles': 'ロード・エルメロイII世の事件簿',
        // Characters
        'char.saber': 'アルトリア・ペンドラゴン',
        'char.rin': '遠坂 凛',
        'char.shirou': '衛宮 士郎',
        'char.waver': 'ロード・エルメロイII世',
        'char.zelretch': 'キシュア・泽ルレッチ・シュバインオーグ',
    }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
    language: 'EN', // Default
    setLanguage: (lang) => set({ language: lang }),
    t: (key) => {
        const lang = get().language;
        return TRANSLATIONS[lang][key] || key;
    }
}));
