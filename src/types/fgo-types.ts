/**
 * FGO Data Types from Atlas Academy API
 * @see https://api.atlasacademy.io/docs
 */

// ============================================
// Basic Types (Lightweight, for indexing)
// ============================================

export interface BasicServant {
    id: number;
    collectionNo: number;
    name: string;
    type: SvtType;
    flag: SvtFlag;
    className: ClassName;
    attribute: Attribute;
    rarity: number;
    atkMax: number;
    hpMax: number;
    face: string;
}

export interface BasicEquip {
    id: number;
    collectionNo: number;
    name: string;
    type: SvtType;
    flag: SvtFlag;
    rarity: number;
    atkMax: number;
    hpMax: number;
    face: string;
}

export interface BasicWar {
    id: number;
    coordinates: [number, number][]; // For map display
    age: string;
    name: string;
    longName: string;
    banner?: string;
    headerImage?: string;
    priority: number;
    parentWarId: number;
    materialParentWarId: number;
    emptyMessage: string;
}

export interface BasicEvent {
    id: number;
    type: EventType;
    name: string;
    noticeAt: number;
    startedAt: number;
    endedAt: number;
    finishedAt: number;
    materialOpenedAt: number;
    banner?: string;
    warIds: number[];
}

// ============================================
// Nice Types (Full detail, for display)
// ============================================

export interface NiceServant extends BasicServant {
    originalName: string;
    ruby: string;
    battleName: string;
    classId: number;
    traits: Trait[];
    gender: Gender;
    cards: Card[];
    hitsDistribution: Record<Card, number[]>;
    skills: NiceSkill[];
    classPassive: NiceSkill[];
    noblePhantasms: NiceTd[];
    profile?: NiceProfile;
    extraAssets: ExtraAssets;
}

export interface NiceSkill {
    id: number;
    num: number;
    name: string;
    originalName: string;
    ruby: string;
    detail?: string;
    type: SkillType;
    icon?: string;
    coolDown: number[];
    actIndividuality: Trait[];
    script: Record<string, unknown>;
    functions: NiceFunction[];
}

export interface NiceTd {
    id: number;
    num: number;
    card: Card;
    name: string;
    originalName: string;
    ruby: string;
    rank: string;
    type: string;
    detail?: string;
    npGain: NpGain;
    npDistribution: number[];
    functions: NiceFunction[];
}

export interface NiceFunction {
    funcId: number;
    funcType: string;
    funcTargetType: string;
    funcTargetTeam: string;
    funcPopupText: string;
    funcPopupIcon?: string;
    functvals: Trait[];
    funcquestTvals: Trait[];
    traitVals: Trait[];
    buffs: NiceBuff[];
    svals: Sval[];
}

export interface NiceBuff {
    id: number;
    name: string;
    detail: string;
    icon?: string;
    type: string;
    buffGroup: number;
    vals: Trait[];
    tvals: Trait[];
    ckSelfIndv: Trait[];
    ckOpIndv: Trait[];
    script: Record<string, unknown>;
}

export interface Sval {
    Rate: number;
    Turn: number;
    Count: number;
    Value: number;
    Value2: number;
    UseRate: number;
    Target: number;
    Correction: number;
    ParamAdd: number;
    ParamMax: number;
    HideMiss: number;
    OnField: number;
    HideNoEffect: number;
    Unforce: number;
    CaptureTrate: number;
    AboveDamageRatioTrait: number;
    TargetRatio: number;
    TargetPtRatio: number;
    DependFuncId: number;
    DependFuncVals: Record<string, unknown>;
}

export interface NpGain {
    buster: number[];
    arts: number[];
    quick: number[];
    extra: number[];
    np: number[];
    defence: number[];
}

export interface NiceProfile {
    cv: string;
    illustrator: string;
    stats?: Stats;
    costume: Record<string, NiceCostume>;
    voices: NiceVoiceGroup[];
    comments: ProfileComment[];
}

export interface Stats {
    strength: string;
    endurance: string;
    agility: string;
    magic: string;
    luck: string;
    np: string;
    policy?: string;
    personality?: string;
    deity?: string;
}

export interface NiceCostume {
    id: number;
    costumeCollectionNo: number;
    battleCharaId: number;
    name: string;
    shortName: string;
    detail: string;
    priority: number;
}

export interface NiceVoiceGroup {
    svtId: number;
    voicePrefix: number;
    type: string;
    voiceLines: VoiceLine[];
}

