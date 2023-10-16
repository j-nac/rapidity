import * as csv from 'jquery-csv';

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', process.env.PUBLIC_URL + '/data/' + filePath, false);
    xmlhttp.send();
    if (xmlhttp.status === 200) {
        result = xmlhttp.responseText;
    }

    return result;
}

export default class SubjectData {
    constructor(subject, filepath) {
        this.subject = subject;
        this.filepath = filepath;

        this.init();
    }

    loadSubjectData() {
        // why two lines?
        let data = csv.toArrays(loadFile(this.filepath));
        data.shift()
        this.data = data;
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
        console.log()
        return this.questions.pop()
    }
}