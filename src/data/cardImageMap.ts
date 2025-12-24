// Card image imports - mapping card titles to actual images
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
import beSelfish from '@/assets/cards/permission-granted-be-selfish.png';
import changeYourMind from '@/assets/cards/permission-granted-change-your-mind.png';
import chooseYourself from '@/assets/cards/permission-granted-choose-yourself.png';
import cry from '@/assets/cards/permission-granted-cry.png';
import disappointThem from '@/assets/cards/permission-granted-disappoint-them.png';
import feelItAll from '@/assets/cards/permission-granted-feel-it-all.png';
import feelNothing from '@/assets/cards/permission-granted-feel-nothing.png';
import grieve from '@/assets/cards/permission-granted-grieve.png';
import outgrowThem from '@/assets/cards/permission-granted-outgrow-them.png';
import outgrowYourOldDreams from '@/assets/cards/permission-granted-outgrow-your-old-dreams.png';
import rest from '@/assets/cards/permission-granted-rest.png';
import stopExplaining from '@/assets/cards/permission-granted-stop-explaining.png';
import takeUpSpace from '@/assets/cards/permission-granted-take-up-space.png';
import wantMore from '@/assets/cards/permission-granted-want-more.png';

// New batch of images
import beProud from '@/assets/cards/permission-granted-33-be-proud.png';
import buildAnEmpire from '@/assets/cards/permission-granted-34-build-an-empire.png';
import beAmbitious from '@/assets/cards/permission-granted-31-be-ambitious.png';
import expectMore from '@/assets/cards/permission-granted-39-expect-more.png';
import bePowerful from '@/assets/cards/permission-granted-be-powerful.png';
import askForWhatYouNeed from '@/assets/cards/permission-granted-37-ask-for-what-you-need.png';
import failPublicly from '@/assets/cards/permission-granted-fail-publicly.png';
import chooseYourselfFirst from '@/assets/cards/permission-granted-choose-yourself-first.png';
import lead from '@/assets/cards/permission-granted-35-lead.png';
import requireEffort from '@/assets/cards/permission-granted-require-effort.png';
import trustYourKnowing from '@/assets/cards/permission-granted-trust-your-knowing.png';
import wantPassion from '@/assets/cards/permission-granted-41-want-passion.png';
import youAreThePermission from '@/assets/cards/permission-granted-49-you-are-the-permission.png';
import buildYourEmpireFirst from '@/assets/cards/permission-granted-build-your-empire-first.png';
import goFirst from '@/assets/cards/permission-granted-47-go-first.png';
import leaveLove from '@/assets/cards/permission-granted-leave-love.png';
import stopWaiting from '@/assets/cards/permission-granted-stop-waiting.png';
import deepLoveQuestion from '@/assets/cards/permission-granted-45-deep-love-question.png';
import yourWorthIsNotNegotiable from '@/assets/cards/permission-granted-your-worth-is-not-negotiable.png';
import wantLove from '@/assets/cards/permission-granted-43-want-love.png';
import chooseYourselfFinal from '@/assets/cards/permission-granted-51-choose-yourself-final.png';
import thisIsYourPermissionSlip from '@/assets/cards/permission-granted-this-is-your-permission-slip.png';

// Map card titles (lowercase, normalized) to their images
const cardImageMap: Record<string, string> = {
  // Cards with numbers in filename (original batch)
  'walk away': walkAway,
  'cut ties': cutTies,
  'release toxic family': releaseToxicFamily,
  'quit': quit,
  'forgive yourself': forgiveYourself,
  'release guilt': releaseGuilt,
  'demand celebration': demandCelebration,
  "charge what you're worth": chargeWhatYoureWorth,
  'be unavailable': beUnavailable,
  'say no': sayNo,
  'receive': receive,
  'be angry': beAngry,
  'feel your anger': beAngry,
  'not be okay': notBeOkay,
  "it's okay to not be okay": notBeOkay,
  'feel joy': feelJoy,
  'feel your pleasure': feelJoy,
  'grieve the future': grieveTheFuture,
  'start over': startOver,
  
  // Cards without numbers in filename (original batch)
  'be selfish': beSelfish,
  'change your mind': changeYourMind,
  'choose yourself': chooseYourself,
  'cry': cry,
  'feel your sadness': cry,
  'disappoint them': disappointThem,
  'feel it all': feelItAll,
  'feel your feelings': feelItAll,
  'feel nothing': feelNothing,
  'grieve': grieve,
  'feel your grief': grieve,
  'outgrow them': outgrowThem,
  'outgrow your old dreams': outgrowYourOldDreams,
  'rest': rest,
  'claim your rest': rest,
  'stop explaining': stopExplaining,
  'take up space': takeUpSpace,
  'claim your space': takeUpSpace,
  'want more': wantMore,
  'claim your desires': wantMore,
  
  // New batch of images
  'be proud': beProud,
  'build an empire': buildAnEmpire,
  'be ambitious': beAmbitious,
  'expect more': expectMore,
  'be powerful': bePowerful,
  'claim your power': bePowerful,
  'ask for what you need': askForWhatYouNeed,
  'fail publicly': failPublicly,
  'choose yourself first': chooseYourselfFirst,
  'lead': lead,
  'require effort': requireEffort,
  'trust your knowing': trustYourKnowing,
  'want passion': wantPassion,
  'you are the permission': youAreThePermission,
  'build your empire first': buildYourEmpireFirst,
  'go first': goFirst,
  'leave love': leaveLove,
  'stop waiting': stopWaiting,
  'the deep love question': deepLoveQuestion,
  'your worth is not negotiable': yourWorthIsNotNegotiable,
  'claim your worth': yourWorthIsNotNegotiable,
  'want love': wantLove,
  'feel your love': wantLove,
  'choose yourself final': chooseYourselfFinal,
  'this is your permission slip': thisIsYourPermissionSlip,
  'permission slip': thisIsYourPermissionSlip,
};

export const getCardImage = (title: string): string | null => {
  const normalizedTitle = title.toLowerCase().trim();

  // Direct match
  if (cardImageMap[normalizedTitle]) {
    return cardImageMap[normalizedTitle];
  }

  // Partial match - check if any key is contained in the title or vice versa
  for (const [key, image] of Object.entries(cardImageMap)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      return image;
    }
  }

  return null;
};

// Deterministic fallback: ensures every card can show *some* image even if the title
// doesn't match our current mapping keys (keeps the Oracle experience visual).
const allCardImages = Object.values(cardImageMap);

export const getCardImageForNumber = (cardNumber: number): string | null => {
  if (!Number.isFinite(cardNumber) || allCardImages.length === 0) return null;

  const idx = (Math.trunc(cardNumber) - 1) % allCardImages.length;
  const normalizedIdx = (idx + allCardImages.length) % allCardImages.length;

  return allCardImages[normalizedIdx] ?? null;
};

export default cardImageMap;

