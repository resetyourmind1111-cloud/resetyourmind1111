// Card image imports - all 52 Permission Granted card images
// Importing actual files from src/assets/cards/

import card01WalkAway from '@/assets/cards/permission-granted-01-walk-away.png';
import card03CutTies from '@/assets/cards/permission-granted-03-cut-ties.png';
import card04ReleaseToxicFamily from '@/assets/cards/permission-granted-04-release-toxic-family.png';
import card05Quit from '@/assets/cards/permission-granted-05-quit.png';
import card07ForgiveYourself from '@/assets/cards/permission-granted-07-forgive-yourself.png';
import card09ReleaseGuilt from '@/assets/cards/permission-granted-09-release-guilt.png';
import card11DemandCelebration from '@/assets/cards/permission-granted-11-demand-celebration.png';
import card13ChargeWhatYoureWorth from '@/assets/cards/permission-granted-13-charge-what-youre-worth.png';
import card15BeUnavailable from '@/assets/cards/permission-granted-15-be-unavailable.png';
import card17SayNo from '@/assets/cards/permission-granted-17-say-no.png';
import card19Receive from '@/assets/cards/permission-granted-19-receive.png';
import card21BeAngry from '@/assets/cards/permission-granted-21-be-angry.png';
import card23NotBeOkay from '@/assets/cards/permission-granted-23-not-be-okay.png';
import card25FeelJoy from '@/assets/cards/permission-granted-25-feel-joy.png';
import card27GrieveTheFuture from '@/assets/cards/permission-granted-27-grieve-the-future.png';
import card29StartOver from '@/assets/cards/permission-granted-29-start-over.png';
import card31BeAmbitious from '@/assets/cards/permission-granted-31-be-ambitious.png';
import card33BeProud from '@/assets/cards/permission-granted-33-be-proud.png';
import card34BuildAnEmpire from '@/assets/cards/permission-granted-34-build-an-empire.png';
import card35Lead from '@/assets/cards/permission-granted-35-lead.png';
import card37AskForWhatYouNeed from '@/assets/cards/permission-granted-37-ask-for-what-you-need.png';
import card39ExpectMore from '@/assets/cards/permission-granted-39-expect-more.png';
import card41WantPassion from '@/assets/cards/permission-granted-41-want-passion.png';
import card43WantLove from '@/assets/cards/permission-granted-43-want-love.png';
import card45DeepLoveQuestion from '@/assets/cards/permission-granted-45-deep-love-question.png';
import card47GoFirst from '@/assets/cards/permission-granted-47-go-first.png';
import card49YouAreThePermission from '@/assets/cards/permission-granted-49-you-are-the-permission.png';
import card51ChooseYourselfFinal from '@/assets/cards/permission-granted-51-choose-yourself-final.png';
import cardBePowerful from '@/assets/cards/permission-granted-be-powerful.png';
import cardBeSelfish from '@/assets/cards/permission-granted-be-selfish.png';
import cardBuildYourEmpireFirst from '@/assets/cards/permission-granted-build-your-empire-first.png';
import cardChangeYourMind from '@/assets/cards/permission-granted-change-your-mind.png';
import cardChooseYourselfFirst from '@/assets/cards/permission-granted-choose-yourself-first.png';
import cardChooseYourself from '@/assets/cards/permission-granted-choose-yourself.png';
import cardCry from '@/assets/cards/permission-granted-cry.png';
import cardDisappointThem from '@/assets/cards/permission-granted-disappoint-them.png';
import cardFailPublicly from '@/assets/cards/permission-granted-fail-publicly.png';
import cardFeelItAll from '@/assets/cards/permission-granted-feel-it-all.png';
import cardFeelNothing from '@/assets/cards/permission-granted-feel-nothing.png';
import cardGrieve from '@/assets/cards/permission-granted-grieve.png';
import cardLeaveLove from '@/assets/cards/permission-granted-leave-love.png';
import cardOutgrowThem from '@/assets/cards/permission-granted-outgrow-them.png';
import cardOutgrowYourOldDreams from '@/assets/cards/permission-granted-outgrow-your-old-dreams.png';
import cardRequireEffort from '@/assets/cards/permission-granted-require-effort.png';
import cardRest from '@/assets/cards/permission-granted-rest.png';
import cardStopExplaining from '@/assets/cards/permission-granted-stop-explaining.png';
import cardStopWaiting from '@/assets/cards/permission-granted-stop-waiting.png';
import cardTakeUpSpace from '@/assets/cards/permission-granted-take-up-space.png';
import cardThisIsYourPermissionSlip from '@/assets/cards/permission-granted-this-is-your-permission-slip.png';
import cardTrustYourKnowing from '@/assets/cards/permission-granted-trust-your-knowing.png';
import cardWantMore from '@/assets/cards/permission-granted-want-more.png';
import cardYourWorthIsNotNegotiable from '@/assets/cards/permission-granted-your-worth-is-not-negotiable.png';

