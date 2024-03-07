import * as csv from "jquery-csv";

export default class SubjectData {
  constructor(file) {
    this.file = file;

    this.init();
  }

  loadSubjectData() {
    this.data = csv.toArrays(this.file);
    this.data.shift();
  }

  getUnits() {
    this.units = {}
    for(let i = 0; i < this.data.length; i++){
      if (!(this.data[i][0] in this.units)){
        this.units[this.data[i][0]] = {}
        this.units[this.data[i][0]][this.data[i][1]] = 1
      }
      else if (!(this.data[i][1] in this.units[this.data[i][0]])) {
        this.units[this.data[i][0]][this.data[i][1]] = 1
      }
      else {
        this.units[this.data[i][0]][this.data[i][1]] += 1
      }
    }
  }

  init() {
    this.loadSubjectData();
    this.getUnits();
    this.card_index = 0;
  }

  instantiateRun(units) {
    this.selectedUnits = units;
    this.instantiateQuestions();
  }

  instantiateQuestions() {
    this.questionTemplate = this.data.filter((a) => a[0] in this.selectedUnits && this.selectedUnits[a[0]].includes(a[1]));
    this.resetQuestions()
  }

  resetQuestions() {
    this.questions = [...this.questionTemplate]
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [
        this.questions[j],
        this.questions[i],
      ];
    }
  }

  getRandomQuestion() {
    if (this.questions.length === 0) {
      this.resetQuestions();
    }
    return this.questions.pop();
  }

  getNextQuestion() {
    this.card_index = (this.card_index + 1) % this.questionTemplate.length
    return this.questionTemplate[this.card_index]
  }

  getLastQuestion() {
    this.card_index = (this.card_index - 1) % this.questionTemplate.length
    return this.questionTemplate[this.card_index]
  }
}
