import { useEffect, useRef, useState } from 'react';
import './home.css';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';

let simple_words = [
    "cat", "dog", "tree", "car", "book", "house", "cup", "star", "fish",
    "apple", "ball", "bird", "chair", "hat", "shoe", "milk", "key", "pen",
    "sun", "moon", "cake", "bread", "clock", "table", "phone", "water",
    "flower", "grass", "boat", "train", "frog", "lamp", "box", "door",
    "wind", "rain", "snow", "hill", "river", "beach", "rock", "cloud",
    "mouse", "horse", "sheep", "duck", "lion", "bear", "ring", "forest",
    "mountain", "desert", "ocean", "elephant", "giraffe", "dolphin",
    "whale", "crocodile", "tiger", "leopard", "chameleon", "penguin",
    "kangaroo", "peacock", "butterfly", "hummingbird", "rhinoceros",
    "zebra", "eagle", "ostrich", "cheetah", "koala", "alligator",
    "woodpecker", "armadillo", "beaver", "walrus", "meerkat", "porcupine",
    "platypus", "aardvark", "bison", "buffalo", "chimpanzee", "gorilla",
    "hippopotamus", "jackal", "lemur", "lynx", "mongoose", "panther",
    "python", "raccoon", "salamander", "squirrel", "tarantula", "toucan",
    "vulture", "wombat", "yak", "antelope", "cassowary", "dragonfly",
    "elephantseal", "goldeneagle", "grizzlybear", "harpyeagle", "jellyfish",
    "kookaburra", "narwhal", "octopus", "pufferfish", "quokka",
    "snowleopard", "tasmaniandevil", "umbrellabird", "vampirebat", "wolf",
    "xraytetra", "yellowjacket", "zebu"
];


