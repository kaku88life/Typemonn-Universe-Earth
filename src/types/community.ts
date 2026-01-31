/**
 * Community System Type Definitions
 * 獨立的社群系統類型定義，便於類型檢查和維護
 */

// ==================== USER & REPUTATION ====================

export type UserTier = 'Apprentice' | 'Editor' | 'Expert' | 'Archivist' | 'Keeper';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;

  // Reputation System
  reputation: number;           // 0-1000
  tier: UserTier;

  // Statistics
  stats: {
    totalEdits: number;
    approvedEdits: number;
    approvalRate: number;      // percentage 0-100
    totalVotes: number;
    helpfulVotes: number;       // received
  };

  // GameFi
  tokens: {
    balance: number;
    earned: number;
    spent: number;
  };

  // Achievements
  badges: Badge[];
  achievements: Achievement[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

// ==================== PROPOSALS & VOTING ====================

export type ProposalType = 'location' | 'character' | 'note';
export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'archived';
export type VoteDecision = 'approve' | 'reject' | 'abstain';

export interface ProposalChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface Proposal {
  id: string;
  type: ProposalType;
  contentId: string;            // ID of the location/character/note being edited
  contentType: 'Location' | 'Character' | 'Note';

  // Changes
  changes: ProposalChange[];
  changelog: {
    field: string;
    before: string;
    after: string;
  }[];
  summary: string;              // User's explanation

  // Status
  status: ProposalStatus;
  proposedBy: string;           // User ID
  approvedByCount: number;
  rejectedByCount: number;

  // Voting
  minVoters: number;            // Default: 3
  approvalThreshold: number;    // Default: 0.5 (50%)
  minReputation: number;        // Default: 50

  // Timestamps
  createdAt: Date;
  endsAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

export interface Vote {
  id: string;
  proposalId: string;
  voterId: string;

  decision: VoteDecision;
  weight: number;               // Voter's reputation value
  comment?: string;
  reason?: string;

  createdAt: Date;
}

// ==================== CONTENT ====================

export interface LocationContent {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  type: 'City' | 'Landmark' | 'MagicAssociation' | 'Singularity' | 'Other';
  continent?: string;
  country?: string;
  year_start?: number;
  year_end?: number;
  world_lines?: string[];

  // Community metadata
  createdBy: string;
  lastEditBy: string;
  lastEditAt: Date;
  editCount: number;
  status: 'approved' | 'pending' | 'disputed';
}

export interface CharacterContent {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  class?: string;               // Servant class
  rarity?: 1 | 2 | 3 | 4 | 5;
  relatedLocations?: string[];
  relatedWorks?: string[];

  createdBy: string;
  lastEditBy: string;
  lastEditAt: Date;
  editCount: number;
  status: 'approved' | 'pending' | 'disputed';
}

export interface NoteContent {
  id: string;
  title: string;
  content: string;
  relatedLocation?: string;
  relatedCharacter?: string;
  worldLine?: string;
  year?: number;
  tags?: string[];

  createdBy: string;
  lastEditBy: string;
  lastEditAt: Date;
  status: 'approved' | 'pending' | 'disputed';
}

// ==================== ACHIEVEMENTS & BADGES ====================

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  unlockedAt: Date;
  condition: string;            // How to unlock
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  condition: string;            // Condition to unlock
  unlockedAt?: Date;
  progress: number;             // 0-100
  maxProgress: number;
  rewardTokens?: number;
}

// ==================== GAMIFI & TOKENS ====================

export type TransactionType = 'earn' | 'spend' | 'bonus' | 'penalty';

export interface TokenTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  reason: string;
  relatedProposalId?: string;
  createdAt: Date;
}

export interface RewardShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;                 // Token cost
  icon: string;
  category: 'priority' | 'badge' | 'premium' | 'cosmetic';
  active: boolean;
}

// ==================== GOVERNANCE ====================

export interface CommunityProposal {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'policy' | 'governance' | 'moderation';
  proposedBy: string;

  votes: {
    approve: string[];         // User IDs
    reject: string[];
  };

  status: 'voting' | 'approved' | 'rejected';
  createdAt: Date;
  endsAt: Date;
}

// ==================== STATISTICS & LEADERBOARD ====================

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  tier: UserTier;
  reputation: number;
  approvedEdits: number;
  approvalRate: number;
  badges: number;
  tokens: number;
}

export interface CommunityStats {
  totalMembers: number;
  totalProposals: number;
  approvedProposals: number;
  rejectedProposals: number;
  totalVotes: number;
  averageApprovalRate: number;
  activeMembers: number;        // Last 7 days
  totalTokensIssued: number;
}

// ==================== REPUTATION CALCULATION ====================

export const REPUTATION_THRESHOLDS = {
  Apprentice: { min: 0, max: 100 },
  Editor: { min: 101, max: 300 },
  Expert: { min: 301, max: 600 },
  Archivist: { min: 601, max: 850 },
  Keeper: { min: 851, max: 1000 },
} as const;

export const TIER_VOTING_WEIGHT = {
  Apprentice: 1,
  Editor: 1,
  Expert: 2,
  Archivist: 3,
  Keeper: 5,
} as const;

// ==================== TOKEN REWARDS ====================

export const TOKEN_REWARDS = {
  firstEdit: 10,
  editApproved: 5,
  largeEditApproved: 25,
  editHelpful: 3,
  voteParticipation: 0.5,
  correctVote: 2,
  editReferenced: 5,
  dailyLogin: 1,
} as const;
