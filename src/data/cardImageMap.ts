// Card image imports - all 52 Permission Granted card images
import walkAway from '@/assets/cards/permission-granted-01-walk-away.png';
import cutTies from '@/assets/cards/permission-granted-03-cut-ties.png';
import releaseToxicFamily from '@/assets/cards/permission-granted-04-release-toxic-family.png';
import quit from '@/assets/cards/permission-granted-05-quit.png';
import forgiveYourself from '@/assets/cards/permission-granted-07-forgive-yourself.png';
import releaseGuilt from '@/assets/cards/permission-granted-09-release-guilt.png';
import demandCelebration from '@/assets/cards/permission-granted-11-demand-celebration.png';
import chargeWhatYoureWorth from '@/assets/cards/permission-granted-13-charge-what-youre-worth.png';
import beUnavailable from '@/assets/cards/permission-granted-15-be-unavailable.png';
import sayNo from '@/assets/cards/permission-granted-17-say-no.png';
import receive from '@/assets/cards/permission-granted-19-receive.png';
import beAngry from '@/assets/cards/permission-granted-21-be-angry.png';
import notBeOkay from '@/assets/cards/permission-granted-23-not-be-okay.png';
import feelJoy from '@/assets/cards/permission-granted-25-feel-joy.png';
import grieveTheFuture from '@/assets/cards/permission-granted-27-grieve-the-future.png';
import startOver from '@/assets/cards/permission-granted-29-start-over.png';
import beAmbitious from '@/assets/cards/permission-granted-31-be-ambitious.png';
import beProud from '@/assets/cards/permission-granted-33-be-proud.png';
import buildAnEmpire from '@/assets/cards/permission-granted-34-build-an-empire.png';
import lead from '@/assets/cards/permission-granted-35-lead.png';
import askForWhatYouNeed from '@/assets/cards/permission-granted-37-ask-for-what-you-need.png';
import expectMore from '@/assets/cards/permission-granted-39-expect-more.png';
import wantPassion from '@/assets/cards/permission-granted-41-want-passion.png';
import wantLove from '@/assets/cards/permission-granted-43-want-love.png';
import deepLoveQuestion from '@/assets/cards/permission-granted-45-deep-love-question.png';
import goFirst from '@/assets/cards/permission-granted-47-go-first.png';
import youAreThePermission from '@/assets/cards/permission-granted-49-you-are-the-permission.png';
import chooseYourselfFinal from '@/assets/cards/permission-granted-51-choose-yourself-final.png';
import bePowerful from '@/assets/cards/permission-granted-be-powerful.png';
import beSelfish from '@/assets/cards/permission-granted-be-selfish.png';
import buildYourEmpireFirst from '@/assets/cards/permission-granted-build-your-empire-first.png';
import changeYourMind from '@/assets/cards/permission-granted-change-your-mind.png';
import chooseYourselfFirst from '@/assets/cards/permission-granted-choose-yourself-first.png';
import chooseYourself from '@/assets/cards/permission-granted-choose-yourself.png';
import cry from '@/assets/cards/permission-granted-cry.png';
import disappointThem from '@/assets/cards/permission-granted-disappoint-them.png';
import failPublicly from '@/assets/cards/permission-granted-fail-publicly.png';
import feelItAll from '@/assets/cards/permission-granted-feel-it-all.png';
import feelNothing from '@/assets/cards/permission-granted-feel-nothing.png';
import grieve from '@/assets/cards/permission-granted-grieve.png';
import leaveLove from '@/assets/cards/permission-granted-leave-love.png';
import outgrowThem from '@/assets/cards/permission-granted-outgrow-them.png';
import outgrowYourOldDreams from '@/assets/cards/permission-granted-outgrow-your-old-dreams.png';
import requireEffort from '@/assets/cards/permission-granted-require-effort.png';
import rest from '@/assets/cards/permission-granted-rest.png';
import stopExplaining from '@/assets/cards/permission-granted-stop-explaining.png';
import stopWaiting from '@/assets/cards/permission-granted-stop-waiting.png';
import takeUpSpace from '@/assets/cards/permission-granted-take-up-space.png';
import thisIsYourPermissionSlip from '@/assets/cards/permission-granted-this-is-your-permission-slip.png';
import trustYourKnowing from '@/assets/cards/permission-granted-trust-your-knowing.png';
import wantMore from '@/assets/cards/permission-granted-want-more.png';
import yourWorthIsNotNegotiable from '@/assets/cards/permission-granted-your-worth-is-not-negotiable.png';