// Complete mapping: card title (from CSV) → image file
// Card titles normalized to lowercase for lookup
const cardImageMap: Record<string, string> = {
  // Card 1 - WALK AWAY
  'walk away': card01WalkAway,
  // Card 2 - STOP EXPLAINING
  'stop explaining': cardStopExplaining,
  // Card 3 - CUT TIES
  'cut ties': card03CutTies,
  // Card 4 - RELEASE TOXIC FAMILY
  'release toxic family': card04ReleaseToxicFamily,
  // Card 5 - QUIT
  'quit': card05Quit,
  // Card 6 - OUTGROW THEM
  'outgrow them': cardOutgrowThem,
  // Card 7 - GRIEVE
  'grieve': cardGrieve,
  // Card 8 - FORGIVE YOURSELF
  'forgive yourself': card07ForgiveYourself,
  // Card 9 - RELEASE GUILT
  'release guilt': card09ReleaseGuilt,
  // Card 10 - DISAPPOINT THEM
  'disappoint them': cardDisappointThem,
  // Card 11 - DEMAND CELEBRATION
  'demand celebration': card11DemandCelebration,
  // Card 12 - WANT MORE
  'want more': cardWantMore,
  // Card 13 - CHARGE YOUR WORTH
  'charge your worth': card13ChargeWhatYoureWorth,
  // Card 14 - TAKE UP SPACE
  'take up space': cardTakeUpSpace,
  // Card 15 - BE UNAVAILABLE
  'be unavailable': card15BeUnavailable,
  // Card 16 - REST
  'rest': cardRest,
  // Card 17 - SAY NO
  'say no': card17SayNo,
  // Card 18 - CHOOSE YOURSELF
  'choose yourself': cardChooseYourself,
  // Card 19 - RECEIVE
  'receive': card19Receive,
  // Card 20 - CHANGE YOUR MIND
  'change your mind': cardChangeYourMind,
  // Card 21 - BE ANGRY
  'be angry': card21BeAngry,
  // Card 22 - BE SELFISH
  'be selfish': cardBeSelfish,
  // Card 23 - NOT BE OKAY
  'not be okay': card23NotBeOkay,
  // Card 24 - CRY
  'cry': cardCry,
  // Card 25 - FEEL JOY
  'feel joy': card25FeelJoy,
  // Card 26 - FEEL NOTHING
  'feel nothing': cardFeelNothing,
  // Card 27 - GRIEVE THE FUTURE
  'grieve the future': card27GrieveTheFuture,
  // Card 28 - FEEL IT ALL
  'feel it all': cardFeelItAll,
  // Card 29 - START OVER
  'start over': card29StartOver,
  // Card 30 - OUTGROW OLD DREAMS
  'outgrow old dreams': cardOutgrowYourOldDreams,
  // Card 31 - BE AMBITIOUS
  'be ambitious': card31BeAmbitious,
  // Card 32 - FAIL PUBLICLY
  'fail publicly': cardFailPublicly,
  // Card 33 - BE PROUD
  'be proud': card33BeProud,
  // Card 34 - BE POWERFUL
  'be powerful': cardBePowerful,
  // Card 35 - LEAD
  'lead': card35Lead,
  // Card 36 - BUILD AN EMPIRE
  'build an empire': card34BuildAnEmpire,
  // Card 37 - ASK FOR WHAT YOU NEED
  'ask for what you need': card37AskForWhatYouNeed,
  // Card 38 - REQUIRE EFFORT
  'require effort': cardRequireEffort,
  // Card 39 - EXPECT MORE
  'expect more': card39ExpectMore,
  // Card 40 - CHOOSE YOURSELF FIRST
  'choose yourself first': cardChooseYourselfFirst,
  // Card 41 - WANT PASSION
  'want passion': card41WantPassion,
  // Card 42 - LEAVE LOVE
  'leave love': cardLeaveLove,
  // Card 43 - WANT LOVE
  'want love': card43WantLove,
  // Card 44 - BUILD YOUR EMPIRE FIRST
  'build your empire first': cardBuildYourEmpireFirst,
  // Card 45 - THE DEEP LOVE QUESTION
  'the deep love question': card45DeepLoveQuestion,
  // Card 46 - TRUST YOUR KNOWING
  'trust your knowing': cardTrustYourKnowing,
  // Card 47 - GO FIRST
  'go first': card47GoFirst,
  // Card 48 - YOUR WORTH IS NOT NEGOTIABLE
  'your worth is not negotiable': cardYourWorthIsNotNegotiable,
  // Card 49 - YOU ARE THE PERMISSION
  'you are the permission': card49YouAreThePermission,
  // Card 50 - STOP WAITING
  'stop waiting': cardStopWaiting,
  // Card 51 - CHOOSE YOURSELF (final)
  'choose yourself final': card51ChooseYourselfFinal,
  // Card 52 - THIS IS YOUR PERMISSION SLIP
  'this is your permission slip': cardThisIsYourPermissionSlip,
};

