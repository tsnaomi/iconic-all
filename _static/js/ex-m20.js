// jshint ignore:start
var m20 = (function() {

  // store images & jsPsych experiment blocks
  var EXPERIMENT = {
    images: [],
    block1: {},
    block2: {},
    block3a: {}, block3b: {},
    block4a: {}, block4b: {},
  };

  // ==========================================================================
  // Define internal helper variables; the capitalized ones get updated
  // ==========================================================================

  // store trial data associated with each block
  var DATA = {
    block1: [],
    block2: [],
    block3a: [], block3b: [],
    block4a: [], block4b: [],
  };

  // store one-modifier NPs
  var ONE_MOD_NPS = [];

  // store which trials get flipped images
  var PROX_FLIPS;
  var DIST_FLIPS;
  var FLIPS;

  // set global linger duration
  var linger = 600;

  // lexical information
  var nouns = ["ball", "feather", "mug"];
  var noun_icons = ["B", "F", "M"];
  var modifiers = ["this", "that", "black", "red", "two", "three"];
  var mod_icons = ["p", "d", "b", "r", "2", "3"];

  var lookup = {
    // icon2word
    B: "ball", F: "feather", M: "mug",
    p: "this", d: "that", b: "black", r: "red", "2": "two", "3": "three",
    // word2icon
    ball: "B", feather: "F", mug: "M",
    this: "p", that: "d", black: "b", red: "r", two: "2", three: "3",
  };

  var icon2pos = {
    p: "dem", d: "dem", "2": "num", "3": "num", b: "adj", r: "adj",
  };

  var mod_pairs = [
    ["b", "2"], ["b", "3"], ["r", "2"], ["r", "3"], // adj-num
    ["b", "p"], ["b", "d"], ["r", "p"], ["r", "d"], // adj-dem
    ["2", "p"], ["2", "d"], ["3", "p"], ["3", "d"], // num-dem
  ];

  var foils = {p: "d", d: "p", b: "r", r: "b", "2": "3", "3": "2"};

  var lexicon = [noun_icons, ["b", "r"], ["2", "3"], ["p", "d"]];

  // randomly sort the one-modifier NPs to different tasks (the randomization 
  // comes from the shuffling in `generate_one_mod_NPs()`)
  var idxs = {
    a: [0, 5, 7, 9, 14, 16],  // picture selection (block 2)
    b: [1, 3, 8, 10, 12, 17], // madlib            (block 2)
    c: [2, 4, 6, 11, 13, 15], // production        (block 3b)
  };

  // ==========================================================================
  // Define internal helper functions
  // ==========================================================================

  // function to generate the 18 possible one-modifier NPs
  function generate_one_mod_NPs() {
    var nicons = jsPsych.randomization.shuffle(noun_icons);
    var micons = jsPsych.randomization.shuffle(mod_icons);
    for (let i = 0; i < modifiers.length; i++) {
      for (let j = 0; j < nouns.length; j++) {
        ONE_MOD_NPS.push([nicons[j], micons[i]]);
      }
    }
  }

  // function to assign which trials get flipped images
  function assign_flips(n, d) {
    var bools = [true, false];
    var flips;

    // out of the `d` demonstrative trials, each demonstrative will appear with
    // `n/4` flipped images and `n/4` unflipped images; if `n % 4 != 0`, one
    // demonstrative will appear with an additional flipped image and the other
    // will appear with an additional unflipped image, s.t. across all of the
    // demonstrative trials, the # of flipped and unflipped images are equal
    d /= 2;
    if (d % 2 == 0) {
      d /= 2;
      PROX_FLIPS = jsPsych.randomization.repeat(bools, [d, d]);
      DIST_FLIPS = jsPsych.randomization.repeat(bools, [d, d]);
    } else {
      d = (d - 1) / 2;
      PROX_FLIPS = jsPsych.randomization.repeat(bools, [d, d]);
      DIST_FLIPS = jsPsych.randomization.repeat(bools, [d, d]);
      flips = jsPsych.randomization.shuffle(bools);
      PROX_FLIPS.push(flips[0]);
      DIST_FLIPS.push(flips[1]);
    }

    // out of the `n` non-demonstrative trials, `n/2` trials will have flipped
    // images and `n/2` won't
    n /= 2;
    FLIPS = jsPsych.randomization.repeat(bools, [n, n]);
  }

  // function to grab the flip assignment for a particular trial
  function get_flip(micon) {
    if (micon == "p") {
      return PROX_FLIPS.pop();
    } else if (micon == "d") {
      return DIST_FLIPS.pop();
    } else {
      return FLIPS.pop();
    }
  }

  // function to generate keyboard
  function keyboard(iso = true, m1 = null, m2 = null) {
    // bare NP
    if (!m1) {
      return _keyboard();
    }

    // 1-modifier NP
    if (!m2) {
      m2 = m1;
      m1 = "B"; // any noun would do!
    }

    var lexicon = [noun_icons, ["b", "r"], ["2", "3"], ["p", "d"]];
    var micon2lex = {"b": 1, "r": 1, "2": 2, "3": 2, "p": 3, "d": 3};
    var lex_cat = micon2lex[m2]; // index of the `m2` category in `lexicon`
    var sites = [...Array(4).keys()];
    var idx = false;
    var keyboard = [];
    var keys;

    // generate a keyboard without the `m2` category
    sites.splice(lex_cat,1);
    sites = jsPsych.randomization.shuffle(sites);
    for (let i = 0; i < sites.length; i++) {
      keyboard.push(jsPsych.randomization.shuffle(lexicon[sites[i]]));
    }

    // reset `sites` to a list of landing sites for the `m2` category, s. t.
    // the `m2` category appears after the `m1` category
    sites = [];
    for (let i = 0; i < 4; i++) {
      if (idx) {
        sites.push(i);
      } else if (keyboard[i].includes(m1)) {
        idx = true;
      }
    }

    // determine the landing site for the `m2` category
    idx = jsPsych.randomization.shuffle(sites)[0];

    // generate and flatten the full keyboard (in isomorphic order)
    keys = jsPsych.randomization.shuffle(lexicon[lex_cat]);
    keyboard = keyboard.slice(0,idx).concat([keys]).concat(keyboard.slice(idx));
    keyboard = [].concat.apply([], keyboard);

    // reverse the order of they keys for a non-isomorphic keyboard
    if (!iso) {
      keyboard.reverse();
    }

    return keyboard;
  }

  // function to help generate keyboard
  function _keyboard() {
    var keyboard = [];
    var sites = random_indices(4);
    var keys = [];
    for (let i = 0; i < sites.length; i++) {
      keys = jsPsych.randomization.shuffle(lexicon[sites[i]]);
      for (let j = 0; j < keys.length; j++) {
        keyboard.push(keys[j]);
      }
    }
    return keyboard;
  }

  // function to map icons to filename
  function icons2fn(arr) {
    return arr.slice().reverse().map(i => lookup[i]).join("-");
  }

  // function to generate image stimulus
  function stim_img(str, flip=false) {
    var src = `/_static/stimuli/${str}.png`;
    EXPERIMENT.images.push(src);

    if (flip) {
      return `<img class="flip" src="${src}" />`;
    } else {
      return `<img src="${src}" />`;
    }
  } 

  // function to generate span stimulus
  function stim_span(str) {
    return `<span class="iconic">${encode_red(str)}</span>`;
  }

  // function to generate text stimulus
  function stim_txt(str) {
    return encode_red(str);
  }

  // function to generate madlib caption stimulus
  function stim_madlib_caption(arr) {
    return `${arr[0]} %blank%`;
  }

  // ==========================================================================
  // Define functions to generate each experiment block
  // ==========================================================================

  function block1() { // 6 trials

    // BLOCK 1 ----------------------------------------------------------------
    // Noun learning:
    // Exposure to nouns through 3 icon-selection trials & 3 picture-selection
    // trials, totaling 6 trials. Each noun appears twice, once per trial type.
    // ------------------------------------------------------------------------

    var noun, nicon;
    var flip;

    // assign which of the 6 trials get flipped images
    var flips = jsPsych.randomization.repeat([true, false], [3, 3]);

    for (let i = 0; i < nouns.length; i++) {
      noun = nouns[i];
      nicon = noun_icons[i];

      // icon selection
      flip = flips.pop();
      DATA.block1.push({ 
        stimulus: stim_img(noun, flip),
        choices: noun_icons,
        answer: nicon,
        button_html: `<button class="jspsych-btn iconic">%choice%</button>`,
        noun: noun,
        flip: flip,
        subtype: "icon selection",
        css_classes: ["icon-selection", ],
      });

      // picture selection
      flip = flips.pop();
      DATA.block1.push({
        stimulus: stim_span(nicon),
        choices: nouns.map(i => stim_img(i, flip)),
        data_choices: nouns.map(i => lookup[i]),
        answer: nicon,
        button_html: null,
        noun: noun,
        flip: flip,
        subtype: "picture selection",
        css_classes: ["picture-selection", ],
      });
    }

    // create block 1 trials
    var block1_trials = {
      type: jsPsychSelection,
      stimulus: jsPsych.timelineVariable("stimulus"),
      choices: jsPsych.timelineVariable("choices"),
      data_choices: jsPsych.timelineVariable("data_choices"),
      answer: jsPsych.timelineVariable("answer"),
      button_html: jsPsych.timelineVariable("button_html"),
      force_correct_button_press: true,
      linger_duration: linger,
      css_classes: jsPsych.timelineVariable("css_classes"),
      data: {
        block: 1,
        n_mod: 0,
        group: null,
        noun: jsPsych.timelineVariable("noun"),
        flip: jsPsych.timelineVariable("flip"),
        subtype: jsPsych.timelineVariable("subtype"),
      },
    };

    // create block 1
    EXPERIMENT.block1 = {
      timeline: [block1_trials, ],
      timeline_variables: DATA.block1,
      randomize_order: true,
    };
  }

  function block2() { // 12 trials

    // BLOCK 2 ---------------------------------------------------------------- 
    // Modifier learning:
    // Exposure to modifiers through 6 picture-selection trials & 6 madlib
    // trials, totaling 12 trials. Each modifier appears twice (once per trial
    // type) and each noun 4 times (twice per trial type). The 6 unobserved
    // one-modifier NPs appear in Block 3.
    // ------------------------------------------------------------------------

    var icons;
    var nicon;
    var micon;
    var flip;
    var choices;

    // assign which trials get flipped images
    assign_flips(8, 4);

    for (let i = 0; i < modifiers.length; i++) {

      // picture selection
      icons = ONE_MOD_NPS[idxs.a[i]];
      [nicon, micon] = icons;
      choices = [icons, [nicon, foils[micon]]];
      flip = get_flip(micon);
      DATA.block2.push({
        type: jsPsychSelection,
        stimulus: stim_span(icons.join("")),
        choices: choices.map(i => stim_img(icons2fn(i), flip)),
        data_choices: choices.map(i => i[1]),
        answer: micon,
        button_html: null,
        group: icon2pos[micon],
        noun: lookup[nicon],
        flip: flip,
        subtype: "picture selection",
        css_classes: ["picture-selection", ],
      });

      // madlib
      icons = ONE_MOD_NPS[idxs.b[i]];
      [nicon, micon] = icons;
      choices = [micon, foils[micon]];
      flip = get_flip(micon);
      DATA.block2.push({
        type: jsPsychMadlib,
        img_stimulus: stim_img(icons2fn(icons), flip),
        caption_stimulus: stim_madlib_caption(icons),
        choices: choices.map(stim_txt),
        data_choices: choices,
        answer: micon,
        button_html: `<button class="jspsych-btn iconic">%choice%</button>`,
        group: icon2pos[micon],
        noun: lookup[nicon],
        flip: flip,
      });
    }

    // create block 2 trials
    var block2_trials = {
      type: jsPsych.timelineVariable("type"),
      stimulus: jsPsych.timelineVariable("stimulus"),
      img_stimulus: jsPsych.timelineVariable("img_stimulus"),
      caption_stimulus: jsPsych.timelineVariable("caption_stimulus"),
      choices: jsPsych.timelineVariable("choices"),
      data_choices: jsPsych.timelineVariable("data_choices"),
      answer: jsPsych.timelineVariable("answer"),
      button_html: jsPsych.timelineVariable("button_html"),
      force_correct_button_press: true,
      linger_duration: linger,
      css_classes: jsPsych.timelineVariable("css_classes"),
      data: {
        block: 2,
        n_mod: 1,
        group: jsPsych.timelineVariable("group"),
        noun: jsPsych.timelineVariable("noun"),
        flip: jsPsych.timelineVariable("flip"),
        subtype: jsPsych.timelineVariable("subtype"),
      },
    };

    // create block 2
    EXPERIMENT.block2 = {
      timeline: [block2_trials, ],
      timeline_variables: DATA.block2,
      randomize_order: true,
    };
  }

  function block3() { // 8 trials

    // BLOCK 3 ----------------------------------------------------------------
    // Zero- and one-modifier NP practice:
    // Practice with the production task format, beginning with 2 bare nouns 
    // (3a), followed by 6 one-modifier NPs (3b), totaling 8 trials. In the 
    // one-modifier NPs, each modifier appears once and each noun twice. These 
    // NPs were not observed in Block 2.
    // ------------------------------------------------------------------------

    var icons;
    var noun, nicon;
    var micon;
    var iso;

    // randomly sample two bare nouns
    var bare = jsPsych.randomization.sampleWithoutReplacement(noun_icons, 2);

    // assign which of the two bare nouns get a flipped image
    var flip = true;

    // assign which 1-modifier NP trials get isomorphic keyboards
    var orders = jsPsych.randomization.repeat([true, false], [3, 3]);

    // assign which 1-modifier NP trials get flipped images
    assign_flips(4, 2);

    // production (bare nouns; 3a)
    for (let i = 0; i < bare.length; i++) {
      nicon = bare[i];
      noun = lookup[nicon];
      flip = !flip;
      DATA.block3a.push({
        stimulus: stim_img(noun, flip),
        keys: keyboard(),
        answer: nicon,
        n_mod: 0,
        group: null,
        noun: noun,
        flip: flip,
      });
    }

    // production (1-modifier NPs; 3b)
    for (let i = 0; i < modifiers.length; i++) {
      icons = ONE_MOD_NPS[idxs.c[i]];
      [nicon, micon] = icons;
      flip = get_flip(micon);
      iso = orders[i];
      DATA.block3b.push({
        stimulus: stim_img(icons2fn(icons), flip),
        keys: keyboard(iso, micon),
        key_order: iso ? "iso" : "non_iso",
        answer: icons.join(""),
        n_mod: 1,
        group: icon2pos[micon],
        noun: lookup[nicon],
        flip: flip,
      });
    }

    // create block 3 trials
    var block3_trials = {
      type: jsPsychProduction,
      stimulus: jsPsych.timelineVariable("stimulus"),
      keys: jsPsych.timelineVariable("keys"),
      answer: jsPsych.timelineVariable("answer"),
      show_feedback: true,
      force_correct_production: true,
      linger_duration: linger,
      include_spacebar: false,
      include_counter: true,
      css_classes: ["jspsych-production", ],
      data: {
        block: 3,
        n_mod: jsPsych.timelineVariable("n_mod"),
        group: jsPsych.timelineVariable("group"),
        noun: jsPsych.timelineVariable("noun"),
        flip: jsPsych.timelineVariable("flip"),
        key_order: jsPsych.timelineVariable("key_order"),
      }
    };

    // create block 3a
    EXPERIMENT.block3a = {
      timeline: [block3_trials, ],
      timeline_variables: DATA.block3a,
      randomize_order: true,
    };

    // create block 3b
    EXPERIMENT.block3b = {
      timeline: [block3_trials, ],
      timeline_variables: DATA.block3b,
      randomize_order: true,
    };
  }

  function block4() { // 24 trials

    // BLOCK 4 ----------------------------------------------------------------
    // One- and two-modifier NP productions:
    // Beginning with 4 non-critical trials (4a), followed by 8 non-critical
    // and 12 critical trials intermixed (4b), totaling 24 trials. The 12 
    // non-critical items are the same one-modifier NPs shown in Block 2.
    // ------------------------------------------------------------------------

    var icons;
    var nicons;
    var nicon;
    var micon;
    var micon1;
    var micon2;
    var flip;
    var iso;
    var group;

    // assign which non-critical trials get flipped images
    assign_flips(8, 4);

    // assign which non-critical trials get isomorphic keyboards
    var orders = jsPsych.randomization.repeat([true, false], [6, 6]);

    // shuffle the non-critical trials before selecting the initial 4 trials
    idxs = jsPsych.randomization.shuffle(idxs.a.concat(idxs.b));

    // production (non-critical 1-modifier NPs; 4a)
    for (let i = 0; i < 4; i++) {
      icons = ONE_MOD_NPS[idxs[i]];
      [nicon, micon] = icons;
      flip = get_flip(micon);
      iso = orders[i];
      DATA.block4a.push({
        stimulus: stim_img(icons2fn(icons), flip),
        answer: icons.join(""),
        keys: keyboard(iso, micon),
        key_order: iso ? "iso" : "non_iso",
        n_mod: 1,
        group: icon2pos[micon],
        noun: lookup[nicon],
        flip: flip,
      });
    }

    // production (non-critical 1-modifier NPs; 4b)
    for (let i = 4; i < idxs.length; i++) {
      icons = ONE_MOD_NPS[idxs[i]];
      [nicon, micon] = icons;
      flip = get_flip(micon);
      iso = orders[i];
      DATA.block4b.push({
        stimulus: stim_img(icons2fn(icons), flip),
        answer: icons.join(""),
        keys: keyboard(iso, micon),
        key_order: iso ? "iso" : "non_iso",
        n_mod: 1,
        group: icon2pos[micon],
        noun: lookup[nicon],
        flip: flip,
      });
    }

    // shuffle and select the nouns for the critical trials 
    nicons = jsPsych.randomization.repeat(noun_icons, [4, 4, 4]);

    // assign which critical trials get flipped images
    assign_flips(4, 8);

    // assign which non-critical trials get isomorphic keyboards
    orders = {
      'adj-num': jsPsych.randomization.repeat([true, false], [2, 2]),
      'adj-dem': jsPsych.randomization.repeat([true, false], [2, 2]),
      'num-dem': jsPsych.randomization.repeat([true, false], [2, 2]),
    };

    // production (critical 2-modifier NPs)
    for (let i = 0; i < mod_pairs.length; i++) {
      icons = [nicons[i]].concat(mod_pairs[i]);
      [nicon, micon1, micon2] = icons;
      flip = get_flip(micon2);
      answer = [icons.join(""), `${nicon}${micon2}${micon1}`];
      group = `${icon2pos[micon1]}-${icon2pos[micon2]}`;
      iso = orders[group].pop();
      DATA.block4b.push({
        stimulus: stim_img(icons2fn(icons), flip),
        keys: keyboard(iso, micon1, micon2),
        key_order: iso ? "iso" : "non_iso",
        answer: answer,
        n_mod: 2,
        group: group,
        noun: lookup[nicon],
        flip: flip,
        on_finish: is_isomorphic,
      });
    }

    // create block 4 trials
    var block4_trials = {
      type: jsPsychProduction,
      stimulus: jsPsych.timelineVariable("stimulus"),
      keys: jsPsych.timelineVariable("keys"),
      answer: jsPsych.timelineVariable("answer"),
      show_feedback: false,
      force_correct_production: false,
      linger_duration: null,
      include_spacebar: false,
      include_counter: true,
      on_finish: jsPsych.timelineVariable("on_finish"),
      css_classes: ["jspsych-production", ],
      data: {
        block: 4,
        n_mod: jsPsych.timelineVariable("n_mod"),
        group: jsPsych.timelineVariable("group"),
        noun: jsPsych.timelineVariable("noun"),
        flip: jsPsych.timelineVariable("flip"),
        key_order: jsPsych.timelineVariable("key_order"),
      }
    };

    // create block 4a
    EXPERIMENT.block4a = {
      timeline: [block4_trials, ],
      timeline_variables: DATA.block4a,
      randomize_order: true,
    };

    // create block 4b
    EXPERIMENT.block4b = {
      timeline: [block4_trials, ],
      timeline_variables: DATA.block4b,
      randomize_order: true,
    };
  }

  // ==========================================================================
  // Define core function to generate blocked trials
  // ==========================================================================

  function generate() {

    // generate the 18 possible one-modifier NPs
    generate_one_mod_NPs();

    // generate blocks
    block1();
    block2();
    block3();
    block4();

    // return trial blocks
    return EXPERIMENT;
  }

  // return core generate function
  return generate;
})();