export interface VoiceLine {
    name?: string;
    condType: string;
    condValue: number;
    priority: number;
    svtVoiceType: string;
    overwriteName: string;
    id: string[];
    audioAssets: string[];
    delay: number[];
    face: number[];
    form: number[];
    text: string[];
    subtitle: string;
    conds: VoiceCond[];
    playConds: VoicePlayCond[];
}

export interface VoiceCond {
    condType: string;
    value: number;
    valueList: number[];
    eventId: number;
}

export interface VoicePlayCond {
    condGroup: number;
    condType: string;
    targetId: number;
    condValue: number;
    condValues: number[];
}

export interface ProfileComment {
    id: number;
    priority: number;
    condMessage: string;
    comment: string;
    condType: string;
    condValues: number[];
    condValue2: number;
}

export interface ExtraAssets {
    charaGraph: AssetMap;
    faces: AssetMap;
    charaGraphEx: AssetMap;
    charaGraphName: AssetMap;
    narrowFigure: AssetMap;
    charaFigure: AssetMap;
    charaFigureForm: Record<string, AssetMap>;
    charaFigureMulti: Record<string, AssetMap>;
    commands: AssetMap;
    status: AssetMap;
    equipFace: AssetMap;
    image: AssetMap;
    spriteModel: AssetMap;
    charaGraphChange: AssetMap;
    narrowFigureChange: AssetMap;
    facesChange: AssetMap;
}

export interface AssetMap {
    ascension?: Record<string, string>;
    costume?: Record<string, string>;
    equip?: Record<string, string>;
    cc?: Record<string, string>;
}

export interface Trait {
    id: number;
    name: string;
    negative?: boolean;
}

// ============================================
// Enums
// ============================================

export type SvtType =
    | 'normal'
    | 'heroine'
    | 'combineMaterial'
    | 'enemy'
    | 'enemyCollection'
    | 'servantEquip'
    | 'statusUp'
    | 'svtEquipMaterial'
    | 'enemyCollectionDetail'
    | 'all'
    | 'commandCode';

export type SvtFlag =
    | 'onlyUseForNpc'
    | 'svtEquipFriendShip'
    | 'ignoreCombineLimitSpecial'
    | 'svtEquipExp'
    | 'svtEquipChocolate'
    | 'normal'
    | 'goetia'
    | 'matDropRateUpCe';

export type ClassName =
    | 'saber'
    | 'archer'
    | 'lancer'
    | 'rider'
    | 'caster'
    | 'assassin'
    | 'berserker'
    | 'shielder'
    | 'ruler'
    | 'alterEgo'
    | 'avenger'
    | 'moonCancer'
    | 'foreigner'
    | 'pretender'
    | 'beast'
    | 'unknown';

export type Attribute =
    | 'human'
    | 'sky'
    | 'earth'
    | 'star'
    | 'beast';

export type Gender =
    | 'male'
    | 'female'
    | 'unknown';

export type Card =
    | 'arts'
    | 'buster'
    | 'quick'
    | 'extra'
    | 'blank'
    | 'weak';

export type SkillType =
    | 'active'
    | 'passive';

export type EventType =
    | 'none'
    | 'raidBoss'
    | 'pvp'
    | 'point'
    | 'loginBonus'
    | 'combineCampaign'
    | 'shop'
    | 'questCampaign'
    | 'bank'
    | 'serialCampaign'
    | 'loginCampaign'
    | 'loginCampaignRepeat'
    | 'eventQuest'
    | 'svtequipCombineCampaign'
    | 'terminalBanner'
    | 'boxGacha'
    | 'boxGachaPoint'
    | 'loginCampaignStrict'
    | 'totalLogin'
    | 'comebackCampaign'
    | 'locationCampaign'
    | 'warBoard'
    | 'combineCosutumeItem'
    | 'myroomMultipleViewCampaign'
    | 'interludeCampaign'
    | 'myroomPhotoCampaign'
    | 'fortuneRequest'
    | 'mcCampaign'
    | 'svtCelebration';

// ============================================
// API Response Wrappers
// ============================================

export type Region = 'JP' | 'NA';
export type Language = 'en' | 'ja' | 'ko' | 'zh';

export interface FGOApiError {
    detail: string;
}

// ============================================
// Location-FGO Mapping Types
// ============================================

export interface LocationServantMapping {
    locationId: string;
    servantIds: number[];
    reason: string; // e.g., "Summon Location", "Appears in Story"
}

export interface LocationWarMapping {
    locationId: string;
    warId: number;
    storyChapter: string;
}
