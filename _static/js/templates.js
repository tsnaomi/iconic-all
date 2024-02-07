// jshint ignore:start
var templates = (function() {

  // store static HTML templates
  var TEMPLATES = {}

  // welcome & instructions (welp)
  TEMPLATES.instructions = `
    <h1>Welcome!</h1>
    <p>
      Today, you will be testing a new language learning app, where you will be taught a pretend pictographic language.
      You will complete one lesson within the app:
    </p>
    <table>
      <tr>
        <td><img src="./_static/images/lesson.png" /></td>
        <td>
          The first half of the lesson will cover basic vocabulary and phrases.
          <br/>
          <strong class="purple">BEWARE!</strong>
          The trickiest pictograms will be <span class='iconic'>p</span> <b>"<em>this</em>"</b> and <span class='iconic'>d</span> <b>"<em>that</em>"</b>.
        </td>
      </tr>
      <tr>
        <td><img src="./_static/images/quiz.png" /></td>
        <td>
          The second half of the lesson will quiz your ability to use these vocabulary in longer phrases.
          Afterwards, you will see your quiz score!
        </td>
      </tr>
    </table>
    <p>The lesson will be followed by a brief questionnaire.</p>
  `;

  // questionnaire - lexicon translation
  TEMPLATES.lexicon = `
    <div id="lexicon">
      <p>How would you translate the following into English?</p>
      <table>
        <tr>
          <td class="lexeme"><span class="iconic">B</span></td>
          <td class="translate"><input type="text" name="B" id="focus"/></td>
          <td class="lexeme"><span class="iconic">F</span></td>
          <td class="translate"><input type="text" name="F"/></td>
        </tr>
        <tr>
          <td class="lexeme"><span class="iconic">M</span></td>
          <td class="translate"><input type="text" name="M"/></td>
          <td class="lexeme"></td>
          <td class="translate"></td>
        </tr>
        <tr>
          <td class="lexeme"><span class="iconic">b</span></td>
          <td class="translate"><input type="text" name="b"/></td>
          <td class="lexeme"><span class="iconic iconic-red">r</span></td>
          <td class="translate"><input type="text" name="r"/></td>
        </tr>
        <tr>
          <td class="lexeme"><span class="iconic">2</span></td>
          <td class="translate"><input type="text" name="2"/></td>
          <td class="lexeme"><span class="iconic">3</span></td>
          <td class="translate"><input type="text" name="3"/></td>
        </tr>
        <tr>
          <td class="lexeme"><span class="iconic">p</span></td>
          <td class="translate"><input type="text" name="p"/></td>
          <td class="lexeme"><span class="iconic">d</span></td>
          <td class="translate"><input type="text" name="d"/></td>
        </tr>
      </table>
    </div>
  `;

  // questionnaire - phrase translation
  TEMPLATES.phrases = `
    <div id="phrases">
      <div>
        <p>How would you translate the following into <b>English sentences</b>?</p>
        <p>For example, <span class='iconic example'>Mb</span> might translate to <i>black mug</i>.</p>
      </div>
      <div>
        <p class="iconic">Bp</p>
        <input id="focus" type="text" name="np1"/>
      </div>
      <div>
        <p class="iconic">F<span class="iconic-red">r</span>2d</p>
        <input id="focus" type="text" name="np2"/>
      </div>
    </div>
  `;

  // questionnaire - strategies
  TEMPLATES.strategies = `
    <div id="strategies">
      <div>
        <p>What strategies, if any, did you use during the <strong>first half of the lesson</strong>?</p>
        <textarea id="focus" name="lesson"></textarea>
      </div>
      <div>
        <p>
          What strategies, if any, did you use during <strong>the quiz</strong>?
          <br/>
          How did you go about ordering <span class="iconic iconic-red">r</span>, <span class="iconic">b</span>, <span class="iconic">2</span>, <span class="iconic">3</span>, <span class="iconic">p</span>, and <span class="iconic">d</span>?
        </p>
        <textarea name="quiz"></textarea>
      </div>
    </div>
  `;

  // questionnaire - verbalization
  TEMPLATES.verbal = `
    <div id="verbalization">
      <div>
        <p class="jspsych-survey-likert-statement">
          How often did you say the symbols <strong>in your head</strong> while completing the study?
        </p>
        <ul class="jspsych-survey-likert-opts" data-name="likert-head" data-radio-group="Q1">
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-head" value="0">
                Not at all
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-head" value="1">
                Rarely
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-head" value="2">
                Sometimes
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-head" value="3">
                Frequently
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-head" value="4">
                Very frequently
            </label>
          </li>
        </ul>
      </div>
      <div>
        <p class="jspsych-survey-likert-statement">
          How often did you say the symbols <strong>out loud</strong> while completing the study?
        </p>
        <ul class="jspsych-survey-likert-opts" data-name="likert-aloud" data-radio-group="Q0">
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-aloud" value="0">
              Not at all
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-aloud" value="1">
              Rarely
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-aloud" value="2">
              Sometimes
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-aloud" value="3">
              Frequently
            </label>
          </li>
          <li>
            <label class="jspsych-survey-likert-opt-label">
              <input type="radio" name="likert-aloud" value="4">
              Very frequently
            </label>
          </li>
        </ul>
      </div>
      <div>
        <p class="jspsych-survey-likert-statement">
          If you answered at least "rarely" above:</br>In what languages did you say the symbols, whether out loud or in your head?
        </p>
        <input type="text" name="languages"/>
      </div>
    </div>
  `;

  // questionnaire - language history
  TEMPLATES.languages = `
    <div id="languages">
      <div>
        <p>
          Please list the languages you know or have studied in the table below.
          <br/>
          For each language, select your level of proficiency in understanding and speaking the language (or signing the language in the case of a sign language).
          <br/>
          <small>Leave fields <em>blank</em> if not applicable.</small>
        </p>
        <table>
          <thead>
            <tr>
              <td><b>Language</b></td>
              <td><b>Reading Comprehension</b></td>
              <td><b>Spoken/Sign Comprehension</b></td>
              <td><b>Speaking/Signing</td>
            </tr>
          </thead>
          <tr>
            <td>
              <input id="focus" type="text" name="l1" placeholder="Language 1"/>
            </td>
            <td>
              <select name="l1-reading">
                <option selected value> -- select a number -- </option>
                <option value="na">n/a - no writing system</option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l1-comprehension">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l1-speaking">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" name="l2" placeholder="Language 2"/>
            </td>
            <td>
              <select name="l2-reading">
                <option selected value> -- select a number -- </option>
                <option value="na">n/a - no writing system</option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l2-comprehension">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l2-speaking">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" name="l3" placeholder="Language 3"/>
            </td>
            <td>
              <select name="l3-reading">
                <option selected value> -- select a number -- </option>
                <option value="na">n/a - no writing system</option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l3-comprehension">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l3-speaking">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" name="l4" placeholder="Language 4"/>
            </td>
            <td>
              <select name="l4-reading">
                <option selected value> -- select a number -- </option>
                <option value="na">n/a - no writing system</option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l4-comprehension">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l4-speaking">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" name="l5" placeholder="Language 5"/>
            </td>
            <td>
              <select name="l5-reading">
                <option selected value> -- select a number -- </option>
                <option value="na">n/a - no writing system</option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l5-comprehension">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
            <td>
              <select name="l5-speaking">
                <option selected value> -- select a number -- </option>
                <option value="0">0 - none</option>
                <option value="1">1 - very low</option>
                <option value="2">2 - low</option>
                <option value="3">3 - fair</option>
                <option value="4">4 - slightly less than adequate</option>
                <option value="5">5 - adequate</option>
                <option value="6">6 - slightly more than adequate</option>
                <option value="7">7 - good</option>
                <option value="8">8 - very good</option>
                <option value="9">9 - excellent</option>
                <option value="10">10 - perfect</option>
              </select>
            </td>
          </tr>
        </table>
      </div>
      <div>
        <p>
          Are there any other details you would like to share about your experiences with the above languages?
          For example, in what contexts did you learn them?
          Do you use them regularly with friends and family?
        </p>
        <textarea name="lang-hist"></textarea>
      </div>
    </div>
  `;

  // debriefing & disclosure
  TEMPLATES.debrief = `
    <h1>Thank you for participating!</h1>
    <img src="./_static/images/earth.png" />
    <p>
      <strong>Disclosure</strong>: This study did not involve testing a real language learning app. The exercises were designed to investigate your relative ordering preferences for <span class="iconic iconic-red">r</span>, <span class="iconic">b</span>, <span class="iconic">2</span>, <span class="iconic">3</span>, <span class="iconic">p</span>, and <span class="iconic">d</span>. During the quiz, questions appeared where a noun might be written with more than one of these symbols (e.g., <span class="iconic">Bb2</span> or <span class="iconic">B2b</span>). These questions were <em>not</em> included in the calculation of your quiz score, since there was no one correct answer.
    </p>
  `;

  // return templates
  return TEMPLATES;
});
