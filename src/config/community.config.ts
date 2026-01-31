/**
 * Community System Configuration
 * 社群系統的所有可配置參數，便於調整遊戲平衡
 */

import { UserTier, BadgeRarity } from '@/types/community';

// ==================== VOTING CONFIGURATION ====================

export const VOTING_CONFIG = {
  // Default voting requirements
  defaultMinVoters: 3,
  defaultApprovalThreshold: 0.5,        // 50%
  defaultMinReputation: 50,

  // Voting period (in days)
  defaultVotingPeriod: 7,
  expeditedVotingPeriod: 3,             // When user pays tokens

  // Dispute voting (when editing conflicts)
  disputeVotingPeriod: 5,
  disputeApprovalThreshold: 0.6,        // 60% for disputes

  // Controversy voting (when accuracy is questioned)
  controversyVotingPeriod: 3,
  controversyRejectThreshold: 0.6,      // 60% to reject
} as const;

// ==================== REPUTATION TIERS ====================

export const TIER_REQUIREMENTS = {
  Apprentice: {
    minReputation: 0,
    minEdits: 0,
    minApprovalRate: 0,
    voting: false,
    features: ['submit_proposals'],
  },
  Editor: {
    minReputation: 101,
    minEdits: 5,
    minApprovalRate: 0.5,
    voting: true,
    features: ['submit_proposals', 'vote', 'comment_on_proposals'],
    votingWeightMultiplier: 1,
  },
  Expert: {
    minReputation: 301,
    minEdits: 20,
    minApprovalRate: 0.8,
    voting: true,
    features: ['submit_proposals', 'vote', 'comment_on_proposals', 'review_role'],
    votingWeightMultiplier: 2,
  },
  Archivist: {
    minReputation: 601,
    minEdits: 50,
    minApprovalRate: 0.75,
    votingPeriod: 180,                  // Must be active for 6 months
    voting: true,
    features: [
      'submit_proposals',
      'vote',
      'comment_on_proposals',
      'review_role',
      'initiate_dispute_vote',
      'manage_community',
    ],
    votingWeightMultiplier: 3,
  },
  Keeper: {
    minReputation: 851,
    minEdits: 100,
    minApprovalRate: 0.8,
    voting: true,
    features: [
      'submit_proposals',
      'vote',
      'comment_on_proposals',
      'review_role',
      'initiate_dispute_vote',
      'manage_community',
      'governance_proposals',
      'system_settings',
    ],
    votingWeightMultiplier: 5,
  },
} as const;

// ==================== REPUTATION GAINS ====================

export const REPUTATION_GAINS = {
  // Edits
  firstEditApproved: 20,
  editApproved: 10,
  largeEditApproved: 50,                // 5+ changes
  editMarkedHelpful: 5,

  // Voting
  voteParticipation: 2,
  correctVote: 5,                       // When vote matches final result

  // Community
  editReferenced: 15,                   // When someone builds on your edit
  commentApproved: 3,
  disputeResolved: 25,

  // Moderation
  reportValidated: 10,
  reportFalseNegative: -5,
} as const;

// ==================== REPUTATION PENALTIES ====================

export const REPUTATION_PENALTIES = {
  editRejected: -3,
  editReverted: -5,
  proposalSpam: -10,
  disputeLost: -10,
  reportFalsePositive: -15,
  contentViolation: -50,
  banEvasion: -100,
} as const;

// ==================== TOKEN ECONOMY (QP - Quantum Piece) ====================

/**
 * QP (Quantum Piece) - Community Contribution Token
 *
 * QP 是型月全息投影社群貢獻者的虛擬激勵代幣。
 * 用戶通過編輯內容、投票治理、幫助社群等行為獲得 QP。
 * QP 無法交易、出售或轉換成真實貨幣，純粹作為社群參與的遊戲化獎勵。
 */

export const TOKEN_CONFIG = {
  // Initial token allocation
  initialBalanceForNewUsers: 20,        // 新用戶啟動資金

  // Token rewards (QP earnings)
  rewards: {
    firstEdit: 10,                      // 首次編輯獎勵（一次性）
    editApproved: 5,                    // 編輯通過獎勵
    largeEditApproved: 25,              // 大型編輯獎勵（5+ 變更）
    editMarkedHelpful: 3,               // 被標記為有幫助

    voteParticipation: 0.5,             // 參與投票
    correctVote: 2,                     // 投票與最終結果一致

    editReferenced: 5,                  // 編輯被其他人引用
    dailyLogin: 1,                      // 每日登錄獎勵
    dailyMaxLogin: 5,                   // 每日最高登錄獎勵
  },

  // Token costs (QP 花費)
  costs: {
    expediteProposal: 10,               // 加速投票：7天 → 3天
    addPromotionBadge: 50,              // 添加「官方推薦」標籤
    viewEditNotes: 5,                   // 查看編輯者的筆記/理由
    lockProposal: 20,                   // 鎖定提案，防止進一步編輯
    disputeInitiation: 0,               // 發起爭議投票（免費）
  },

  // Token limits
  daily: {
    maxTokenEarn: 50,                   // 每日最高獲得 50 QP
    maxVotingReward: 20,                // 投票獎勵每日上限
  },

  // Supply
  totalSupply: 1000000,                 // 1M 總供應量
  burnRate: 0.01,                       // 花費的 QP 中 1% 被銷毀
} as const;