// Complete 1:1 mapping: 52 card titles → 52 images (by card number)
const cardImageMap: Record<string, string> = {
  // Card 1 - Release Perfection
  'release perfection': walkAway,
  // Card 2 - Release Control
  'release control': cutTies,
  // Card 3 - Release Guilt
  'release guilt': releaseGuilt,
  // Card 4 - Release Comparison
  'release comparison': releaseToxicFamily,
  // Card 5 - Release Fear
  'release fear': quit,
  // Card 6 - Release Old Stories
  'release old stories': forgiveYourself,
  // Card 7 - Release Expectations
  'release expectations': changeYourMind,
  // Card 8 - Release Resentment
  'release resentment': disappointThem,
  // Card 9 - Release Rushing
  'release rushing': stopWaiting,
  // Card 10 - Release Scarcity
  'release scarcity': wantMore,
  
  // Card 11 - Claim Your Power
  'claim your power': bePowerful,
  // Card 12 - Claim Your Dreams
  'claim your dreams': beAmbitious,
  // Card 13 - Claim Your Voice
  'claim your voice': stopExplaining,
  // Card 14 - Claim Your Worth
  'claim your worth': yourWorthIsNotNegotiable,
  // Card 15 - Claim Your Space
  'claim your space': takeUpSpace,
  // Card 16 - Claim Your Time
  'claim your time': beUnavailable,
  // Card 17 - Claim Your Joy
  'claim your joy': feelJoy,
  // Card 18 - Claim Your Desires
  'claim your desires': wantPassion,
  // Card 19 - Claim Your Rest
  'claim your rest': rest,
  // Card 20 - Claim Your Magic
  'claim your magic': demandCelebration,
  
  // Card 21 - Feel Your Feelings
  'feel your feelings': feelItAll,
  // Card 22 - Feel Your Grief
  'feel your grief': grieve,
  // Card 23 - Feel Your Anger
  'feel your anger': beAngry,
  // Card 24 - Feel Your Sadness
  'feel your sadness': cry,
  // Card 25 - Feel Your Pleasure
  'feel your pleasure': receive,
  // Card 26 - Feel Your Excitement
  'feel your excitement': goFirst,
  // Card 27 - Feel Your Love
  'feel your love': wantLove,
  // Card 28 - Feel Your Peace
  'feel your peace': feelNothing,
  
  // Card 29 - Rise After Falling
  'rise after falling': startOver,
  // Card 30 - Rise Into Leadership
  'rise into leadership': lead,
  // Card 31 - Rise Above Drama
  'rise above drama': outgrowThem,
  // Card 32 - Rise Into Visibility
  'rise into visibility': beProud,
  // Card 33 - Rise Into Wealth
  'rise into wealth': chargeWhatYoureWorth,
  // Card 34 - Rise Into Mastery
  'rise into mastery': buildAnEmpire,
  // Card 35 - Rise Into Service
  'rise into service': askForWhatYouNeed,
  // Card 36 - Rise Into Evolution
  'rise into evolution': outgrowYourOldDreams,
  
  // Card 37 - Love Yourself First
  'love yourself first': chooseYourselfFirst,
  // Card 38 - Love Without Conditions
  'love without conditions': leaveLove,
  // Card 39 - Love Your Body
  'love your body': beSelfish,
  // Card 40 - Love Your Journey
  'love your journey': grieveTheFuture,
  // Card 41 - Love Beyond Fear
  'love beyond fear': failPublicly,
  // Card 42 - Love Your Shadow
  'love your shadow': notBeOkay,
  // Card 43 - Love This Moment
  'love this moment': sayNo,
  // Card 44 - Love Fiercely
  'love fiercely': deepLoveQuestion,
  
  // Card 45 - Integrate Your Wisdom
  'integrate your wisdom': trustYourKnowing,
  // Card 46 - Integrate Your Past
  'integrate your past': expectMore,
  // Card 47 - Integrate Mind & Heart
  'integrate mind & heart': requireEffort,
  // Card 48 - Integrate Spiritual & Physical
  'integrate spiritual & physical': buildYourEmpireFirst,
  // Card 49 - Integrate Giving & Receiving
  'integrate giving & receiving': youAreThePermission,
  // Card 50 - Integrate Action & Rest
  'integrate action & rest': chooseYourself,
  // Card 51 - Integrate Individuality & Community
  'integrate individuality & community': chooseYourselfFinal,
  // Card 52 - Integrate All That You Are
  'integrate all that you are': thisIsYourPermissionSlip,
};

export const getCardImage = (title: string): string | null => {
  const normalizedTitle = title.toLowerCase().trim();
  return cardImageMap[normalizedTitle] || null;
};

// All card images array for fallback by card number
const allCardImages = Object.values(cardImageMap);

export const getCardImageForNumber = (cardNumber: number): string | null => {
  if (!Number.isFinite(cardNumber) || allCardImages.length === 0) return null;
  const idx = (Math.trunc(cardNumber) - 1) % allCardImages.length;
  const normalizedIdx = (idx + allCardImages.length) % allCardImages.length;
  return allCardImages[normalizedIdx] ?? null;
};

export default cardImageMap;
