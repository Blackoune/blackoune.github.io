// Guides : une page par question fréquente des streamers sur OBS. Chacune
// répond dès la première phrase (ce que Google et les IA reprennent), puis
// détaille. Mise en forme autorisée : **gras** et `code` (Texte.astro).

export type GuideCle = 'guide-scenes' | 'guide-musique' | 'guide-chat' | 'guide-raccourcis';
export const GUIDES_CLES: GuideCle[] = ['guide-scenes', 'guide-musique', 'guide-chat', 'guide-raccourcis'];

export interface Guide {
  slug: string;
  court: string;          // libellé des liens (pied de page, accueil)
  titre: string;          // <title>
  description: string;
  h1: string;
  intro: string;          // réponse directe
  etapesTitre: string;
  etapes: [string, string][];
  sections: [string, string][];
  faq: [string, string][];
  demo?: 'widget' | 'chat';
}

const fr: Record<GuideCle, Guide> = {
  'guide-scenes': {
    slug: 'changer-de-scene-obs-automatiquement',
    court: 'Changer de scène OBS automatiquement',
    titre: 'Changer de scène OBS automatiquement selon le jeu (menu, en jeu) — OBS Dynamics',
    description: "Comment basculer automatiquement vos scènes OBS Studio quand un jeu se lance, et entre le menu et la partie : guide pas à pas, gratuit, pour Windows.",
    h1: 'Comment changer de scène OBS automatiquement selon le jeu ?',
    intro: "Installez OBS Dynamics, activez le serveur WebSocket d'OBS, puis ajoutez votre jeu avec une scène « Menu » et une scène « En jeu » : la scène change toute seule. L'application repère le jeu lancé, compare l'écran à vos captures de référence et commande OBS Studio, sans plugin à installer dans OBS.",
    etapesTitre: 'Mise en place en 6 étapes',
    etapes: [
      ["Activez le WebSocket d'OBS", "Dans OBS Studio 28 ou plus : **Outils → Paramètres du serveur WebSocket**, cochez **Activer le serveur WebSocket** et copiez le mot de passe depuis **Afficher les informations de connexion**."],
      ['Connectez OBS Dynamics', 'Onglet **Paramètres** : adresse `localhost`, port `4455`, le mot de passe, puis **Enregistrer**.'],
      ['Ajoutez le jeu', "Onglet **Bibliothèque** : **Scanner Steam** importe vos jeux Steam ; **+ Ajouter → Manuel (exe)** ajoute n'importe quel jeu par le nom de son exécutable."],
      ['Choisissez les scènes', 'Dans la fiche du jeu, choisissez la scène OBS du menu et celle de la partie, ou cochez **Créer automatiquement les scènes dans OBS**.'],
      ['Donnez deux captures de référence', "Une capture plein écran du menu et une en partie, en PNG. Privilégiez l'interface (HUD, minimap, logo), qui ne change pas, plutôt que le décor."],
      ['Démarrez la surveillance', 'Bouton **Démarrer** : le statut passe à « Surveillance active — OBS connecté ». La scène change désormais toute seule.'],
    ],
    sections: [
      ['Pourquoi ne pas se fier au seul nom du processus ?', "Le processus indique si le jeu tourne, pas si vous êtes au menu ou en partie. OBS Dynamics confirme par l'image : il faut deux lectures concordantes et un écart d'au moins 0,15 entre les états avant toute bascule, ce qui évite les changements intempestifs."],
      ['Et si la détection se trompe ?', "`F1` force « En jeu », `F2` « Menu », `F3` « Inactif ». La fenêtre **Vérifier le cadrage** montre les fragments comparés et leur score, pour corriger une capture mal choisie."],
      ["D'autres états que menu et partie", '**+ État supplémentaire** crée un état « Carte », « Inventaire » ou « Pause », avec ses propres captures et sa propre scène OBS.'],
    ],
    faq: [
      ['Faut-il installer un plugin dans OBS ?', "Non. OBS Dynamics est une application à part qui commande OBS par son serveur WebSocket, intégré à OBS Studio depuis la version 28."],
      ['Avec quels jeux cela fonctionne-t-il ?', 'Tout jeu Windows : les jeux Steam sont importés automatiquement, les autres se reconnaissent au nom de leur exécutable. De 720p à 4K.'],
      ['Est-ce gratuit ?', 'Oui, entièrement : logiciel open source sous licence GPL-3.0.'],
    ],
  },
  'guide-musique': {
    slug: 'afficher-musique-en-cours-obs',
    court: 'Afficher la musique en cours sur OBS',
    titre: 'Afficher la musique en cours sur OBS (Spotify, Deezer, Apple Music) — OBS Dynamics',
    description: "Widget « en cours de lecture » pour OBS : pochette, titre, artiste et forme d'onde depuis Spotify, Deezer, Apple Music ou YouTube Music, sans compte ni clé d'API.",
    h1: 'Comment afficher la musique en cours de lecture sur OBS ?',
    intro: "Avec OBS Dynamics, ouvrez l'onglet **Widget Musique**, copiez le lien du lecteur voulu et collez-le dans OBS comme source navigateur : pochette, titre, artiste et forme d'onde s'affichent pendant la lecture. Les informations viennent de Windows lui-même : aucun compte Spotify ni clé d'API à connecter.",
    etapesTitre: 'Mise en place en 4 étapes',
    etapes: [
      ['Lancez votre lecteur', 'Spotify, Deezer, Apple Music, iTunes, Tidal, Amazon Music, SoundCloud ou YouTube Music.'],
      ['Copiez le lien du lecteur', "Onglet **Widget Musique** d'OBS Dynamics : chaque lecteur a sa carte et un lien qui ne change jamais."],
      ['Ajoutez la source dans OBS', "**Sources → + → Navigateur**, collez l'URL. Taille universelle : `1132 × 383`. Trop grand ne coûte rien : le fond est transparent."],
      ['Choisissez le style', 'Bouton **Widget** : 8 thèmes (Violet, Cassette néon, Ardoise, Clair, Sans cadre, Mocha, macOS sombre, macOS clair), 5 dispositions et votre propre image de fond.'],
    ],
    sections: [
      ["Une forme d'onde qui suit le vrai son", "Le niveau est lu sur la session audio du lecteur, comme dans le mélangeur de volume de Windows : l'overlay de Spotify ne réagit qu'au son de Spotify."],
      ['Et un lecteur dans le navigateur ?', "Il est détecté, mais Windows indique seulement le navigateur (Chrome, Edge, Firefox), pas le site. Pour afficher « Spotify » ou « Deezer », utilisez leur application."],
    ],
    faq: [
      ['Faut-il connecter son compte Spotify ?', 'Non. Le widget lit ce que Windows affiche déjà dans ses contrôles multimédias.'],
      ['Faut-il refaire la source à chaque morceau ?', "Non. Chaque lecteur garde le même lien : la source préparée une fois s'allume dès que ce lecteur joue."],
    ],
    demo: 'widget',
  },
  'guide-chat': {
    slug: 'afficher-chat-twitch-obs',
    court: 'Afficher le chat Twitch sur OBS',
    titre: 'Afficher le chat Twitch sur OBS sans compte ni clé — OBS Dynamics',
    description: 'Overlay de chat Twitch pour OBS en lecture anonyme : aucun compte, aucune clé, un lien permanent à coller comme source navigateur.',
    h1: 'Comment afficher le chat Twitch sur OBS ?',
    intro: 'Dans OBS Dynamics, saisissez le nom de votre chaîne Twitch, copiez le lien du chat et collez-le dans OBS comme source navigateur. Le chat est lu en anonyme : aucune connexion à votre compte Twitch, aucune clé à créer.',
    etapesTitre: 'Mise en place en 3 étapes',
    etapes: [
      ['Indiquez votre chaîne', "Onglet **Chat Twitch** → **Connexion** → nom de la chaîne (le nom seul, pas l'URL) → **Valider**."],
      ['Copiez le lien', "**Copier le lien** en bas de l'onglet. Il reste valide après un redémarrage."],
      ['Ajoutez la source dans OBS', '**Sources → + → Navigateur → URL**, collez le lien.'],
    ],
    sections: [
      ['Pourquoi aucun compte ?', "Le chat public d'une chaîne se lit en IRC anonyme. Un compte ne servirait qu'à écrire ou modérer, ce que l'overlay ne fait pas."],
      ['Masquer le chat un instant', "Un interrupteur dans l'onglet cache le chat sans couper la connexion : le réafficher est instantané."],
      ['Le lien a été montré en direct ?', "**Régénérer le lien** invalide l'ancien. Recollez le nouveau dans OBS."],
    ],
    faq: [
      ['Les emotes et les couleurs des pseudos s’affichent-elles ?', 'Oui, comme dans le chat de Twitch.'],
      ['Et Kick ou TikTok ?', 'Non, Twitch uniquement : aucune API publique fiable ne permet de lire leur chat durablement.'],
    ],
    demo: 'chat',
  },
  'guide-raccourcis': {
    slug: 'cacher-minimap-image-son-obs-raccourci',
    court: 'Cacher la minimap avec un raccourci OBS',
    titre: 'Cacher la minimap ou afficher une image sur OBS avec une touche — OBS Dynamics',
    description: 'Associez une touche ou une combinaison à une image, une vidéo ou un son dans OBS. Mode maintien : la minimap reste cachée tant que la touche est enfoncée.',
    h1: 'Comment cacher la minimap ou afficher une image sur OBS avec une touche ?',
    intro: "Dans l'onglet **Raccourcis & Overlays** d'OBS Dynamics, associez une combinaison (par exemple `Ctrl + Maj + M`) à une image, une vidéo ou un son, puis collez le lien fourni dans OBS comme source navigateur. En mode **Maintien**, l'image reste affichée tant que la touche est enfoncée : idéal pour cacher une minimap à vos viewers.",
    etapesTitre: 'Mise en place en 4 étapes',
    etapes: [
      ['Créez le raccourci', '**+ Ajouter un raccourci**, cliquez dans le champ de gauche puis pressez la combinaison. `Échap` annule.'],
      ['Choisissez le média', '**Image**, **Vidéo** ou **Son**, puis glissez le fichier sur la zone de dépôt.'],
      ['Réglez la durée', '**Maintien**, ou de 150 ms à 10 s (3 s par défaut).'],
      ['Ajoutez la source dans OBS', "Copiez l'URL affichée sous la ligne, puis **Sources → + → Navigateur**."],
    ],
    sections: [
      ['Instantané, même sur des appuis rapides', "Le média est préchargé à l'ouverture de la source : un appui ne coûte qu'un changement d'affichage, sans attente."],
      ['Le son ne s’entend pas ?', 'Dans les propriétés de la source navigateur, cochez **Contrôler l’audio via OBS**.'],
      ['Rien ne sort de votre PC', 'Les overlays sont servis sur `127.0.0.1` uniquement : aucune autre machine ne peut les atteindre.'],
    ],
    faq: [
      ['Faut-il un Stream Deck ?', 'Non, le clavier suffit.'],
      ['Deux raccourcis peuvent-ils partager une combinaison ?', 'Non : une combinaison déjà prise par un autre raccourci est refusée.'],
    ],
  },
};

