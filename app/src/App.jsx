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
    Link,
    UploadArea
} from './components';
import SubjectData from './dataProcess';

import {
    MdOutlinePsychology,
    MdGavel,
    MdOutlinedFlag,
    MdOutlineMode,
    MdCode,
    MdArrowCircleUp,
    MdOutlineLocalFireDepartment,
    MdOutlineTimer,
    MdSelfImprovement,
} from "react-icons/md";


const SUBJECTS_FILEPATHS = {'AP Psychology': 'ap-psychology.csv', 'AP Government': 'ap-government.csv'};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'Landing', // Who needs react-router? I know I don't
            subject: '',
            units: [],

            gameState: 0,
            gameMode: '',
            time: 0,
            displayTime: '00:00',

            questionUnit: 'UNIT LOADING ERROR',
            questionText: 'TEXT LOADING ERROR',
            questionAnswer: '',

            alertText:'',

            correct: 0,
            incorrect: 0,
            total: 0,
        };
        this.file = null;
        this.subjectData = null;
        this.timer = null;
        this.updateTime = this.updateTime.bind(this);
    }

    loadServerFile(filePath) {
        var result = null;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', process.env.PUBLIC_URL + '/data/' + filePath, false);
        xmlhttp.send();
        if (xmlhttp.status === 200) {
            result = xmlhttp.responseText;
        }
        return result;
    }
    setLocalFile({target}){
        target.files[0].text().then((t)=>{
            this.text = t
        }, ()=>{
            target.value = ""
        })
    }
    loadLocalData(){
        this.setState({currentPage: 'Unit-Select', subject: "Custom Flashcards"})
        this.subjectData = new SubjectData(this.text)
    }
    loadSubjectData(subject) {
        this.subjectData = new SubjectData(this.loadServerFile(SUBJECTS_FILEPATHS[subject]))
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
        this.setState({
            alertText: this.state.questionAnswer.split(";")[0].trim(),
        })
        var rawQuestion = this.subjectData.getRandomQuestion();
        this.setState({
            questionUnit: rawQuestion[0],
            questionText: rawQuestion[2],
            questionAnswer: rawQuestion[1],
        })
    }

    levenshtein(text0, text1) {
        let levenDist = Array(text0.length + 1).fill().map(() => Array(text1.length + 1).fill(0));
        for(let i = 1; i <= text0.length; i ++){
            levenDist[i][0] = i
        }
        for(let j = 1; j <= text1.length; j ++){
            levenDist[0][j] = j
        }
        for(let i = 1; i <= text0.length; i ++){
            for(let j = 1; j <= text1.length; j ++){
                levenDist[i][j] = Math.min(levenDist[i - 1][j] + 1, levenDist[i][j-1] + 1, levenDist[i-1][j-1] + (text0[i - 1]===text1[j - 1]?0:1))
            }
        }
        return levenDist[text0.length][text1.length]

    }

    checkAnswer(answer) {
        answer = answer.toLowerCase()
        if (this.state.questionAnswer.toLowerCase().split(";").some(a=>this.levenshtein(a.trim(), answer.trim()) < answer.length/5)) {
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
        this.subjectData.instantiateRun(this.state.units);
        this.getQuestion();
        if (this.state.gameMode === 'Zen') {
            this.setState({gameState: 1});
            return
        }

        if (this.state.gameMode === 'Rapid') {
            this.setState({time: 60, displayTime: '01:00'});
        } else if (this.state.gameMode === 'Timed') {
            this.setState({time: 180, displayTime: '03:00'});
        }
        this.timer = setInterval(this.updateTime, 1000);
        this.setState({gameState: 1});
    }

    updateTime() {
        if (this.state.time === 0) {
            clearInterval(this.timer);
            this.setState({gameState: 2});
            return
        }
        const newTime = this.state.time-1;
        const minutes = ((newTime-(newTime%60))/60).toString().padStart(2, '0');
        const seconds = (newTime%60).toString().padStart(2, '0');
        this.setState({time: newTime, displayTime: minutes+':'+seconds});
    }

    resetGame() {
        this.setState({
            gameState: 0, // 0 = start, 1 = play, 2 = end
            time: 0,
            displayTime: '00:00',

            questionUnit: 'UNIT LOADING ERROR',
            questionText: 'TEXT LOADING ERROR',
            questionAnswer: '',

            alertText: '',

            correct: 0,
            incorrect: 0,
            total: 0,
        });
        clearInterval(this.timer);
    }
    render() {
        return (
            <div className='App bg-black text-white h-screen w-screen relative'>
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
                        <SubjectTile subject='AP Government' icon={<MdGavel />} styles='bg-blue lg:bg-transparent hover:lg:bg-blue lg:text-blue hover:lg:text-white' onClick={() => this.subjectHandler('AP Government')} />
                        <SubjectTile subject='AP Psychology' icon={<MdOutlinePsychology />} styles='bg-magenta lg:bg-transparent hover:lg:bg-magenta lg:text-magenta hover:lg:text-white' onClick={() => this.subjectHandler('AP Psychology')} />
                        <SubjectTile subject='Custom Flashcards' icon={<MdArrowCircleUp />} styles='bg-red lg:bg-transparent hover:lg:bg-red lg:text-red hover:lg:text-white' onClick={() => {this.setState({currentPage: 'Loader'})}} />
                        {/*<SubjectTile subject='AP US History' icon={<MdOutlinedFlag />} styles='bg-red lg:bg-transparent hover:lg:bg-red lg:text-red hover:lg:text-white' onClick={() => this.subjectHandler('AP US History')} />
                        <SubjectTile subject='AP Language and Composition' icon={<MdOutlineMode />} styles='bg-purple lg:bg-transparent hover:lg:bg-purple lg:text-purple hover:lg:text-white' onClick={() => this.subjectHandler('AP Language and Composition')} />
                        <SubjectTile subject='AP Computer Science A' icon={<MdCode />} styles='bg-green lg:bg-transparent hover:lg:bg-green lg:text-green hover:lg:text-white' onClick={() => this.subjectHandler('AP Computer Science A')} />*/}
                    </div>
                </div>
                : null}
                

                {this.state.currentPage === 'Loader' ?
                <div className='Game-Mode-Select fixed bg-black h-screen w-screen flex flex-col'>
                    <div>
                        <BackButton label='Back' onClick={() => {this.setState({currentPage: 'Subject-Select'})}} />
                    </div>
                    <div className='flex flex-col h-screen w-screen justify-between items-center my-12'>
                        <UploadArea change={this.setLocalFile.bind(this)}/>
                        <Link href={process.env.PUBLIC_URL + "/data/" + SUBJECTS_FILEPATHS["AP Government"]} text="Click to view an example"/>
                        <div>
                            <Button1 label='Continue' onClick={() => this.loadLocalData() } styles='mt-3 transition hover:bg-white hover:text-black hover:border-white' />
                        </div>
                    </div>
                </div>
                : null}

                {this.state.currentPage === 'Unit-Select' ?
                <div className='Unit-Select fixed bg-black h-screen w-screen overflow-scroll'>
                    <BackButton label='Back to subjects' onClick={() => {this.setState({currentPage: 'Subject-Select', units: []})}} />

                    <div className='ml-10'>
                        <SubjectHeading text={this.state.subject} />
                        {this.subjectData.units.map((unit, index, arr) => <Checkbox name={unit} id={arr[index]} onClick={(e) => this.checkboxClick(e)} />)}
                        <Button1 label='Continue' onClick={() => this.state.units.length > 0?this.setState({currentPage: 'Game-Mode-Select'}):0 } styles='mt-3 transition hover:bg-white hover:text-black hover:border-white' />
                    </div>

                </div>
                : null}

                {this.state.currentPage === 'Game-Mode-Select' ?
                <div className='Game-Mode-Select fixed bg-black h-screen w-screen flex flex-col'>
                    <div>
                        <BackButton label='Back' onClick={() => {this.setState({currentPage: 'Unit-Select'})}} />
                    </div>
                    <div className='grow flex flex-col lg:flex-row gap-3 p-10 h-full overflow-x-scroll overflow-y-hidden items-center place-content-center'>
                        <GameModeSelectCard subject='Rapid' icon={<MdOutlineLocalFireDepartment />} styles='bg-dark-magenta lg:bg-transparent hover:lg:bg-dark-magenta lg:text-dark-magenta hover:lg:text-white' onClick={() => {this.setState({gameMode: 'Rapid', currentPage: 'Game'});}} />
                        <GameModeSelectCard subject='Timed' icon={<MdOutlineTimer />} styles='bg-dark-orange lg:bg-transparent hover:lg:bg-dark-orange lg:text-dark-orange hover:lg:text-white' onClick={() => {this.setState({gameMode: 'Timed', currentPage: 'Game'});}} />
                        <GameModeSelectCard subject='Zen' icon={<MdSelfImprovement />} styles='bg-dark-azure lg:bg-transparent hover:lg:bg-dark-azure lg:text-dark-azure hover:lg:text-white' onClick={() => {this.setState({gameMode: 'Zen', currentPage: 'Game'});}} />
                    </div>
                </div>
                : null}

                {this.state.currentPage === 'Game' ?
                <div className='Game fixed bg-black h-screen w-screen flex flex-col' onKeyDown={(e) => {this.onKeyDownHandler(e)}}>
                    {this.state.gameState===0 ?
                    <div className='fixed h-full w-full bg-black'>
                        <Button1 label='START' onClick={() => {this.startGame()}} styles='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition hover:bg-white hover:text-black hover:border-white' />
                    </div>
                    : null}
                    {this.state.gameState === 2 ?
                    <div className='fixed h-full w-full bg-black'>
                        <div className='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                            <ScoreWidget correct={this.state.correct} incorrect={this.state.incorrect} total={this.state.total} />
                            <h1 className='text-4xl'>{this.state.subject}</h1>
                            {this.state.units.map((unit) => <li className='text-2xl'>{unit}</li>)}
                            <div>
                                <Button1 label='Retry' onClick={() => {this.resetGame();}} styles='w-full mt-2 lg:w-auto transition hover:bg-white hover:text-black hover:border-white' />
                                <Button1 label='Back' onClick={() => {this.resetGame(); this.setState({currentPage: 'Game-Mode-Select'});}} styles='w-full mt-2 lg:w-auto lg:ml-2 transition hover:bg-white hover:text-black hover:border-white' />
                                <Button1 label='Quit' onClick={() => {this.resetGame(); this.setState({currentPage: 'Landing', subject: '', units: [], gameMode: ''});}} styles='w-full mt-2 lg:w-auto lg:ml-2 transition hover:bg-white hover:text-black hover:border-white' />
                            </div>
                        </div>
                    </div>
                    : null}
                    <div>
                        <BackButton label='Exit game' onClick={() => {this.resetGame(); this.setState({currentPage: 'Game-Mode-Select'});}} />
                    </div>
                    <div className='bottom-0 flex-1 flex flex-col md:flex-row-reverse gap-3 px-10 pb-10 md:pt-10 justify-center'>
                        <div className='text-center min-w-fit'>
                            {this.state.gameMode !== 'Zen' ?
                            <TimerText text={this.state.displayTime} />
                            : null}
                            <ScoreWidget correct={this.state.correct} incorrect={this.state.incorrect} total={this.state.total} />
                            <Button1 label='Skip' onClick={() => {this.getQuestion()}} styles='w-full transition hover:bg-white hover:text-black hover:border-white' />
                        </div>
                        <div className='grow flex flex-col max-w-4xl'>
                            <QuestionText text={'[' + this.state.questionUnit + '] ' + this.state.questionText} />
                            <AnswerBox />
                        </div>
                        <div className='absolute bottom-0 mx-auto'>{this.state.alertText}</div>
                    </div>
                </div>
                : null}
            </div>)
        };
    }

export default App;
