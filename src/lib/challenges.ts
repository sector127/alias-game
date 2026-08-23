export interface PartyChallenge {
  id: string;
  title: string;
  instruction: string;
  emoji: string;
  category: 'emotion' | 'voice' | 'physical' | 'taboo';
  categoryName: string;
  badgeColor: string;
}

export const PARTY_CHALLENGES: PartyChallenge[] = [
  // 1. ემოციები და როლები (Emotions & Character Roles)
  {
    id: 'angry',
    title: 'გაბრაზებული',
    instruction: 'ახსენი სიტყვები ისე, თითქოს ძალიან გაბრაზებული ხარ და ყველაზე ჩხუბობ!',
    emoji: '😡',
    category: 'emotion',
    categoryName: 'ემოცია',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  {
    id: 'millionaire',
    title: 'მილიონერი',
    instruction: 'ახსენი ისე, თითქოს ლატარიაში 1,000,000 ლარი მოიგე და ეიფორიაში ხარ!',
    emoji: '🤑',
    category: 'emotion',
    categoryName: 'ემოცია',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'crying',
    title: 'ტირილი',
    instruction: 'ახსენი სიტყვები ისე, თითქოს ტირი, სლუკუნებ და გული გისკდება!',
    emoji: '😭',
    category: 'emotion',
    categoryName: 'ემოცია',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'freezing',
    title: 'ყინვა',
    instruction: 'ახსენი ისე, თითქოს ძალიან გცივა, კანკალებ და კბილი კბილზე გაყრის!',
    emoji: '🥶',
    category: 'emotion',
    categoryName: 'ემოცია',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    id: 'sleepy',
    title: 'მთქნარება',
    instruction: 'ახსენი ისე, თითქოს გეძინება და ყოველ რამდენიმე წამში მთქნარებ!',
    emoji: '🥱',
    category: 'emotion',
    categoryName: 'ემოცია',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'secret_agent',
    title: 'საიდუმლო აგენტი',
    instruction: 'ახსენი როგორც სპეცაგენტი — მხოლოდ ჩურჩულით და საიდუმლო ტონით!',
    emoji: '🕵️',
    category: 'emotion',
    categoryName: 'როლი',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    id: 'scared',
    title: 'პანიკა',
    instruction: 'ახსენი ისე, თითქოს საშინელებათა ფილმში ხარ და რაღაცის ძალიან გეშინია!',
    emoji: '😱',
    category: 'emotion',
    categoryName: 'ემოცია',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  {
    id: 'king',
    title: 'მეფური ტონი',
    instruction: 'ახსენი როგორც დიდებული მეფე ან დედოფალი (ამაყი და ბრძანებლური ტონით)!',
    emoji: '👑',
    category: 'emotion',
    categoryName: 'როლი',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  },

  // 2. ხმა და მეტყველება (Voice & Speech)
  {
    id: 'robot',
    title: 'რობოტი',
    instruction: 'ახსენი სიტყვები რობოტის მონოტონური, მეტალისებრი ხმით!',
    emoji: '🤖',
    category: 'voice',
    categoryName: 'ხმა',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  },
  {
    id: 'opera',
    title: 'ოპერის მომღერალი',
    instruction: 'ახსენი სიტყვები როგორც ოპერის მომღერალი — მხოლოდ სიმღერით!',
    emoji: '🎶',
    category: 'voice',
    categoryName: 'ხმა',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  {
    id: 'commentator',
    title: 'კომენტატორი',
    instruction: 'ახსენი სიტყვები როგორც ფეხბურთის მატჩის ემოციური კომენტატორი!',
    emoji: '🎙️',
    category: 'voice',
    categoryName: 'ხმა',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  {
    id: 'toddler',
    title: 'პატარა ბავშვი',
    instruction: 'ახსენი სიტყვები როგორც 3 წლის ბავშვი (ენის მოჩლექით)!',
    emoji: '👶',
    category: 'voice',
    categoryName: 'ხმა',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  {
    id: 'short_sentences',
    title: '3 სიტყვიანი ლიმიტი',
    instruction: 'თითოეული სიტყვა ახსენი მაქსიმუმ 3-სიტყვიანი მოკლე წინადადებებით!',
    emoji: '⚡',
    category: 'voice',
    categoryName: 'წესი',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  },

  // 3. ფიზიკური მოძრაობები (Physical Constraints)
  {
    id: 'one_leg',
    title: 'ცალ ფეხზე დგომა',
    instruction: 'მთელი რაუნდის განმავლობაში იდექი მხოლოდ ცალ ფეხზე!',
    emoji: '🦩',
    category: 'physical',
    categoryName: 'მოძრაობა',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
  {
    id: 'statue',
    title: 'ქანდაკება',
    instruction: 'ახსენი სრულიად უძრავად (ხელების, თავისა და სხეულის გაუნძრევლად)!',
    emoji: '🗿',
    category: 'physical',
    categoryName: 'მოძრაობა',
    badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
  },
  {
    id: 'squat',
    title: 'ჩაჯდომები',
    instruction: 'ყოველ გამოცნობილ სიტყვაზე გააკეთე 1 ჩაჯდომა!',
    emoji: '🏋️',
    category: 'physical',
    categoryName: 'მოძრაობა',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'closed_eyes',
    title: 'დახუჭული თვალები',
    instruction: 'ახსენი სიტყვები მთელი რაუნდი დახუჭული თვალებით!',
    emoji: '🙈',
    category: 'physical',
    categoryName: 'მოძრაობა',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  {
    id: 'dancing',
    title: 'ცეკვა',
    instruction: 'ახსნის დროს განუწყვეტლივ იცეკვე ნებისმიერი ცეკვა!',
    emoji: '🕺',
    category: 'physical',
    categoryName: 'მოძრაობა',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
  },
  {
    id: 'boxer',
    title: 'მოკრივე',
    instruction: 'ახსენი სიტყვები ისე, თითქოს კრივის რინგზე იბრძვი (მუშტების ქნევით)!',
    emoji: '🥊',
    category: 'physical',
    categoryName: 'მოძრაობა',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
  },

  // 4. აკრძალული ასოები და წესები (Taboo Constraints)
  {
    id: 'no_letter_a',
    title: 'ასო „ა“-ს გარეშე',
    instruction: 'არ გამოიყენო ასო „ა“-ს შემცველი სიტყვები ახსნისას!',
    emoji: '🚫',
    category: 'taboo',
    categoryName: 'ტაბუ',
    badgeColor: 'bg-rose-600/20 text-rose-300 border-rose-500/50',
  },
  {
    id: 'no_letter_r',
    title: 'ასო „რ“-ს გარეშე',
    instruction: 'არ გამოიყენო ასო „რ“-ს შემცველი სიტყვები ახსნისას!',
    emoji: '🚫',
    category: 'taboo',
    categoryName: 'ტაბუ',
    badgeColor: 'bg-rose-600/20 text-rose-300 border-rose-500/50',
  },
  {
    id: 'no_connectors',
    title: 'კავშირების გარეშე',
    instruction: 'აკრძალულია სიტყვების „არის“, „რომ“, „როგორც“ ან „როგორ“ გამოყენება!',
    emoji: '🤐',
    category: 'taboo',
    categoryName: 'ტაბუ',
    badgeColor: 'bg-amber-600/20 text-amber-300 border-amber-500/50',
  },
];

// Helper: Get random challenge ensuring no consecutive repeat
let lastChallengeIndex = -1;

export const getRandomChallenge = (): PartyChallenge => {
  let nextIndex = Math.floor(Math.random() * PARTY_CHALLENGES.length);
  if (nextIndex === lastChallengeIndex && PARTY_CHALLENGES.length > 1) {
    nextIndex = (nextIndex + 1) % PARTY_CHALLENGES.length;
  }
  lastChallengeIndex = nextIndex;
  return PARTY_CHALLENGES[nextIndex];
};
