// jshint ignore:start
var m20 = (function() {

  // store jsPsych experiment blocks
  var EXPERIMENT = {
    images: [],
    block2: {},
    block4: {},
  };

  // ==========================================================================
  // Define internal helper variables; the capitalized ones get updated
  // ==========================================================================

  // store trial data associated with each block
  var DATA = {
    block2: [],
    block4: [],
  };

  // set global linger duration
  var linger = 600;

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

  var foils = {p: "d", d: "p", b: "r", r: "b", "2": "3", "3": "2"};

  // ==========================================================================
  // Define internal helper functions
  // ==========================================================================

  // function to map icons to filename
  function icons2fn(arr) {
    return arr.slice().reverse().map(i => lookup[i]).join("-");
  }

  // function to generate image stimulus
  function stim_img(str, flip=false) {
    var src = `../_static/stimuli/${str}.png`;
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

  // ==========================================================================
  // Define functions to generate each experiment block
  // ==========================================================================

  function block2() { // 2 trials
    var icons;
    var nicon;
    var micon;
    var flip;
    var choices;

    // three mugs (madlib)
    icons = ["M", "3"];
    [nicon, micon] = icons;
    choices = ["3", "2"];
    flip = false;
    DATA.block2.push({
      type: jsPsychMadlib,
      img_stimulus: stim_img(icons2fn(icons), flip),
      caption_stimulus: `${nicon} %blank%`,
      choices: choices.map(stim_txt),
      data_choices: choices,
      answer: micon,
      button_html: `<button class="jspsych-btn iconic">%choice%</button>`,
      group: icon2pos[micon],
      noun: lookup[nicon],
      flip: flip,
    });

    // red ball (picture selection)
    icons = ["B", "r"];
    [nicon, micon] = icons;
    choices = [icons, [nicon, foils[micon]]];
    flip = true;
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
      randomize_order: false,
    };
  }

  function block4() { // 2 trials
    var icons;
    var nicons;
    var nicon;
    var micon;
    var micon1;
    var micon2;
    var group;

    // two black feathers
    icons = ["F", "b", "2"];
    [nicon, micon1, micon2] = icons;
    flip = true;
    answer = [icons.join(""), `${nicon}${micon2}${micon1}`];
    group = `${icon2pos[micon1]}-${icon2pos[micon2]}`;
    iso = false;
    DATA.block4.push({
      stimulus: stim_img(icons2fn(icons), flip),
      keys: ['b', 'r', 'M', 'F', 'B', '3', '2', 'd', 'p'],
      key_order: "non_iso",
      answer: answer,
      n_mod: 2,
      group: group,
      noun: lookup[nicon],
      flip: true,
      on_finish: is_isomorphic,
    });

    // that red mug
    icons = ["M", "r", "d"];
    [nicon, micon1, micon2] = icons;
    flip = false;
    answer = [icons.join(""), `${nicon}${micon2}${micon1}`];
    group = `${icon2pos[micon1]}-${icon2pos[micon2]}`;
    iso = true;
    // DATA.block4.push({
    //   stimulus: stim_img(icons2fn(icons), flip),
    //   keys: [ 'd', 'p', 'b', 'r', 'B', 'F', 'M', '3', '2'],
    //   key_order: "iso",
    //   answer: answer,
    //   n_mod: 2,
    //   group: group,
    //   noun: lookup[nicon],
    //   flip: false,
    //   on_finish: is_isomorphic,
    // });

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
      },
    };

    // create block 4
    EXPERIMENT.block4 = {
      timeline: [block4_trials, ],
      timeline_variables: DATA.block4,
      randomize_order: false,
    };
  }

  // ==========================================================================
  // Define core function to generate blocked trials
  // ==========================================================================

  function generate() {

    // generate blocks
    block2();
    block4();

    // return trial blocks
    return EXPERIMENT;
  }

  // return core generate function
  return generate;
})();
