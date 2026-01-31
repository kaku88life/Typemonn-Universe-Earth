# Community System Implementation Guide
## 社群系統實作指南

**Last Updated**: 2026-02-01
**Status**: Planning Phase
**Complexity**: High

---

## 📁 Project Structure

```
src/
├── types/
│   └── community.ts              # ✅ All TypeScript interfaces
├── config/
│   └── community.config.ts       # ✅ Configurable parameters
├── lib/
│   └── community-utils.ts        # ✅ Utility functions
├── components/
│   └── Community/                # To be created
│       ├── ProposalForm.tsx
│       ├── ProposalList.tsx
│       ├── VotingCard.tsx
│       ├── DiffViewer.tsx
│       └── ProposalDetail.tsx
├── app/
│   └── api/
│       └── community/
│           ├── proposals/
│           │   ├── route.ts      # GET /api/community/proposals
│           │   └── [id]/
│           │       ├── route.ts  # GET /api/community/proposals/:id
│           │       └── vote/
│           │           └── route.ts # POST /api/community/proposals/:id/vote
│           ├── users/
│           │   ├── route.ts      # GET /api/community/users
│           │   └── [id]/
│           │       └── route.ts  # GET /api/community/users/:id
│           ├── leaderboard/
│           │   └── route.ts      # GET /api/community/leaderboard
│           └── tokens/
│               └── route.ts      # GET/POST token operations
└── store/
    └── useCommunityStore.ts      # Zustand store for community data
```

---

## 🛠️ Implementation Phases

### **Phase 1: Backend Infrastructure** (1-2 weeks)

#### 1.1 Prisma Schema Extension
```prisma
model Proposal {
  id                String @id @default(cuid())
  type              String
  contentId         String
  contentType       String
  changes           Json
  changelog         Json
  summary           String
  status            String
  proposedBy        String
  approvedByCount   Int @default(0)
  rejectedByCount   Int @default(0)
  minVoters         Int @default(3)
  approvalThreshold Float @default(0.5)
  minReputation     Int @default(50)
  createdAt         DateTime @default(now())
  endsAt            DateTime
  approvedAt        DateTime?
  rejectedAt        DateTime?

  votes             Vote[]
  proposer          UserProfile @relation("proposedBy", fields: [proposedBy], references: [id])
}

model Vote {
  id                String @id @default(cuid())
  proposalId        String
  voterId           String
  decision          String
  weight            Int
  comment           String?
  createdAt         DateTime @default(now())

  proposal          Proposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  voter             UserProfile @relation("votes", fields: [voterId], references: [id])

  @@unique([proposalId, voterId])
}

model UserProfile {
  id                String @id @default(cuid())
  username          String @unique
  email             String @unique
  avatar            String?

  reputation        Int @default(0)
  tier              String @default("Apprentice")

  totalEdits        Int @default(0)
  approvedEdits     Int @default(0)
  approvalRate      Int @default(0)
  totalVotes        Int @default(0)
  helpfulVotes      Int @default(0)

  tokenBalance      Int @default(0)
  tokenEarned       Int @default(0)
  tokenSpent        Int @default(0)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastActiveAt      DateTime?

  proposals         Proposal[] @relation("proposedBy")
  votes             Vote[] @relation("votes")
  badges            Badge[]
  achievements      Achievement[]
  transactions      TokenTransaction[]
}

model Badge {
  id                String @id @default(cuid())
  userId            String
  badgeId           String
  unlockedAt        DateTime @default(now())

  user              UserProfile @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
}

model Achievement {
  id                String @id @default(cuid())
  userId            String
  achievementId     String
  progress          Int @default(0)
  unlockedAt        DateTime?

  user              UserProfile @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
}

model TokenTransaction {
  id                String @id @default(cuid())
  userId            String
  type              String
  amount            Int
  reason            String
  relatedProposalId String?
  createdAt         DateTime @default(now())

  user              UserProfile @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Status**: 🔲 Not Started
**Estimated Time**: 2-3 hours

---

#### 1.2 API Routes Setup
Create base API structure:
- `GET /api/community/proposals` - List proposals
- `POST /api/community/proposals` - Create proposal
- `GET /api/community/proposals/:id` - Get proposal detail
- `POST /api/community/proposals/:id/vote` - Submit vote
- `GET /api/community/users/:id` - Get user profile
- `GET /api/community/leaderboard` - Get rankings

**Status**: 🔲 Not Started
**Estimated Time**: 4-6 hours

---

### **Phase 2: Frontend Components** (2-3 weeks)

#### 2.1 Proposal Management
- `ProposalForm.tsx` - Submit new proposal
  - Content editor with diff preview
  - Summary input
  - Auto-save draft functionality

- `ProposalList.tsx` - Browse proposals
  - Filter by status (pending, approved, rejected)
  - Sort by date, votes, reputation
  - Search functionality

- `ProposalDetail.tsx` - View single proposal
  - Before/After comparison
  - Voting results
  - Comments section

- `VotingCard.tsx` - Vote on proposal
  - Approve/Reject buttons
  - Optional comment input
  - Display voting deadline

- `DiffViewer.tsx` - Show changes
  - Side-by-side comparison
  - Highlight changes
  - Field-level diffs

**Status**: 🔲 Not Started
**Estimated Time**: 1 week

---

#### 2.2 User & Gamification
- `UserProfile.tsx` - User card
  - Reputation + tier badge
  - Statistics display
  - Recent activity

- `LeaderBoard.tsx` - Rankings
  - Top 100 users
  - Filter by tier/reputation
  - Score calculation

- `TokenBalance.tsx` - Token display
  - Current balance
  - Earn/spend history
  - Spend options

- `AchievementShowcase.tsx` - Badges & achievements
  - Grid of unlocked badges
  - Progress bars for active achievements
  - Rarity indicators

- `RewardShop.tsx` - Token marketplace
  - Item list
  - Purchase functionality
  - Transaction history

**Status**: 🔲 Not Started
**Estimated Time**: 1 week

---

### **Phase 3: State Management** (3-4 days)

#### 3.1 Zustand Store
```typescript
// src/store/useCommunityStore.ts
interface CommunityState {
  // Proposals
  proposals: Proposal[];
  selectedProposal: Proposal | null;
  fetchProposals: () => Promise<void>;
  createProposal: (data: ProposalData) => Promise<void>;
  submitVote: (proposalId: string, decision: VoteDecision) => Promise<void>;

