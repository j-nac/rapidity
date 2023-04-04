import React from 'react';

const TitleText = () => {
    return <h1 className='text-title absolute bottom-0 w-screen'><span className='text-dark-magenta'>Rapid</span>ity</h1>
}

const Button1 = ({label, onClick, styles}) => {
    return <button className={'text-2xl border-2 px-7 py-2 ' + styles} onClick={onClick}>{label}</button>
}

const SubjectTile = ({subject, onClick, styles}) => {
    return <button className={'text-4xl border-2 w-80 h-80 p-5 flex-none ' + styles} onClick={onClick}>{subject}</button>
}

const Checkbox = ({name, id, value}) => {
    return <>
        <input type="checkbox" id={id} name={name} value={value} />
        <label for={id}> I have a boat</label>
    </>
}

const SubjectHeading = ({text}) => {
    return <h1 className='text-5xl relative my-5 ml-10'>{text}</h1>
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
    };

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
                        <SubjectTile subject='AP Psychology' onClick={() => {this.setState({currentPage: 'Unit-Select', subject: 'AP Psychology'})}} styles='bg-magenta' />
                        <SubjectTile subject='AP US History' onClick={() => {this.setState({currentPage: 'Unit-Select', subject: 'AP US History'})}} styles='bg-red' />
                        <SubjectTile subject='AP Language and Composition' onClick={() => {this.setState({currentPage: 'Unit-Select', subject: 'AP Language and Composition'})}} styles='bg-purple' />
                    </div>
                </div>
                : null}

                {this.state.currentPage === 'Unit-Select' ?
                <div className='Unit-Select fixed bg-black h-screen w-screen'>
                    <BackButton label='Back to subjects' onClick={() => {this.setState({currentPage: 'Subject-Select', subject: ''})}} />
                    <SubjectHeading text={this.state.subject} />
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