// ==================== BADGES & ACHIEVEMENTS ====================

export const BADGES = {
  // Milestone badges
  'newcomer': {
    name: 'Newcomer',
    description: 'Complete your first edit proposal',
    icon: '🌱',
    rarity: 'common' as BadgeRarity,
    condition: 'First approved edit',
  },

  'accurate-editor': {
    name: 'Accurate Editor',
    description: 'Get 5+ "helpful" votes on your edits',
    icon: '🎯',
    rarity: 'rare' as BadgeRarity,
    condition: '5 helpful votes received',
  },

  'geography-master': {
    name: 'Geography Master',
    description: 'Edit 10+ locations',
    icon: '📍',
    rarity: 'epic' as BadgeRarity,
    condition: '10+ location edits',
  },

  'character-collector': {
    name: 'Character Collector',
    description: 'Edit 20+ characters',
    icon: '👥',
    rarity: 'rare' as BadgeRarity,
    condition: '20+ character edits',
  },

  'governance-participant': {
    name: 'Governance Participant',
    description: 'Vote in 50+ proposals',
    icon: '🏆',
    rarity: 'rare' as BadgeRarity,
    condition: '50 votes cast',
  },

  'speed-runner': {
    name: 'Speed Runner',
    description: 'Get an edit approved within 24 hours',
    icon: '⚡',
    rarity: 'common' as BadgeRarity,
    condition: 'Edit approved in <24hrs',
  },

  'complete-editor': {
    name: 'Complete Editor',
    description: 'Make a comprehensive edit with description, images, references',
    icon: '🎨',
    rarity: 'epic' as BadgeRarity,
    condition: 'Comprehensive edit (5+ fields)',
  },

  'global-explorer': {
    name: 'Global Explorer',
    description: 'Edit locations across 5+ continents',
    icon: '🌍',
    rarity: 'epic' as BadgeRarity,
    condition: '5+ continents',
  },

  'legendary-contributor': {
    name: 'Legendary Contributor',
    description: 'Reach Archivist or Keeper tier',
    icon: '💎',
    rarity: 'legendary' as BadgeRarity,
    condition: 'Tier >= Archivist',
  },

  'dispute-master': {
    name: 'Dispute Master',
    description: 'Win 10+ dispute votes',
    icon: '⚔️',
    rarity: 'epic' as BadgeRarity,
    condition: '10 dispute wins',
  },

  'community-leader': {
    name: 'Community Leader',
    description: 'Become a review moderator',
    icon: '👑',
    rarity: 'legendary' as BadgeRarity,
    condition: 'Expert tier +',
  },
} as const;

// ==================== CONTENT MODERATION ====================

export const MODERATION_CONFIG = {
  // Minimum character lengths
  minDescriptionLength: 20,
  minNoteLength: 50,

  // Maximum lengths
  maxTitleLength: 200,
  maxDescriptionLength: 5000,
  maxNoteLength: 10000,

  // Prohibited content patterns
  spamPatterns: [
    /viagra|cialis|casino/gi,
    /click here|buy now/gi,
  ],

  // Auto-rejection reasons
  autoRejectReasons: [
    'Spam content detected',
    'Inappropriate language',
    'Copyright violation',
    'Duplicate proposal',
  ],

  // Manual review required if
  requiresManualReview: {
    newUserEdits: true,
    largeContentChanges: true,
    multipleRejections: 3,              // If user's last 3 proposals rejected
  },
} as const;

// ==================== LEADERBOARD SETTINGS ====================

export const LEADERBOARD_CONFIG = {
  // Ranking tiers
  tiers: [
    { name: 'Legendary', topPercent: 0.1 },    // Top 0.1%
    { name: 'Epic', topPercent: 1 },           // Top 1%
    { name: 'Rare', topPercent: 5 },           // Top 5%
    { name: 'Uncommon', topPercent: 25 },      // Top 25%
  ],

  // Update frequency
  updateFrequency: 'daily',              // daily, weekly, monthly

  // Scoring formula
  scoreCalculation: {
    reputation: 1,                       // 1 point per reputation
    approvedEdits: 10,                   // 10 points per approved edit
    helpfulVotes: 5,                     // 5 points per helpful vote
    badges: 20,                          // 20 points per badge
    tokens: 0.01,                        // 0.01 points per token
  },

  // Decay (to prevent stagnation)
  decayRate: 0.001,                      // 0.1% per week for inactive users
  decayPeriodDays: 7,
} as const;

// ==================== PROPOSAL FLOW ====================

export const PROPOSAL_FLOW = {
  statuses: ['pending', 'approved', 'rejected', 'archived'],

  transitions: {
    pending: ['approved', 'rejected', 'archived'],
    approved: ['archived'],
    rejected: ['archived'],
    archived: [],
  },

  // Auto-actions
  autoArchiveAfterDays: 90,
  autoRejectIfVotingEndsWithoutApproval: true,
} as const;

// ==================== NOTIFICATION SETTINGS ====================

export const NOTIFICATION_CONFIG = {
  events: [
    'proposal_approved',
    'proposal_rejected',
    'vote_received',
    'edit_referenced',
    'tier_upgraded',
    'achievement_unlocked',
    'badge_received',
    'dispute_initiated',
  ],

  channels: ['in_app', 'email'],
  userCanCustomize: true,
} as const;
