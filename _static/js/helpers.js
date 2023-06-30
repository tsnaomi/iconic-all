function encode_red(text) {
  return text.replace(/r/g, `<span class="iconic-red">r</span>`)
}

function decode_red(text) {
  return text.replace(`<span class="iconic-red">r</span>`, /r/g)
}

function random_indices(len) {
  return jsPsych.randomization.shuffle([...Array(len).keys()]);
}

function shuffle_together(x, y) {
  var _x = [];
  var _y = [];
  random_indices(x.length).forEach(i => {
    _x.push(x[i]);
    _y.push(y[i]);
  })
  return [_x, _y];
}

function is_isomorphic(data = {}) {
  if (data.correct) {
    var answers = data.answer.split(' ~ ');
    if (answers.length == 4) {
      data.isomorphic = answers.slice(0, 2).includes(data.response);
    } else {
      data.isomorphic = answers[0] == data.response;
    }
  }
}

function update_progress_bar() {
  PROGRESS += 1;
  jsPsych.setProgressBar(PROGRESS / N_TRIALS);
}
