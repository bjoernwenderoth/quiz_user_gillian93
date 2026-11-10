export type Question = {
  id: string
  category: string
  question: string
  answers: readonly [string, string, string, string]
  correctAnswer: number
  image: string
  imageAlt: string
  /** Optional CSS object-position for tighter crops (phones show the image in 16:9). */
  imagePosition?: string
}

export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const questions: readonly Question[] = [
  { id: 'tennis', category: 'Tennis', question: 'Beim Tennis steht es 40:40. Wie nennt man diesen Spielstand?', answers: ['Tie-Break', 'Einstand', 'Matchball', 'Breakpoint'], correctAnswer: 1, image: 'tennis.jpg', imageAlt: 'Tennisspieler beim Aufschlag auf einem Sandplatz, von oben fotografiert' },
  { id: 'sido', category: 'Musik', question: 'Mit welchem Album begann Sido 2004 seine Soloalbum-Karriere?', answers: ['Ich', '30-11-80', 'Ich & meine Maske', 'Maske'], correctAnswer: 3, image: 'music.jpg', imageAlt: 'Collagenartiges Schwarz-Weiß-Porträt eines Mannes mit Brille und Bart' },
  { id: 'orgrimmar', category: 'Gaming', question: 'Welche Stadt ist die Hauptstadt der Orks in World of Warcraft?', answers: ['Sturmwind', 'Darnassus', 'Orgrimmar', 'Eisenschmiede'], correctAnswer: 2, image: 'fantasy.jpg', imageAlt: 'Gemalte Fantasy-Szene: Helden blicken auf eine Stadt am See vor schneebedeckten Bergen' },
  { id: 'carbonara', category: 'Food', question: 'Welche Zutat gehört traditionell in eine originale Pasta Carbonara?', answers: ['Guanciale', 'Sahne', 'Mozzarella', 'Mascarpone'], correctAnswer: 0, image: 'carbonara.jpg', imageAlt: 'Teller Spaghetti mit cremiger Sauce und Speckwürfeln' },
  { id: 'wm-2014', category: 'Fußball', question: 'Wer schoss Deutschland im WM-Finale 2014 gegen Argentinien zum Titel?', answers: ['Thomas Müller', 'André Schürrle', 'Mario Götze', 'Miroslav Klose'], correctAnswer: 2, image: 'football.jpg', imageAlt: 'Voll besetztes Fußballstadion unter Flutlicht' },
  { id: 'edeltalk', category: 'Streaming', question: 'Welcher bekannte deutsche Twitch-Streamer betreibt zusammen mit Reeze den Podcast „Edeltalk“?', answers: ['Papaplatte', 'Knossi', 'EliasN97', 'MontanaBlack'], correctAnswer: 0, image: 'streaming.jpg', imageAlt: 'Streaming-Logo mit schwebenden Gaming-Controllern auf violettem Hintergrund' },
  { id: 'kool-savas', category: 'Deutschrap / TV', question: 'Bei welchem Casting-Format war der „King of Rap“ Kool Savas Teil der Jury?', answers: ['Deutschland sucht den Superstar', 'Popstars', 'X Factor', 'The Voice'], correctAnswer: 3, image: 'kool-savas.jpg', imageAlt: 'Mann mit weißem Hoodie und Mütze nachts unter einer Brücke' },
  { id: 'babo', category: 'Deutschrap / Doku', question: 'Wie heißt der Rapper, dessen Geschichte in der Doku „Babo“ erzählt wird?', answers: ['Aykut Demir', 'Aykut Anhan', 'Aykut Yilmaz', 'Aykut Özdemir'], correctAnswer: 1, image: 'urban.jpg', imageAlt: 'Mann im Interview vor schwarzem Hintergrund', imagePosition: 'center 20%' },
  { id: 'albatross', category: 'Golf', question: 'Wenn ein Spieler auf einem Par-5-Loch den Ball bereits mit dem zweiten Schlag einlocht, wie nennt man das?', answers: ['Birdie', 'Bogey', 'Albatross', 'Eagle'], correctAnswer: 2, image: 'golf-green.jpg', imageAlt: 'Golfball direkt vor dem Loch auf dem Grün' },
  { id: 'final-key', category: 'Final Key', question: '2018 gab Capital Bra einer Stadt ein musikalisches Lebenszeichen. 2019 schrieb er die Geschichte gemeinsam mit Samra fort. Wie lautet der Titel, mit dem alles begann?', answers: ['Hauptstadt lebt', 'Berlin lebt', 'Berlin für immer', 'Berlin bei Nacht'], correctAnswer: 1, image: 'city.jpg', imageAlt: 'Zwei Männer auf einem Dach vor wolkigem Himmel' },
]


export const access = { email: 'gillian_jerome93@hotmail.com', password: 'SantPo09' }

export const gift = {
  recipient: 'Gillian', artists: 'Samra & Capital Bra', show: 'Berlin lebt 3',
  date: '01.04.2027', venue: 'Sporthalle Hamburg',
}


