import { Match, MatchStatus } from '@/types/match';
import { SportType } from '@/types/sport';

export const mockMatches: Match[] = [
  // Football matches
  {
    id: 'f1',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't1',
      name: 'Manchester United',
      country: 'England',
    },
    awayTeam: {
      id: 't2',
      name: 'Liverpool',
      country: 'England',
    },
    dateTime: new Date('2025-10-05T15:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l1',
      name: 'Premier League',
      country: 'England',
    },
    venue: 'Old Trafford',
  },
  {
    id: 'f2',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't3',
      name: 'Real Madrid',
      country: 'Spain',
    },
    awayTeam: {
      id: 't4',
      name: 'Barcelona',
      country: 'Spain',
    },
    dateTime: new Date('2025-10-06T20:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l2',
      name: 'La Liga',
      country: 'Spain',
    },
    venue: 'Santiago Bernabéu',
  },
  {
    id: 'f3',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't5',
      name: 'Bayern Munich',
      country: 'Germany',
    },
    awayTeam: {
      id: 't6',
      name: 'Borussia Dortmund',
      country: 'Germany',
    },
    dateTime: new Date('2025-10-07T17:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l3',
      name: 'Bundesliga',
      country: 'Germany',
    },
    venue: 'Allianz Arena',
  },
  {
    id: 'f4',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't7',
      name: 'Paris Saint-Germain',
      country: 'France',
    },
    awayTeam: {
      id: 't8',
      name: 'Marseille',
      country: 'France',
    },
    dateTime: new Date('2025-10-08T21:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l4',
      name: 'Ligue 1',
      country: 'France',
    },
    venue: 'Parc des Princes',
  },
  {
    id: 'f5',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't9',
      name: 'Juventus',
      country: 'Italy',
    },
    awayTeam: {
      id: 't10',
      name: 'AC Milan',
      country: 'Italy',
    },
    dateTime: new Date('2025-10-09T19:45:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l5',
      name: 'Serie A',
      country: 'Italy',
    },
    venue: 'Allianz Stadium',
  },
  {
    id: 'f6',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't11',
      name: 'Chelsea',
      country: 'England',
    },
    awayTeam: {
      id: 't12',
      name: 'Arsenal',
      country: 'England',
    },
    dateTime: new Date('2025-10-10T16:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l1',
      name: 'Premier League',
      country: 'England',
    },
    venue: 'Stamford Bridge',
  },
  {
    id: 'f7',
    sport: SportType.FOOTBALL,
    homeTeam: {
      id: 't13',
      name: 'Atletico Madrid',
      country: 'Spain',
    },
    awayTeam: {
      id: 't14',
      name: 'Sevilla',
      country: 'Spain',
    },
    dateTime: new Date('2025-10-11T18:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l2',
      name: 'La Liga',
      country: 'Spain',
    },
    venue: 'Wanda Metropolitano',
  },

  // Basketball matches
  {
    id: 'b1',
    sport: SportType.BASKETBALL,
    homeTeam: {
      id: 't15',
      name: 'Los Angeles Lakers',
      country: 'USA',
    },
    awayTeam: {
      id: 't16',
      name: 'Boston Celtics',
      country: 'USA',
    },
    dateTime: new Date('2025-10-05T19:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l6',
      name: 'NBA',
      country: 'USA',
    },
    venue: 'Crypto.com Arena',
  },
  {
    id: 'b2',
    sport: SportType.BASKETBALL,
    homeTeam: {
      id: 't17',
      name: 'Golden State Warriors',
      country: 'USA',
    },
    awayTeam: {
      id: 't18',
      name: 'Brooklyn Nets',
      country: 'USA',
    },
    dateTime: new Date('2025-10-06T22:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l6',
      name: 'NBA',
      country: 'USA',
    },
    venue: 'Chase Center',
  },
  {
    id: 'b3',
    sport: SportType.BASKETBALL,
    homeTeam: {
      id: 't19',
      name: 'Milwaukee Bucks',
      country: 'USA',
    },
    awayTeam: {
      id: 't20',
      name: 'Miami Heat',
      country: 'USA',
    },
    dateTime: new Date('2025-10-07T20:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l6',
      name: 'NBA',
      country: 'USA',
    },
    venue: 'Fiserv Forum',
  },
  {
    id: 'b4',
    sport: SportType.BASKETBALL,
    homeTeam: {
      id: 't21',
      name: 'Real Madrid',
      country: 'Spain',
    },
    awayTeam: {
      id: 't22',
      name: 'Barcelona',
      country: 'Spain',
    },
    dateTime: new Date('2025-10-08T20:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l7',
      name: 'EuroLeague',
      country: 'Europe',
    },
    venue: 'WiZink Center',
  },
  {
    id: 'b5',
    sport: SportType.BASKETBALL,
    homeTeam: {
      id: 't23',
      name: 'Phoenix Suns',
      country: 'USA',
    },
    awayTeam: {
      id: 't24',
      name: 'Dallas Mavericks',
      country: 'USA',
    },
    dateTime: new Date('2025-10-09T21:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l6',
      name: 'NBA',
      country: 'USA',
    },
    venue: 'Footprint Center',
  },
  {
    id: 'b6',
    sport: SportType.BASKETBALL,
    homeTeam: {
      id: 't25',
      name: 'Chicago Bulls',
      country: 'USA',
    },
    awayTeam: {
      id: 't26',
      name: 'Philadelphia 76ers',
      country: 'USA',
    },
    dateTime: new Date('2025-10-10T19:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l6',
      name: 'NBA',
      country: 'USA',
    },
    venue: 'United Center',
  },

  // Tennis matches
  {
    id: 't1',
    sport: SportType.TENNIS,
    homeTeam: {
      id: 'p1',
      name: 'Novak Djokovic',
      country: 'Serbia',
    },
    awayTeam: {
      id: 'p2',
      name: 'Carlos Alcaraz',
      country: 'Spain',
    },
    dateTime: new Date('2025-10-05T14:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l8',
      name: 'ATP Tour',
      country: 'International',
    },
    venue: 'Centre Court',
  },
  {
    id: 't2',
    sport: SportType.TENNIS,
    homeTeam: {
      id: 'p3',
      name: 'Iga Swiatek',
      country: 'Poland',
    },
    awayTeam: {
      id: 'p4',
      name: 'Aryna Sabalenka',
      country: 'Belarus',
    },
    dateTime: new Date('2025-10-06T16:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l9',
      name: 'WTA Tour',
      country: 'International',
    },
    venue: 'Court Philippe-Chatrier',
  },
  {
    id: 't3',
    sport: SportType.TENNIS,
    homeTeam: {
      id: 'p5',
      name: 'Daniil Medvedev',
      country: 'Russia',
    },
    awayTeam: {
      id: 'p6',
      name: 'Jannik Sinner',
      country: 'Italy',
    },
    dateTime: new Date('2025-10-07T13:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l8',
      name: 'ATP Tour',
      country: 'International',
    },
    venue: 'Arthur Ashe Stadium',
  },
  {
    id: 't4',
    sport: SportType.TENNIS,
    homeTeam: {
      id: 'p7',
      name: 'Coco Gauff',
      country: 'USA',
    },
    awayTeam: {
      id: 'p8',
      name: 'Elena Rybakina',
      country: 'Kazakhstan',
    },
    dateTime: new Date('2025-10-08T15:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l9',
      name: 'WTA Tour',
      country: 'International',
    },
    venue: 'Rod Laver Arena',
  },
  {
    id: 't5',
    sport: SportType.TENNIS,
    homeTeam: {
      id: 'p9',
      name: 'Rafael Nadal',
      country: 'Spain',
    },
    awayTeam: {
      id: 'p10',
      name: 'Stefanos Tsitsipas',
      country: 'Greece',
    },
    dateTime: new Date('2025-10-09T12:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l8',
      name: 'ATP Tour',
      country: 'International',
    },
    venue: 'Court Suzanne-Lenglen',
  },
  {
    id: 't6',
    sport: SportType.TENNIS,
    homeTeam: {
      id: 'p11',
      name: 'Jessica Pegula',
      country: 'USA',
    },
    awayTeam: {
      id: 'p12',
      name: 'Ons Jabeur',
      country: 'Tunisia',
    },
    dateTime: new Date('2025-10-10T14:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l9',
      name: 'WTA Tour',
      country: 'International',
    },
    venue: 'Centre Court',
  },

  // Ice Hockey matches
  {
    id: 'h1',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h1',
      name: 'Toronto Maple Leafs',
      country: 'Canada',
    },
    awayTeam: {
      id: 'h2',
      name: 'Montreal Canadiens',
      country: 'Canada',
    },
    dateTime: new Date('2025-10-05T19:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'Scotiabank Arena',
  },
  {
    id: 'h2',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h3',
      name: 'Boston Bruins',
      country: 'USA',
    },
    awayTeam: {
      id: 'h4',
      name: 'New York Rangers',
      country: 'USA',
    },
    dateTime: new Date('2025-10-06T19:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'TD Garden',
  },
  {
    id: 'h3',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h5',
      name: 'Tampa Bay Lightning',
      country: 'USA',
    },
    awayTeam: {
      id: 'h6',
      name: 'Florida Panthers',
      country: 'USA',
    },
    dateTime: new Date('2025-10-07T20:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'Amalie Arena',
  },
  {
    id: 'h4',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h7',
      name: 'Colorado Avalanche',
      country: 'USA',
    },
    awayTeam: {
      id: 'h8',
      name: 'Vegas Golden Knights',
      country: 'USA',
    },
    dateTime: new Date('2025-10-08T21:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'Ball Arena',
  },
  {
    id: 'h5',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h9',
      name: 'Edmonton Oilers',
      country: 'Canada',
    },
    awayTeam: {
      id: 'h10',
      name: 'Calgary Flames',
      country: 'Canada',
    },
    dateTime: new Date('2025-10-09T22:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'Rogers Place',
  },
  {
    id: 'h6',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h11',
      name: 'Pittsburgh Penguins',
      country: 'USA',
    },
    awayTeam: {
      id: 'h12',
      name: 'Washington Capitals',
      country: 'USA',
    },
    dateTime: new Date('2025-10-10T19:00:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'PPG Paints Arena',
  },
  {
    id: 'h7',
    sport: SportType.ICE_HOCKEY,
    homeTeam: {
      id: 'h13',
      name: 'Vancouver Canucks',
      country: 'Canada',
    },
    awayTeam: {
      id: 'h14',
      name: 'Seattle Kraken',
      country: 'USA',
    },
    dateTime: new Date('2025-10-11T22:30:00'),
    status: MatchStatus.UPCOMING,
    league: {
      id: 'l10',
      name: 'NHL',
      country: 'North America',
    },
    venue: 'Rogers Arena',
  },
];