  // User
  currentUser: UserProfile | null;
  fetchUserProfile: () => Promise<void>;

  // Leaderboard
  leaderboardUsers: LeaderboardEntry[];
  fetchLeaderboard: () => Promise<void>;

  // UI
  isLoading: boolean;
  error: string | null;
}
```

**Status**: 🔲 Not Started
**Estimated Time**: 2-3 hours

---

### **Phase 4: Voting & Approval Logic** (1 week)

#### 4.1 Implement voting calculations
- Weighted voting based on reputation
- Auto-finalize when voting ends
- Dispute vote handling
- Controversy vote triggering

#### 4.2 Implement approval automation
- Update content when proposal approved
- Award reputation & tokens
- Update user tier if applicable
- Send notifications

**Status**: 🔲 Not Started
**Estimated Time**: 4-5 days

---

### **Phase 5: Moderation & Reporting** (3-4 days)

#### 5.1 Report system
- Report proposal as spam/violation
- Admin dashboard
- Action history

#### 5.2 Auto-moderation
- Spam detection
- Content validation
- Suspicious pattern detection

**Status**: 🔲 Not Started
**Estimated Time**: 3-4 days

---

## 🔑 Key Implementation Decisions

### 1. Database Transactions
**Decision**: Use Prisma transactions for critical operations
- Proposal approval (update content + award tokens + update stats)
- Vote submission (ensure unique vote per user)

```typescript
await prisma.$transaction([
  prisma.proposal.update({...}),
  prisma.userProfile.update({...}),
  prisma.tokenTransaction.create({...}),
]);
```

---

### 2. Real-time Updates
**Decision**: Use Next.js Server-Sent Events (SSE) or polling
- Voting page: Poll every 10 seconds for vote count updates
- Proposal list: Poll every 30 seconds for status changes

Alternative: WebSocket (socket.io) - more complex but better UX

---

### 3. Reputation Calculation Timing
**Decision**: Lazy evaluation with caching
- Calculate reputation when user profile is accessed
- Cache for 1 hour
- Recalculate on major events (edit approved, vote cast)

---

### 4. Token Economy
**Decision**: All rewards are non-transferable
- Can only be earned through participation
- Cannot be traded between users
- Cannot be converted to real currency

---

## 📋 Testing Checklist

### Phase 1 Testing
- [ ] Prisma migrations run successfully
- [ ] API routes return correct data structures
- [ ] Database constraints work (unique votes, etc.)
- [ ] Timestamps and dates are correct

### Phase 2 Testing
- [ ] Components render without errors
- [ ] Form submission works
- [ ] Real-time updates display correctly
- [ ] Responsive design works on mobile

### Phase 3 Testing
- [ ] State management works across components
- [ ] Store persists to localStorage
- [ ] Concurrent actions don't cause conflicts

### Phase 4 Testing
- [ ] Voting calculations are accurate
- [ ] Reputation gains/losses are correct
- [ ] Tier calculations work properly
- [ ] Token rewards are distributed correctly

### Phase 5 Testing
- [ ] Reports are created successfully
- [ ] Admin actions work
- [ ] User limits are enforced

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run in production
- [ ] API rate limiting configured
- [ ] Error logging set up
- [ ] Monitoring/alerts configured
- [ ] Backup strategy in place

---

## 📊 Success Metrics

- **Community Engagement**: >30% of users create at least one proposal in first month
- **Proposal Quality**: >70% of proposals approved on first voting
- **Token Distribution**: Average user earns 50+ tokens per month
- **Activity Consistency**: Active users return weekly
- **Reputation Growth**: Users progress through tiers within 3-6 months

---

## 🔄 Maintenance Plan

**Weekly**:
- Monitor proposal creation/voting activity
- Check for spam patterns
- Review user complaints

**Monthly**:
- Update leaderboard
- Review and adjust token rewards
- Analyze tier distribution

**Quarterly**:
- Balance reputation thresholds
- Review achievement difficulty
- Collect user feedback

---

## 📞 Support & Issues

If you encounter issues during implementation:
1. Check the types in `src/types/community.ts`
2. Review config in `src/config/community.config.ts`
3. Use utility functions from `src/lib/community-utils.ts`
4. Refer to COMMUNITY_ROADMAP.md for design details

---

## 🎯 Next Steps

1. **Today**: Review this document and COMMUNITY_ROADMAP.md
2. **Tomorrow**: Start Phase 1 (Prisma schema)
3. **This Week**: Complete Phase 1 and start Phase 2
4. **Next Week**: Frontend components and testing

Good luck! Feel free to ask questions about any part of the implementation. 🚀
