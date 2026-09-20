import { AudienceId, SkinId } from '../core/models';

// Curated per-persona shortlist shown on the "pick your skin" step.
// Falls back to the full SKINS catalog if an audience has no entry.
export const AUDIENCE_SKINS: Record<AudienceId, readonly SkinId[]> = {
  recruiter: ['newspaper', 'coffee', 'ocean', 'midnight'],
  friend: ['coffee', 'nature', 'ocean', 'midnight'],
  developer: ['cyberpunk', 'midnight', 'ocean', 'newspaper'],
  curious: ['newspaper', 'coffee', 'nature', 'cyberpunk', 'ocean', 'midnight'],
  guru: ['newspaper', 'coffee', 'nature', 'cyberpunk', 'ocean', 'midnight'],
};
