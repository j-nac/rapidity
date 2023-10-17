import * as csv from 'jquery-csv';

export default class SubjectData {
    constructor(subject, file) {
        this.subject = subject;
        this.file = file;

        this.init();
    }

    loadSubjectData() {
        this.data = csv.toArrays(this.file);
        this.data.shift()
    }

    getUnits() {
        this.units = Array.from(new Set(this.data.map(a=>a[0]))).sort();
    }

    init() {
        this.loadSubjectData();
        this.getUnits();
    }

    instantiateRun(units) {
        this.selectedUnits = units
        this.instantiateQuestions()
    }
    instantiateQuestions(){
        this.questions = this.data.filter(a=>this.selectedUnits.includes(a[0]))
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    getRandomQuestion() {
        if(this.questions.length === 0){
            this.instantiateQuestions()
        }
        return this.questions.pop()
    }
}