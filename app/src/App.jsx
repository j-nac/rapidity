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
    GameModeSelectCard,
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

            showStartGame: true,
            showGameOver: false,
            gameMode: '',
            time: 0,
            displayTime: '00:00',

            questionUnit: 'UNIT LOADING ERROR',
            questionText: 'TEXT LOADING ERROR',
            questionAnswer: '',
            questionAlt: '',

            correct: 0,
            incorrect: 0,
            total: 0,
        };
        this.subjectData = null;
        this.timer = null;
        this.updateTime = this.updateTime.bind(this);
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

    startGame() {
        this.getQuestion();
        if (this.state.gameMode === 'Rapid') {
            this.setState({time: 60, displayTime: '01:00'});
        } else if (this.state.gameMode === 'Timed') {
            this.setState({time: 180, displayTime: '03:00'});
        }
        this.timer = setInterval(this.updateTime, 1000);
        this.setState({showStartGame: false});
    }

    updateTime() {
        if (this.state.time === 0) {
            clearInterval(this.timer);
            this.setState({showGameOver: true});
            return
        }
        const newTime = this.state.time-1;
        const minutes = ((newTime-(newTime%60))/60).toString().padStart(2, '0');
        console.log(minutes);
        const seconds = (newTime%60).toString().padStart(2, '0');
        this.setState({time: newTime, displayTime: minutes+':'+seconds});

    }

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
                    <div className='flex gap-3 p-10 h-screen overflow-x-scroll overflow-y-hidden items-center'>
                        {/* I would adjust tile color more cleanly but for some reason the styles don't update if I just try to add the color string and concatenate */}
                        <SubjectTile subject='AP Psychology' icon='psychology' styles='bg-magenta lg:bg-transparent hover:lg:bg-magenta lg:text-magenta hover:lg:text-white' onClick={() => this.subjectHandler('AP Psychology')} />
                        <SubjectTile subject='AP US History' icon='flag' styles='bg-red lg:bg-transparent hover:lg:bg-red lg:text-red hover:lg:text-white' onClick={() => this.subjectHandler('AP US History')} />
                        <SubjectTile subject='AP Language and Composition' icon='edit' styles='bg-purple lg:bg-transparent hover:lg:bg-purple lg:text-purple hover:lg:text-white' onClick={() => this.subjectHandler('AP Language and Composition')} />
                        <SubjectTile subject='AP Computer Science A' icon='code' styles='bg-green lg:bg-transparent hover:lg:bg-green lg:text-green hover:lg:text-white' onClick={() => this.subjectHandler('AP Computer Science A')} />
                    </div>
                </div>
                : null}

                {this.state.currentPage === 'Unit-Select' ?
                <div className='Unit-Select fixed bg-black h-screen w-screen'>
                    <BackButton label='Back to subjects' onClick={() => {this.setState({currentPage: 'Subject-Select'})}} />

                    <div className='ml-10'>
                        <SubjectHeading text={this.state.subject} />
                        {this.subjectData.units.map((unit, index, arr) => <Checkbox name={unit} id={arr[index]} onClick={(e) => this.checkboxClick(e)} />)}
                        <Button1 label='Continue' onClick={() => this.setState({currentPage: 'Game-Mode-Select'})} styles='mt-3 transition hover:bg-white hover:text-black hover:border-white' />
                    </div>

                </div>
                : null}

                {this.state.currentPage === 'Game-Mode-Select' ?
                <div className='Game-Mode-Select fixed bg-black h-screen w-screen flex flex-col'>
                    <div>
                        <BackButton label='Back' onClick={() => {this.setState({currentPage: 'Unit-Select'})}} />
                    </div>
                    <div className='grow flex flex-col lg:flex-row gap-3 p-10 h-full overflow-x-scroll overflow-y-hidden items-center place-content-center'>
                        <GameModeSelectCard subject='Rapid' icon='bolt' styles='bg-dark-magenta lg:bg-transparent hover:lg:bg-dark-magenta lg:text-dark-magenta hover:lg:text-white' onClick={() => {this.setState({gameMode: 'Rapid', currentPage: 'Game'});}} />
                        <GameModeSelectCard subject='Timed' icon='timer' styles='bg-dark-orange lg:bg-transparent hover:lg:bg-dark-orange lg:text-dark-orange hover:lg:text-white' onClick={() => {this.setState({gameMode: 'Timed', currentPage: 'Game'});}} />
                        <GameModeSelectCard subject='Zen' icon='self_improvement' styles='bg-dark-azure lg:bg-transparent hover:lg:bg-dark-azure lg:text-dark-azure hover:lg:text-white' onClick={() => {this.setState({gameMode: 'Zen', currentPage: 'Game'});}} />
                    </div>
                </div>
                : null}

                {this.state.currentPage === 'Game' ?
                <div className='Game fixed bg-black h-screen w-screen flex flex-col' onKeyDown={(e) => {this.onKeyDownHandler(e)}}>
                    {this.state.showStartGame ?
                    <div className='fixed h-full w-full bg-black'>
                        <Button1 label='START' onClick={() => {this.startGame()}} styles='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition hover:bg-white hover:text-black hover:border-white' />
                    </div>
                    : null}
                    {this.state.showGameOver ?
                    <div className='fixed h-full w-full bg-black'>
                        <div className='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                            <ScoreWidget correct={this.state.correct} incorrect={this.state.incorrect} total={this.state.total} />
                            <h1 className='text-4xl'>{this.state.subject}</h1>
                            <ul className='list-disc'>
                                {this.state.units.map((unit) => <li className='text-2xl'>{unit}</li>)}
                            </ul>
                            <div>
                                <Button1 label='Retry' styles='w-full mt-2 lg:w-auto transition hover:bg-white hover:text-black hover:border-white' />
                                <Button1 label='Back' styles='w-full mt-2 lg:w-auto lg:ml-2 transition hover:bg-white hover:text-black hover:border-white' />
                                <Button1 label='Quit' styles='w-full mt-2 lg:w-auto lg:ml-2 transition hover:bg-white hover:text-black hover:border-white' />
                            </div>
                        </div>
                    </div>
                    : null}
                    <div>
                        <BackButton label='Exit game' onClick={() => {this.setState({currentPage: 'Game-Mode-Select'})}} />
                    </div>
                    <div className='bottom-0 flex-1 flex flex-col md:flex-row-reverse gap-3 px-10 pb-10 md:pt-10 justify-center'>
                        <div className='text-center min-w-fit'>
                            <TimerText text={this.state.displayTime} />
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
