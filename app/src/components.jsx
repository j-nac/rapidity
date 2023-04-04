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

export {
    TitleText,
    Button1,
    SubjectTile,
    Checkbox,
    SubjectHeading,
    BackButton,
}