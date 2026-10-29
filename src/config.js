module.exports = {
  name: 'Ziyi (Ellen) Zhou',
  shortName: 'Ellen Zhou',
  description:
    'Ziyi (Ellen) Zhou is a statistician and data engineer in Montréal who builds rigorous, reproducible models for rare events: climate extremes, tail risk and the education statistics behind SDG 4.',
  // Update if the repository is renamed (e.g. to EllenSyuu.github.io → 'https://ellensyuu.github.io').
  siteUrl: process.env.GATSBY_SITE_URL || 'https://ellensyuu.github.io',

  // TODO(Ellen): the address you want public. Empty hides the side email link.
  email: '',
  // Web3Forms access key (public by design). Create one at web3forms.com with your email.
  formAccessKey: process.env.GATSBY_FORM_KEY || '1fe456b0-5939-4f89-9180-312d0e2b1312',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/EllenSyuu',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/ellenziyizhou',
    },
  ],

  // Order = the storyline of the home page; also drives the chapter map.
  navLinks: [
    { name: 'About', url: '/#about' },
    { name: 'Experience', url: '/#jobs' },
    { name: 'What I Do', url: '/#focus' },
    { name: 'Work', url: '/#projects' },
    { name: 'Impact', url: '/#impact' },
    { name: 'Contact', url: '/#contact' },
  ],

  // Set to true after replacing src/images/me.jpg with your photo. Until then the hero frame
  // shows the live research visual instead.
  hasPortrait: false,

  // Put your CV at static/resume.pdf, then set this to true to show the Résumé button.
  showResume: false,

  colors: {
    green: '#a65332',
    navy: '#fbf6ec',
    darkNavy: '#f3e8d6',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