export default function Home() {
    const [words, setWords] = useState([]);
    const [typedWords, setTypedWords] = useState([]);
    const [currentWord, setCurrentWord] = useState({
        word: words[0],
        index: 0
    });
    const [leftOffset, setLeftOffset] = useState(0);
    const [currentWordWrong, setCurrentWordWrong] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerStarted, setTimerStarted] = useState(false);
    const [cpm, setCpm] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const editableDivRef = useRef(null);
    const [resultOpen, setResultOpen] = useState(false)
    const [isLogedIn, setIsLogedin] = useState(localStorage.getItem('typingUser') ? true : false);


    function shuffleArray(array) {
        let shuffledArray = array.slice(); // Create a copy of the array to avoid modifying the original
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }

        setCurrentWord({
            word: shuffledArray[0],
            index: 0
        })
        return shuffledArray;
    }

    async function uploadResult() {

        const token = localStorage.getItem('typingUser');
        if (!token) {
            throw new Error('No token found');
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            await axios.post('http://localhost:5000/result/add', { cpm, wpm, accuracy }, config)
        } catch (err) {
            console.log(err)
        }
    }



    const handleKeyDown = (e) => {
        const newContent = e.target.innerText;
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newContent === '') {
                e.target.innerText = '';
            } else {
                handleNewWord(newContent);
            }
        }
    };

    const resetStates = () => {
        setWords(shuffleArray(simple_words))
        setTypedWords([]);
        setCurrentWord({
            word: simple_words[0],
            index: 0
        });
        setLeftOffset(0);
        setCurrentWordWrong(false);
        setTimeLeft(60);
        setTimerStarted(false);
        setCpm(0);
        setWpm(0);
        setAccuracy(0);
        setResultOpen(false);
        if (editableDivRef.current) {
            editableDivRef.current.innerText = ''; // Clear the contentEditable div
            editableDivRef.current.blur(); // Unfocus the div
        }
    };

    const handleChange = (e) => {
        if (!timerStarted) {
            setTimerStarted(true);
            setTimeLeft(60);
        }

        if (editableDivRef.current) {
            const newContent = e.target.innerText;

            if (newContent === ' ') {
                e.target.innerText = '';
            } else if (newContent.endsWith(' ')) {
                handleNewWord(newContent);
            } else {
                let fullWord = newContent;
                let wordsCopy = [...words];

                setCurrentWordWrong(!currentWord.word.startsWith(fullWord));

                if (currentWord.word.startsWith(fullWord)) {
                    wordsCopy[currentWord.index] = currentWord.word.replace(fullWord, '');
                }
                setWords(wordsCopy);
                setLeftOffset(prev => prev - 15);
            }
        }
    };

    const handleNewWord = (newContent) => {
        let typedCopy = [...typedWords];
        let wordsCopy = [...words];
        let fullWord = newContent.trim();
        let currentWordIndex = currentWord.index;

        typedCopy.push({
            word: fullWord,
            done: true,
            wrong: !(currentWord.word === fullWord)
        });

        setCurrentWord({
            word: wordsCopy[currentWordIndex + 1],
            index: currentWordIndex + 1
        });

        wordsCopy[currentWordIndex] = '';
        setWords(wordsCopy);
        setTypedWords(typedCopy);
        setLeftOffset(prev => prev - 15);
        editableDivRef.current.innerText = '';
        setCurrentWordWrong(false);
        calculateCpmWpm(typedCopy);
    };

    const calculateCpmWpm = (typedWordsArray = typedWords) => {
        const totalCharacters = typedWordsArray.reduce((acc, wordObj) => acc + wordObj.word.length, 0);
        const totalWords = typedWordsArray.length;
        const correctWords = typedWordsArray.filter(wordObj => !wordObj.wrong).length;
        const elapsedTime = 60 - timeLeft;

        console.log(totalCharacters, totalWords, elapsedTime)

        if (elapsedTime > 0) {
            setCpm(Math.floor(totalCharacters));
            setWpm(Math.floor(totalWords));
            if (totalWords > 0) {
                setAccuracy(Math.floor((correctWords / totalWords) * 100));
            }
        }
    };

    function closeResultModal() {
        resetStates()
    }


    useEffect(() => {
        let interval;
        if (timerStarted && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            editableDivRef.current.blur()
            setResultOpen(true)
            clearInterval(interval);

            if (isLogedIn) {
                uploadResult()
            }
        }

        return () => clearInterval(interval);
    }, [timerStarted, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            calculateCpmWpm();
        }
    }, [timeLeft]);

    useEffect(() => {
        setWords(shuffleArray(simple_words))
    }, [])

    return (

        <>
            <Navbar />
            <div className="main_container">
                <h2 className='title2'>Test your typing skills <span >. . .</span>  </h2>
                <div className="stats_container">
                    <div className='single_stat'>Time Left: <span>{timeLeft}s</span></div>
                    <div className='single_stat'>CPM: <span>{cpm}</span></div>
                    <div className='single_stat'>WPM: <span>{wpm}</span></div>
                    <div className='single_stat'>Accuracy: <span>{accuracy}%</span></div>
                </div>
                <div className="all_words_container" onClick={() => editableDivRef.current.focus()}>
                    <div className='all_words_inner_container' >
                        <div className='typing_container'>
                            {
                                typedWords.map((word, i) => (
                                    <div
                                        key={i}
                                        className={`typing_word 
                                        ${word.wrong ? 'wrong' : ''} 
                                        ${word.done ? 'done' : ''} 
                                    `.trim()}
                                    >
                                        <b>{word.word}</b>
                                    </div>
                                ))
                            }
                        </div>
                        <div
                            className={`current_typing_word ${currentWordWrong ? 'wrong' : ''}`}
                            contentEditable='true'
                            style={{ whiteSpace: 'pre-wrap' }}
                            ref={editableDivRef}
                            onInput={handleChange}
                            onKeyDown={handleKeyDown}
                        ></div>
                        <div className='display_words_container'>
                            {
                                words.map((word, i) => (
                                    word ? <div className='display_word' style={{ marginLeft: currentWord.index === i ? '0' : '10px' }} key={i}>{word}</div> : null
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>


            {resultOpen && <div className='modal_outer_container' >
                <div className='backdrop'></div>
                <div className='modal_container'>
                    <div className='modal_head'><div></div><img className='close_icon' onClick={closeResultModal} src='./delete.png' alt='close' /></div>
                    <div className='modal_body'>
                        <div className='result_container'>You type at a speed of <span>{wpm} WPM</span> (words per minute) and <span>{cpm} CPM</span> (characters per minute) with an accuracy rate of <span>{accuracy}%</span>.</div>
                    </div>
                </div>
            </div>}
        </>

    );
}
