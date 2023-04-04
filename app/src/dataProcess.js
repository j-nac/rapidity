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
        let data = csv.toArrays(loadFile(this.filepath));
        this.data = data;
    }

    // This is inefficient. I don't have the energy rn
    getUnits() {
        let units = [];
        for (let i=1; i < this.data.length; i++) {
            if (units.includes(this.data[i][0]) === false) {
                units.push(this.data[i][0]);
            }
        }

        this.units = units.sort();
    }

    init() {
        this.loadSubjectData();
        this.getUnits();
    }

    getRandomQuestion(units) {
        while (true) {
            var question = this.data[Math.floor(Math.random()*this.data.length)];
            if (units.includes(question[0])) {
                return question;
            }
        }
    }
}