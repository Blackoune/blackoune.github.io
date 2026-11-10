// Site affiché dans le cadre d'un autre site (clickjacking) : page masquée.
// GitHub Pages n'envoie pas d'en-tête, et `frame-ancestors` est ignoré dans
// une CSP posée par balise <meta> : il ne reste que ce script.
// shortcut: sans JavaScript la page reste encadrable, à remplacer par l'en-tête
// `frame-ancestors 'none'` si le site passe un jour derrière un vrai serveur.
if (window.top !== window.self) document.documentElement.hidden = true;
