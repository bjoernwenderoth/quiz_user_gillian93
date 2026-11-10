export type Question = {
  id: string
  category: string
  question: string
  answers: readonly [string, string, string, string]
  correctAnswer: number
  image: string
  imageAlt: string
}

export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const questions: readonly Question[] = [
  { id: 'tennis', category: 'Tennis', question: 'Beim Tennis steht es 40:40. Wie nennt man diesen Spielstand?', answers: ['Breakpoint', 'Tie-Break', 'Einstand', 'Matchball'], correctAnswer: 2, image: 'tennis.jpg', imageAlt: 'Tennisplatz mit klaren weißen Spielfeldlinien' },
  { id: 'sido', category: 'Musik', question: 'Mit welchem Album begann Sido 2004 seine Soloalbum-Karriere?', answers: ['Ich', 'Maske', 'Ich & meine Maske', '30-11-80'], correctAnswer: 1, image: 'music.jpg', imageAlt: 'Mischpult in einem Musikstudio' },
  { id: 'golf-bag', category: 'Golf', question: 'Wie viele Schläger darf ein Spieler bei einer regulären Golfrunde maximal im Bag haben?', answers: ['10', '12', '14', '16'], correctAnswer: 2, image: 'golf.jpg', imageAlt: 'Golfspieler beim Abschlag auf einem grünen Golfplatz' },
  { id: 'orgrimmar', category: 'Gaming', question: 'Welche Stadt ist die Hauptstadt der Orks in World of Warcraft?', answers: ['Sturmwind', 'Darnassus', 'Eisenschmiede', 'Orgrimmar'], correctAnswer: 3, image: 'fantasy.jpg', imageAlt: 'Burg im Nebel als atmosphärisches Fantasy-Motiv' },
  { id: 'carbonara', category: 'Food', question: 'Welche Zutat gehört traditionell in eine originale Pasta Carbonara?', answers: ['Sahne', 'Guanciale', 'Mozzarella', 'Mascarpone'], correctAnswer: 1, image: 'carbonara.jpg', imageAlt: 'Frisch angerichtete Pasta als italienisches Food-Motiv' },
  { id: 'edeltalk', category: 'Streaming', question: 'Welcher bekannte deutsche Twitch-Streamer betreibt zusammen mit Reeze den Podcast „Edeltalk“?', answers: ['Knossi', 'MontanaBlack', 'Papaplatte', 'EliasN97'], correctAnswer: 2, image: 'streaming.jpg', imageAlt: 'Beleuchteter Gaming-Monitor an einem Schreibtisch' },
  { id: 'babo', category: 'Deutschrap / Doku', question: 'Wie heißt der Rapper, dessen Geschichte in der Doku „Babo“ erzählt wird?', answers: ['Aykut Demir', 'Aykut Özdemir', 'Aykut Anhan', 'Aykut Yilmaz'], correctAnswer: 2, image: 'urban.jpg', imageAlt: 'Nächtliche urbane Atmosphäre als Dokumentarfilm-Motiv' },
  { id: 'albatross', category: 'Golf', question: 'Wenn ein Spieler auf einem Par-5-Loch den Ball bereits mit dem zweiten Schlag einlocht, wie nennt man das?', answers: ['Birdie', 'Eagle', 'Albatross', 'Bogey'], correctAnswer: 2, image: 'golf-green.jpg', imageAlt: 'Golfball direkt vor dem Loch auf dem Grün' },
  { id: 'death-knight', category: 'Gaming', question: 'Mit welcher Erweiterung wurde der Todesritter als erste Heldenklasse in World of Warcraft eingeführt?', answers: ['The Burning Crusade', 'Cataclysm', 'Wrath of the Lich King', 'Mists of Pandaria'], correctAnswer: 2, image: 'ice.jpg', imageAlt: 'Dramatisches kaltes Bergmassiv als Fantasy-Motiv' },
  { id: 'final-key', category: 'Final Key', question: '2018 gab Capital Bra einer Stadt ein musikalisches Lebenszeichen. 2019 schrieb er die Geschichte gemeinsam mit Samra fort. Wie lautet der Titel, mit dem alles begann?', answers: ['Berlin bei Nacht', 'Hauptstadt lebt', 'Berlin lebt', 'Berlin für immer'], correctAnswer: 2, image: 'city.jpg', imageAlt: 'Dicht bebaute Großstadt bei Nacht' },
]

export const gift = {
  recipient: 'Gillian', artists: 'Samra & Capital Bra', show: 'Berlin lebt 3',
  date: '01.04.2027', venue: 'Sporthalle Hamburg',
  message: 'Alles Gute zum Geburtstag!',
}

/** Video-ID eines offiziellen, einbettbaren Trailers. Der Player lädt erst nach einem Klick. */
export const music: { youtubeVideoId: string | null } = { youtubeVideoId: null }

