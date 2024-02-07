 // jshint ignore:start
var base = (function() {

  // store non-task jsPsych "bookends" trials
  var EXPERIMENT = {};

  function generate() {

    // proceed button
    var proceed_btn = `<button id="proceed" class="jspsych-btn">%choice%</button>`;
    var proceed = `<span class="function">c</span>`;

    // function to decrement PROGRESS by 1 (for pre-instruction trials)
    function decrement_progress() {
      try {
        PROGRESS -= 1;
      } catch (error) {
        // silently ignore "not defined" ReferenceErrors
      }
    }

    // function to increment N_TRIALS by 1 (for non-experiment trials)
    function increment_trials() {
      try {
        N_TRIALS += 1;
      } catch (error) {
        // silently ignore "not defined" ReferenceErrors
      }
    }

    // preload images
    EXPERIMENT.preload = function(images) {
      // add non-task images
      decrement_progress();
      images.push(...[
        "/_static/images/lesson.png",
        "/_static/images/quiz.png",
        "/_static/images/fireworks.png",
        "/_static/images/earth.png",
      ]);
      // remove duplicates
      images = Array.from(new Set(images));
      return {
        type: jsPsychPreload,
        images: images,
        auto_preload: false,
      };
    };

    // welcome & instructions
    EXPERIMENT.instructions = function(html_page) {
      increment_trials();
      return {
        type: jsPsychHtmlButtonResponse,
        stimulus: html_page,
        choices: [proceed, ],
        button_html: proceed_btn,
        css_classes: ["instructions", ],
      };
    };

    // lesson screen
    EXPERIMENT.lesson = function() {
      increment_trials();
      return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<img src="/_static/images/lesson.png" />`,
        choices: [proceed, ],
        button_html: proceed_btn,
        css_classes: ["lesson", ],
      };
    };

    // quiz screen
    EXPERIMENT.quiz = function() {
      increment_trials();
      return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<img src="/_static/images/quiz.png" />`,
        choices: [proceed, ],
        button_html: proceed_btn,
        css_classes: ["quiz", ],
      };
    };

    // quiz score
    EXPERIMENT.score = function() {
      increment_trials();
      return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
          // display the quiz score to the participants (based on non-critical 
          // items only)
          var trials = jsPsych.data.get().filter({block: 4, ["n_mod"]: 1});
          var correct = trials.filter({correct: true});
          var score = (correct.count() / trials.count()) * 100;
          return `<p>${Math.round(score)}%</p>` +
            `<img src="/_static/images/fireworks.png" />`;
        },
        choices: [proceed, ],
        button_html: proceed_btn,
        css_classes: ["quiz-score", ],
        on_finish: function() {
          // calculate & store the scores on the critical items & non-critical
          // items
          var trials = jsPsych.data.get().filter({correct: true});
          trials = trials.filter({block: 4});
          data.critical_score = trials.filter({["n_mod"]: 2}).count();
          data.non_critical_score = trials.filter({["n_mod"]: 1}).count();
          // calculate & store the percentage of isomorphic responses out of
          // the correct critical responses
          data.percent_isomorphic = trials.filter({isomorphic: true}).count();
          data.percent_isomorphic /= data.critical_score;
          data.percent_isomorphic *= 100;
        },
      };
    };

    // questionnaire
    EXPERIMENT.questionnaire = function(html_page, name, on_load = null) {
      increment_trials();
      return {
        type: jsPsychSurveyHtmlForm,
        html: html_page,
        autofocus: "focus",
        button_label: proceed,
        on_load: on_load,
        data: {
          form: name,
        },
        css_classes: ["questionnaire", ],
      };
    };

    // debrief
    EXPERIMENT.debrief = function(html_page) {
      increment_trials();
      return {
        type: jsPsychHtmlButtonResponse,
        stimulus: html_page,
        choices: [proceed, ],
        button_html: proceed_btn,
        css_classes: ["debrief", ],
      };
    };

    // return non-task trials
    return EXPERIMENT;
  }

  // return core generate function
  return generate;
})();
