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

// Map card titles (lowercase, normalized) to their images
const cardImageMap: Record<string, string> = {
  // Cards with numbers in filename
  'walk away': walkAway,
  'cut ties': cutTies,
  'release toxic family': releaseToxicFamily,
  'quit': quit,
  'forgive yourself': forgiveYourself,
  'release guilt': releaseGuilt,
  'demand celebration': demandCelebration,
  'charge what you\'re worth': chargeWhatYoureWorth,
  'be unavailable': beUnavailable,
  'say no': sayNo,
  'receive': receive,
  'be angry': beAngry,
  'feel your anger': beAngry,
  'not be okay': notBeOkay,
  'it\'s okay to not be okay': notBeOkay,
  'feel joy': feelJoy,
  'feel your pleasure': feelJoy,
  'grieve the future': grieveTheFuture,
  'start over': startOver,
  
  // Cards without numbers in filename
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

export default cardImageMap;
