import React from 'react';
import * as csv from 'jquery-csv'

const SUBJECTS_FILEPATHS = {'AP Psychology': 'ap-psychology.csv'};

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

class SubjectData {
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

const TitleText = () => {
    return <h1 className='text-title absolute bottom-0 w-screen'><span className='text-dark-magenta'>Rapid</span>ity</h1>
}

const Button1 = ({label, onClick, styles}) => {
    return <button className={'text-2xl border-2 px-7 py-2 ' + styles} onClick={onClick}>{label}</button>
}

const SubjectTile = ({subject, onClick, styles}) => {
    return <button className={'text-4xl border-2 w-80 h-80 p-5 flex-none ' + styles} onClick={onClick}>{subject}</button>
}

const Checkbox = ({name, id, onClick}) => {
    return <>
        <input type="checkbox" id={id} name={name} value={name} onClick={onClick} className='' />
        <label for={id}>{name}</label><br />
    </>
}

const SubjectHeading = ({text}) => {
    return <h1 className='text-5xl relative my-5'>{text}</h1>
}

const BackButton = ({label, onClick}) => {
    return <button className='text-xl p-2' onClick={onClick}><span className='material-symbols-outlined text-xl align-middle'>arrow_back</span> {label}</button>
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'Landing', // Who needs react-router? I know I don't
            subject: '',
            units: [],

            gameMode: '',
        };
        this.subjectData = null;
    }

    loadSubjectData(subject) {
        this.subjectData = new SubjectData(subject, SUBJECTS_FILEPATHS[subject])
    }

    subjectHandler(subject) {
        this.setState({currentPage: 'Unit-Select', subject: subject})

        // I enter subject into this as well because I don't trust setState to change it in time
        this.loadSubjectData(subject);
    }

    checkboxClick(e) {
        if (e.target.checked) {
            this.state.units.push(e.target.value);
            this.setState({units: this.state.units});
        } else {
            const result = this.state.units.filter(i => i !== e.target.value);
            this.setState({units: result});
        }
    }

    render() {
        return (
            <div className='App bg-black text-white h-screen w-screen'>
                {this.state.currentPage === 'Landing' ?
                <div className='Landing fixed bg-black h-screen w-screen'>
                    <TitleText />
                    <Button1 label="LET'S PLAY" onClick={() => {this.setState({currentPage: 'Subject-Select'});}} styles='fixed top-1/3 left-1/2 -translate-y-1/3 -translate-x-1/2' />
                </div>
                : null}

                {this.state.currentPage === 'Subject-Select' ?
                <div className='Subject-Select fixed bg-black h-screen w-screen'>
                    <div className='flex flex-wrap gap-3 p-10 justify-center content-center h-screen'>
                        <SubjectTile subject='AP Psychology' onClick={() => this.subjectHandler('AP Psychology')} styles='bg-magenta' />
                        <SubjectTile subject='AP US History' onClick={() => this.subjectHandler('AP US History')} styles='bg-red' />
                        <SubjectTile subject='AP Language and Composition' onClick={() => this.subjectHandler('AP Language and Composition')} styles='bg-purple' />
                    </div>
                </div>
                : null}

                {this.state.currentPage === 'Unit-Select' ?
                <div className='Unit-Select fixed bg-black h-screen w-screen'>
                    <BackButton label='Back to subjects' onClick={() => {this.setState({currentPage: 'Subject-Select', subject: ''})}} />

                    <div className='ml-10'>
                        <SubjectHeading text={this.state.subject} />
                        {this.subjectData.units.map((unit, index, arr) => <Checkbox name={unit} id={arr[index]} onClick={(e) => this.checkboxClick(e)} />)}
                        <Button1 label='START' onClick={() => this.setState({currentPage: 'Game'})} />
                    </div>

                </div>
                : null}

                {this.state.currentPage === 'Game' ?
                <div className='Game fixed bg-black h-screen w-screen'>

                </div>
                : null}
            </div>)
        };
    }

export default App;
