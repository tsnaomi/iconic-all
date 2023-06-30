var jsPsychProduction = (function (jspsych) {
  "use strict";

  const info = {
    name: "production",
    parameters: {
      // The HTML string to be displayed.
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: "Stimulus",
        default: undefined,
      },
      // Array containing the label(s) for the keyboard keys(s).
      keys: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Choices",
        default: undefined,
        array: true,
      },
      // Optional prompt/prefix to appear before the cursor.
      prompt: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Optional prefixal rompt",
        default: "",
      },
      // The correct response(s).
      answer: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Correct answer(s)",
        default: null,
        array: true,
      },
      // If set to true, then the subject will be shown the correct answer
      // giving a response.
      show_feedback: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Show feedback",
        default: false,
      },
      // If set to true, then the subject must click the correct 
      // response button after feedback in order to advance to next trial.
      force_correct_production: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Force correct production",
        default: false,
      },
      // How long to show the trial.
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Trial duration",
        default: null,
      },
      // How long to linger on the correct answer if feedback if shown;
      // this is in addition to any set in addition to trial duration.
      linger_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "Linger duration",
        default: null,
      },
      // If set to true, the keyboard will include a spacebar.
      include_spacebar: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Include spacebar",
        default: true,
      },
      // If set to true, the trial will include a character counter to
      // indicate to the participants how many characters they need to type.
      include_counter: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "Include character counter",
        default: false,
      },
    },
  };

  class ProductionPlugin {
    constructor(jsPsych) {
      jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      // format single answers
      if (typeof trial.answer == "string") {
        trial.answer = [trial.answer, ];
      }
      // display trial
      display_element.innerHTML = compose_display();
      // extract useful elements
      var prompt = display_element.querySelector("#jspsych-production-prompt");
      var line = display_element.querySelector("#jspsych-production-line");
      var keyboard = display_element.querySelector("#jspsych-production-keyboard");
      var keys = keyboard.querySelectorAll(".jspsych-production-key");
      var space = keyboard.querySelector("#jspsych-production-space-key");
      var backspace = keyboard.querySelector("#jspsych-production-backspace-key");
      var submit = display_element.querySelector("#jspsych-production-submit");
      var answer = display_element.querySelector("#jspsych-production-answer");
      var count = display_element.querySelector("#jspsych-production-count");
      // gather the data to store for the trial
      var trial_data = {
          rt: null,
          correct: null,
          stimulus: null,
          response: null,
          answer: null,
          keys: null,
      };
      // start time
      var start_time = performance.now();
      // add event listeners to the keys
      keys.forEach(
        div => div.addEventListener("click", typewriter)
      );
      // add delete, enter, & space keybindings
      document.addEventListener("keydown", bind_keys)
      // add event listener to the submit button
      display_element.querySelector("#jspsych-production-submit").addEventListener("click", process_response);
      // function to compose `display_element` HTML
      function compose_display() {
        // add stimulus
        var trial_html = `<div id="jspsych-production-stimulus">` + trial.stimulus + `</div>`;
        // add feedback div
        if (trial.show_feedback || trial.force_correct_production) {
          trial_html += `<div id="jspsych-production-answer" class="iconic"></div>`;
        }
        // add production line
        trial_html += `
          <div id="jspsych-production-line-container">
            <span id="jspsych-production-prompt" class="iconic">${trial.prompt}</span><span id="jspsych-production-line" class="iconic blink-caret"></span>
          </div>`
        // add keyboard
        if (trial.include_spacebar) {
          trial_html += `
            <div id="jspsych-production-keyboard" class="jspsych-production-keyboard-glow">
              <div id="jspsych-production-keyboard-top" class="iconic">`;
          for (var i = 0; i < trial.keys.length; i++) {
            var key = trial.keys[i];
            trial_html += `<button class="jspsych-production-key" data-key="${key}">${encode_red(key)}</button>`;
          }
          trial_html += `
              </div>
              <div id="jspsych-production-keyboard-bottom">
                <button class="jspsych-production-key" id="jspsych-production-space-key" data-key="&nbsp;">
                  <span class="material-symbols-outlined">space_bar</span>
                </button>
                <button class="jspsych-production-key" id="jspsych-production-backspace-key" data-key="_delete">
                  <span class="material-symbols-outlined">backspace</span>
                </button>
              </div>
            </div>`;
        } else {
          trial_html += `
            <div id="jspsych-production-keyboard" class="iconic jspsych-production-keyboard-glow">`;
          for (var i = 0; i < trial.keys.length; i++) {
            var key = trial.keys[i];
            trial_html += `<button class="jspsych-production-key" data-key="${key}">${encode_red(key)}</button>`;
          }
          trial_html += `
              <button class="jspsych-production-key" id="jspsych-production-backspace-key" data-key="_delete">
                <span class="material-symbols-outlined">backspace</span>
              </button>
            </div>`;
        }
        // add submit button
        trial_html += `
          <button id="jspsych-production-submit" disabled>
            <span class="material-symbols-outlined">done</span>
          </button>`;
        // add character counter
        if (trial.include_counter && (trial.answer_length || trial.answer)) {
          trial.prompt_length = decode_red(trial.prompt).length;
          trial.answer_length = decode_red(trial.answer[0]).length;
          trial_html += `
            <div id="jspsych-production-counter">
              <span id="jspsych-production-count">${trial.prompt_length}</span>/${trial.answer_length + trial.prompt_length}
            </div>`;
        } else {
          trial.include_counter = false;
        }
        return trial_html;
      }
      // function to type response (pre-submit)
      function typewriter(event, key = null) {
        // get character if none was passed in
        if (key === null) {
          key = event.currentTarget.getAttribute("data-key");
        }
        // get current production line & decode
        var text = decode_red(line.textContent);
        // update & encode production line
        if (key === "_delete") {
          text = text.slice(0,-1);
        } else {
          text += key;
        }
        line.innerHTML = encode_red(text);
        // if `trial.include_counter` is true, update the character counter,
        // but only enable the submit button if the correct number of
        // characters has been entered
        if (trial.include_counter) {
          count.innerHTML = trial.prompt_length + text.length;
          if (line.textContent.length == trial.answer_length) {
            // enable submit
            submit.disabled = false;
          } else {
            // disable submit
            submit.disabled = true;
          }
        // otherwise, if `trial.include_counter` is false, enable the submit
        // button if any input has been entered
        } else if (line.textContent.length > 0) {
          // enable submit
          submit.disabled = false;
        } else {
          // disable submit
          submit.disabled = true;
        }
        // remove keyboard glow once the participant begins to use the keyboard
        // & remove blinking caret if any input has been entered
        if (line.textContent.length > 0) {
          keyboard.classList.remove("jspsych-production-keyboard-glow");
          line.classList.remove("blink-caret");
        } else {
          line.classList.add("blink-caret");
        }
      }
      // function to bind delete, enter, & space keys
      function bind_keys(event) {
        // backspace
        if (event.keyCode == 8 || (event.keyCode == 90 && (event.ctrlKey || event.metaKey))) {
          event.preventDefault();
          backspace.click();
        // enter
        } else if (event.keyCode == 13) {
          event.preventDefault();
        // space bar
        } else if (event.keyCode == 32) {
          event.preventDefault();
          if (trial.include_spacebar) {
            space.click();
          }
        } 
      }
      // function to process the response
      function process_response() {
        // measure response time
        var rt = Math.round(performance.now() - start_time);
        // extract participant's production & remove extraneous whitespace
        var response = line.textContent.replace(/\s+/g,' ').trim();
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
        // indicate whether the response is correct
        if (trial.answer) {
          var correct = trial.answer.includes(response);
        }
        // save the initial trial data (collected before feedback & correction)
        if (trial_data.response === null) {
          trial_data = {
            rt: rt,
            correct: correct,
            stimulus: trial.stimulus,
            response: response,
            answer: trial.answer.join(" ~ "),
            keys: trial.keys.join(""),
          }
        }
        // display feedback; otherwise, end trial
        if (trial.answer && (trial.show_feedback || trial.force_correct_production)) {
          display_feedback(response, correct);
        } else {
          end_trial();
        }
      }
      // function to handle feedback to the subject
      function display_feedback(response, correct, timeout = false) {
        // provide feedback
        if (correct) {
          // add correct answer styling
          prompt.classList.add("jspsych-production-correct");
          line.classList.add("jspsych-production-correct");
          // hide answer
          answer.innerHTML = "";
        } else {
          // display correct answer
          if (trial.show_feedback) {
            var display_answer = trial.prompt + trial.answer.join(`<span id="arrow-range" class="material-symbols-outlined">arrow_range</span>` + trial.prompt);
            answer.innerHTML = `
              <span id="jspsych-production-incorrect">${trial.prompt}${encode_red(response)}</span>
              <span class="material-symbols-outlined">trending_flat</span>
              <span id="jspsych-production-correct">${display_answer}</span>`;
          }
          // clear the production line, re-add the blinking caret, & reset the
          // character counter
          if (trial.force_correct_production) {
            line.innerHTML = "";
            line.classList.add("blink-caret");
            if (trial.include_counter) {
              count.innerHTML = 0;
            }
          }
          // disable submit
          submit.disabled = true;
        }
        // disable all trial buttons (keyboard & submit) if the answer is
        // correct, if the trial has timed out, or if the participant isn't
        // forced to correct their production
        if (correct || timeout || !trial.force_correct_production) {
          display_element.querySelectorAll("button").forEach(
            btn => btn.disabled = true
          );
        }
        // linger on correct answer before ending the trial
        if (trial.linger_duration != null && (correct || timeout || !trial.force_correct_production)) {
          jsPsych.pluginAPI.setTimeout(end_trial, trial.linger_duration);
        }
      }
      // function to end trial when it is time
      function end_trial() {
        // remove keybindings
        document.removeEventListener("keydown", bind_keys);
        // clear the display
        display_element.innerHTML = "";
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      }           
      // end trial if a time limit is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(() => {
          display_feedback('', false, true)
        }, trial.trial_duration);
      }
    }
  }
  ProductionPlugin.info = info;

  return ProductionPlugin;

})(jsPsychModule);