export const getCardImage = (title: string): string | null => {
  const normalizedTitle = title.toLowerCase().trim();
  return cardImageMap[normalizedTitle] || null;
};

// Ordered array of all images by card number (1-52)
const orderedCardImages: string[] = [
  card01WalkAway,              // 1
  cardStopExplaining,          // 2
  card03CutTies,               // 3
  card04ReleaseToxicFamily,    // 4
  card05Quit,                  // 5
  cardOutgrowThem,             // 6
  cardGrieve,                  // 7
  card07ForgiveYourself,       // 8
  card09ReleaseGuilt,          // 9
  cardDisappointThem,          // 10
  card11DemandCelebration,     // 11
  cardWantMore,                // 12
  card13ChargeWhatYoureWorth,  // 13
  cardTakeUpSpace,             // 14
  card15BeUnavailable,         // 15
  cardRest,                    // 16
  card17SayNo,                 // 17
  cardChooseYourself,          // 18
  card19Receive,               // 19
  cardChangeYourMind,          // 20
  card21BeAngry,               // 21
  cardBeSelfish,               // 22
  card23NotBeOkay,             // 23
  cardCry,                     // 24
  card25FeelJoy,               // 25
  cardFeelNothing,             // 26
  card27GrieveTheFuture,       // 27
  cardFeelItAll,               // 28
  card29StartOver,             // 29
  cardOutgrowYourOldDreams,    // 30
  card31BeAmbitious,           // 31
  cardFailPublicly,            // 32
  card33BeProud,               // 33
  cardBePowerful,              // 34
  card35Lead,                  // 35
  card34BuildAnEmpire,         // 36
  card37AskForWhatYouNeed,     // 37
  cardRequireEffort,           // 38
  card39ExpectMore,            // 39
  cardChooseYourselfFirst,     // 40
  card41WantPassion,           // 41
  cardLeaveLove,               // 42
  card43WantLove,              // 43
  cardBuildYourEmpireFirst,    // 44
  card45DeepLoveQuestion,      // 45
  cardTrustYourKnowing,        // 46
  card47GoFirst,               // 47
  cardYourWorthIsNotNegotiable,// 48
  card49YouAreThePermission,   // 49
  cardStopWaiting,             // 50
  card51ChooseYourselfFinal,   // 51
  cardThisIsYourPermissionSlip,// 52
];

export const getCardImageForNumber = (cardNumber: number): string | null => {
  if (!Number.isFinite(cardNumber) || cardNumber < 1 || cardNumber > 52) return null;
  return orderedCardImages[cardNumber - 1] ?? null;
};

export default cardImageMap;
