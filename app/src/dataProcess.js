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
        this.units[this.data[i][0]] = [this.data[i][1]]
      }
      else if (!(this.units[this.data[i][0]].includes(this.data[i][1]))) {
        this.units[this.data[i][0]].push(this.data[i][1])
      }
    }
  }

  init() {
    this.loadSubjectData();
    this.getUnits();
  }

  instantiateRun(units) {
    this.selectedUnits = units;
    this.instantiateQuestions();
  }

  instantiateQuestions() {
    this.questions = this.data.filter((a) => a[0] in this.selectedUnits && this.selectedUnits[a[0]].includes(a[1]));
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
      this.instantiateQuestions();
    }
    return this.questions.pop();
  }
}