const en: Record<GuideCle, Guide> = {
  'guide-scenes': {
    slug: 'switch-obs-scenes-automatically',
    court: 'Switch OBS scenes automatically',
    titre: 'Switch OBS scenes automatically for each game (menu, gameplay) — OBS Dynamics',
    description: 'How to switch OBS Studio scenes automatically when a game starts, and between menu and gameplay: a free, step-by-step guide for Windows.',
    h1: 'How do I switch OBS scenes automatically for each game?',
    intro: 'Install OBS Dynamics, turn on the OBS WebSocket server, then add your game with a “Menu” scene and an “In game” scene: the scene switches on its own. The app spots the running game, compares the screen with your reference screenshots and drives OBS Studio, with no plugin to install in OBS.',
    etapesTitre: 'Set up in 6 steps',
    etapes: [
      ['Turn on the OBS WebSocket', 'In OBS Studio 28 or later: **Tools → WebSocket Server Settings**, tick **Enable WebSocket server** and copy the password from **Show Connect Info**.'],
      ['Connect OBS Dynamics', '**Settings** tab: address `localhost`, port `4455`, the password, then **Save**.'],
      ['Add the game', '**Library** tab: **Scan Steam** imports your Steam games; **+ Add → Manual (exe)** adds any game by its executable name.'],
      ['Pick the scenes', 'In the game settings, pick the OBS scene for the menu and the one for gameplay, or tick **Automatically create scenes in OBS**.'],
      ['Provide two reference screenshots', 'One full-screen PNG of the menu and one in game. Favour the interface (HUD, minimap, logo), which stays the same, over the background.'],
      ['Start monitoring', '**Start** button: the status turns to “Monitoring active — OBS connected”. The scene now switches on its own.'],
    ],
    sections: [
      ['Why not rely on the process name alone?', 'The process tells whether the game is running, not whether you are in a menu or playing. OBS Dynamics confirms with the image: two matching reads and a lead of at least 0.15 between states are required before any switch, which prevents unwanted changes.'],
      ['What if detection gets it wrong?', '`F1` forces “In game”, `F2` “Menu”, `F3` “Idle”. The **Check framing** window shows the compared fragments and their score, so you can fix a poorly chosen screenshot.'],
      ['More states than menu and gameplay', '**+ Extra state** creates a “Map”, “Inventory” or “Pause” state, with its own screenshots and its own OBS scene.'],
    ],
    faq: [
      ['Do I need to install an OBS plugin?', 'No. OBS Dynamics is a separate app that drives OBS through its WebSocket server, built into OBS Studio since version 28.'],
      ['Which games does it work with?', 'Any Windows game: Steam games are imported automatically, others are recognised by their executable name. From 720p to 4K.'],
      ['Is it free?', 'Yes, completely: open-source software under the GPL-3.0 licence.'],
    ],
  },
  'guide-musique': {
    slug: 'obs-now-playing-widget',
    court: 'Show the song playing on OBS',
    titre: 'Show the song now playing on OBS (Spotify, Deezer, Apple Music) — OBS Dynamics',
    description: 'A “now playing” widget for OBS: cover, title, artist and waveform from Spotify, Deezer, Apple Music or YouTube Music, with no account or API key.',
    h1: 'How do I show the song now playing on OBS?',
    intro: 'In OBS Dynamics, open the **Music Widget** tab, copy the link of the player you want and paste it into OBS as a browser source: cover, title, artist and a waveform appear while music plays. The data comes from Windows itself: no Spotify account and no API key to connect.',
    etapesTitre: 'Set up in 4 steps',
    etapes: [
      ['Start your player', 'Spotify, Deezer, Apple Music, iTunes, Tidal, Amazon Music, SoundCloud or YouTube Music.'],
      ['Copy the player link', 'OBS Dynamics **Music Widget** tab: each player has its own card and a link that never changes.'],
      ['Add the source in OBS', '**Sources → + → Browser**, paste the URL. Universal size: `1132 × 383`. Too big costs nothing: the background is transparent.'],
      ['Pick a style', '**Widget** button: 8 themes (Violet, Cassette néon, Ardoise, Clair, Sans cadre, Mocha, macOS sombre, macOS clair), 5 layouts and your own background image.'],
    ],
    sections: [
      ['A waveform that follows the real sound', 'The level is read from the player’s audio session, like in the Windows volume mixer: the Spotify overlay only reacts to Spotify’s sound.'],
      ['What about a player in the browser?', 'It is detected, but Windows only reports the browser (Chrome, Edge, Firefox), not the website. To show “Spotify” or “Deezer”, use their app.'],
    ],
    faq: [
      ['Do I need to connect my Spotify account?', 'No. The widget reads what Windows already shows in its media controls.'],
      ['Do I need to redo the source for each song?', 'No. Each player keeps the same link: a source set up once lights up whenever that player plays.'],
    ],
    demo: 'widget',
  },
  'guide-chat': {
    slug: 'twitch-chat-overlay-obs',
    court: 'Show Twitch chat on OBS',
    titre: 'Show Twitch chat on OBS with no account or key — OBS Dynamics',
    description: 'A Twitch chat overlay for OBS that reads anonymously: no account, no key, one permanent link to paste as a browser source.',
    h1: 'How do I show Twitch chat on OBS?',
    intro: 'In OBS Dynamics, enter your Twitch channel name, copy the chat link and paste it into OBS as a browser source. Chat is read anonymously: no sign-in to your Twitch account, no key to create.',
    etapesTitre: 'Set up in 3 steps',
    etapes: [
      ['Enter your channel', '**Twitch Chat** tab → **Connect** → channel name (the name only, not the URL) → **Save**.'],
      ['Copy the link', '**Copy link** at the bottom of the tab. It stays valid after a restart.'],
      ['Add the source in OBS', '**Sources → + → Browser → URL**, paste the link.'],
    ],
    sections: [
      ['Why no account?', 'A channel’s public chat can be read through anonymous IRC. An account would only be needed to write or moderate, which the overlay does not do.'],
      ['Hide chat for a moment', 'A switch in the tab hides chat without dropping the connection: showing it again is instant.'],
      ['Was the link shown on stream?', '**Regenerate link** invalidates the old one. Paste the new one into OBS.'],
    ],
    faq: [
      ['Are emotes and name colours shown?', 'Yes, just like in Twitch chat.'],
      ['What about Kick or TikTok?', 'No, Twitch only: no reliable public API lets their chat be read over time.'],
    ],
    demo: 'chat',
  },
  'guide-raccourcis': {
    slug: 'obs-hotkey-hide-minimap',
    court: 'Hide the minimap with an OBS hotkey',
    titre: 'Hide the minimap or show an image on OBS with a hotkey — OBS Dynamics',
    description: 'Bind a key or a key combination to an image, video or sound in OBS. Hold mode: the minimap stays hidden while the key is held.',
    h1: 'How do I hide the minimap or show an image on OBS with a key?',
    intro: 'In the **Hotkeys & Overlays** tab of OBS Dynamics, bind a combination (for example `Ctrl + Shift + M`) to an image, a video or a sound, then paste the provided link into OBS as a browser source. In **Hold** mode, the image stays on screen while the key is held: perfect for hiding a minimap from your viewers.',
    etapesTitre: 'Set up in 4 steps',
    etapes: [
      ['Create the hotkey', '**+ Add a hotkey**, click the left field then press the combination. `Esc` cancels.'],
      ['Pick the media', '**Image**, **Video** or **Sound**, then drag the file onto the drop zone.'],
      ['Set the duration', '**Hold**, or from 150 ms to 10 s (3 s by default).'],
      ['Add the source in OBS', 'Copy the URL shown under the line, then **Sources → + → Browser**.'],
    ],
    sections: [
      ['Instant, even on quick presses', 'The media is preloaded when the source opens: a key press only toggles visibility, with no delay.'],
      ['Can’t hear the sound?', 'In the browser source properties, tick **Control audio via OBS**.'],
      ['Nothing leaves your PC', 'Overlays are served on `127.0.0.1` only: no other machine can reach them.'],
    ],
    faq: [
      ['Do I need a Stream Deck?', 'No, your keyboard is enough.'],
      ['Can two hotkeys share a combination?', 'No: a combination already used by another hotkey is refused.'],
    ],
  },
};

export const GUIDES = { fr, en };
