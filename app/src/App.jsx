import React from 'react';
import {
    TitleText,
    Button1,
    SubjectTile,
    Checkbox,
    SubjectHeading,
    BackButton,
    QuestionText,
    AnswerBox,
    TimerText,
    ScoreWidget,
} from './components';
import SubjectData from './dataProcess';

const SUBJECTS_FILEPATHS = {'AP Psychology': 'ap-psychology.csv'};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'Landing', // Who needs react-router? I know I don't
            subject: '',
            units: [],

            gameInProgress: false,
            gameMode: '',
            questionUnit: 'UNIT LOADING ERROR',
            questionText: 'TEXT LOADING ERROR',
            questionAnswer: '',
            questionAlt: '',

            correct: 0,
            incorrect: 0,
            total: 0,

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

    getQuestion() {
        var rawQuestion = this.subjectData.getRandomQuestion(this.state.units);
        this.setState({
            questionUnit: rawQuestion[0],
            questionText: rawQuestion[3],
            questionAnswer: rawQuestion[1],
            questionAlt: rawQuestion[2],
        })
    }

    checkAnswer(answer) {
        answer = answer.toLowerCase()
        if (answer === this.state.questionAnswer.toLowerCase() || answer === this.state.questionAlt.toLowerCase()) {
            return true;
        }
        return false;
    }

    onKeyDownHandler(e) {
        if (e.keyCode === 13) {
            if (this.checkAnswer(e.target.value)) {
                e.target.value = '';
                this.setState({correct: this.state.correct+1, total: this.state.total+1});
                this.getQuestion();
            } else {
                e.target.focus();
                e.target.select();
                this.setState({incorrect: this.state.incorrect+1, total: this.state.total+1});
            }
        }
    };

    render() {
        return (
            <div className='App bg-black text-white h-screen w-screen'>
                {this.state.currentPage === 'Landing' ?
                <div className='Landing fixed bg-black h-screen w-screen'>
                    <TitleText />
                    <Button1 label="LET'S PLAY" onClick={() => {this.setState({currentPage: 'Subject-Select'});}} styles='fixed 2xl:top-1/3 top-1/2 left-1/2 2xl:-translate-y-1/3 -translate-y-1/2 -translate-x-1/2 transition hover:bg-white hover:text-black hover:border-white' />
                </div>
                : null}

                {this.state.currentPage === 'Subject-Select' ?
                <div className='Subject-Select fixed bg-black h-screen w-screen'>
                    <div className='flex gap-3 p-10 h-screen overflow-x-scroll overflow-y-hidden items-center '>
                        <SubjectTile subject='AP Psychology' icon='psychology' color='magenta' onClick={() => this.subjectHandler('AP Psychology')} />
                        <SubjectTile subject='AP US History' icon='how_to_vote' color='red' onClick={() => this.subjectHandler('AP US History')} />
                        <SubjectTile subject='AP Language and Composition' icon='edit' color='purple' onClick={() => this.subjectHandler('AP Language and Composition')} />
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
                <div className='Game fixed bg-black h-screen w-screen flex flex-col' onKeyDown={(e) => {this.onKeyDownHandler(e)}}>
                    <div>
                        <BackButton label='Exit game' onClick={() => {this.setState({currentPage: 'Unit-Select'})}} />
                    </div>
                    <div className='bottom-0 flex-1 flex flex-col md:flex-row-reverse gap-3 px-10 pb-10 md:pt-10 justify-center'>
                        <div className='text-center min-w-fit'>
                            <TimerText text='00:00' />
                            <ScoreWidget correct={this.state.correct} incorrect={this.state.incorrect} total={this.state.total} />
                            <Button1 label='get question' onClick={() => {this.getQuestion()}} />
                        </div>
                        <div className='grow flex flex-col max-w-4xl'>
                            <QuestionText text={'[' + this.state.questionUnit + '] ' + this.state.questionText} />
                            <AnswerBox />
                        </div>
                    </div>
                </div>
                : null}
            </div>)
        };
    }

export default App;
