'use client'
import React, {useState, useEffect} from 'react';
import ReactConfetti from "react-confetti";
import {Noto_Sans_Georgian} from 'next/font/google';
import {words} from '@/lib/words';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    Pause,
    Play,
    CirclePause,
    Volume2,
    VolumeX
} from 'lucide-react';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {logoSvg} from "@/lib/logoSvg";
import {playCorrectSound, playSkipSound, playTickingSound, playTimeUpSound, playWinningSound} from '@/lib/sounds';

const noto = Noto_Sans_Georgian({
    weight: ['100', '400', '900'],
    style: 'normal',
    subsets: ['georgian']
});

const AliasGame = () => {
    const [teams, setTeams] = useState([
        {name: 'არჩევანი', score: 0, roundScore: 0},
        {name: 'არადანი', score: 0, roundScore: 0},
    ]);
    const [currentTeam, setCurrentTeam] = useState(0);
    const [word, setWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [roundTime, setRoundTime] = useState(60);
    const [gameState, setGameState] = useState('setup');
    const [winningScore, setWinningScore] = useState(30);
    const [lastRound, setLastRound] = useState(false);
    const [, setRoundsPlayed] = useState([0, 0]);
    const [windowSize, setWindowSize] = useState({width: 0, height: 0});
    const [soundEnabled, setSoundEnabled] = useState(true);

    const logo = logoSvg()

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(time => {
                if (time === 1 && soundEnabled) {
                    playTimeUpSound();
                }
                if (time <= 10 && time > 0) {
                    playTickingSound();
                }
                return time - 1;
            }), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endTeamTurn();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, soundEnabled]);

    const startGame = () => {
        setGameState('ready');
        prepareTeamTurn();
    };

    const prepareTeamTurn = () => {
        setTimeLeft(roundTime);
        setWord('');
        setTeams(prevTeams => prevTeams.map(team => ({...team, roundScore: 0})));
        setGameState('ready');
    };

    const startTeamTurn = () => {
        setGameState('playing');
        nextWord();
    };

    const nextWord = () => {
        setWord(words[Math.floor(Math.random() * words.length)]);
    };


    const handleCorrect = () => {
        if (soundEnabled) {
            playCorrectSound();
        }
        setTeams(prevTeams => {
            const newTeams = [...prevTeams];
            newTeams[currentTeam].score += 1;
            newTeams[currentTeam].roundScore += 1;
            return newTeams;
        });
        nextWord();
    };

    const handleSkip = () => {
        if (soundEnabled) {
            playSkipSound();
        }
        setTeams(prevTeams => {
            const newTeams = [...prevTeams];
            newTeams[currentTeam].score -= 1;
            newTeams[currentTeam].roundScore -= 1;
            return newTeams;
        });
        nextWord();
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const endTeamTurn = () => {
        setGameState('turnEnd');

        setRoundsPlayed(prev => {
            const newRoundsPlayed = [...prev];
            newRoundsPlayed[currentTeam] = (newRoundsPlayed[currentTeam] || 0) + 1;

            // Check winner with the updated rounds
            const winner = checkWinner(newRoundsPlayed);

            if (winner !== null) {
                setGameState('gameEnd');
            } else {
                // We'll delay switching to the next team until after the user views the round results
                // The switch will happen in startNextTurn instead
            }

            return newRoundsPlayed;
        });
    };

// Update checkWinner to accept the updated roundsPlayed
    const checkWinner = (updatedRoundsPlayed) => {
        if (updatedRoundsPlayed[0] === updatedRoundsPlayed[1]) {
            if (teams[0].score >= winningScore || teams[1].score >= winningScore) {
                playWinningSound()
                return teams[0].score > teams[1].score ? 0 : 1;
            }
        }
        return null;
    };


    const startNextTurn = () => {
        if (gameState === 'gameEnd') {
            // Handle game end
            return;
        }
        // Switch to the next team
        const nextTeam = currentTeam === 0 ? 1 : 0;
        setCurrentTeam(nextTeam);
        prepareTeamTurn();
    };

    const handleTeamNameChange = (index, newName) => {
        setTeams(prevTeams => {
            const newTeams = [...prevTeams];
            newTeams[index].name = newName;
            return newTeams;
        });
    };

    const handleRoundTimeChange = (value) => {
        setRoundTime(parseInt(value));
    };

    const handleWinningScoreChange = (value) => {
        setWinningScore(parseInt(value));
    };

    const restartGame = () => {
        setTeams(teams.map(team => ({...team, score: 0, roundScore: 0})));
        setCurrentTeam(0);
        setWord('');
        setTimeLeft(roundTime);
        setLastRound(false);
        setGameState('setup');
    };

    const togglePause = () => {
        if (gameState === 'playing') {
            setGameState('paused');
        } else if (gameState === 'paused') {
            setGameState('playing');
        }
    };

    const getWinner = () => {
        return teams[0].score > teams[1].score ? teams[0] : teams[1];
    };


    return (
        <div
            className={`${noto.className} min-h-screen bg-gradient-to-b from-blue-400 to-purple-600 p-2 sm:p-4 font-sans`}>
            <Card
                className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[calc(100vh-10rem)] sm:min-h-[calc(100vh-2rem)] flex flex-col justify-between">
                <CardHeader className="bg-yellow-400 p-4 sm:p-6">
                    <CardTitle className="flex flex-row justify-between items-center">
                        <div className="w-24 sm:w-32">{logo}</div>
                        <div className='flex flex-row space-x-2'>
                            <Button onClick={toggleSound} variant='ghost' className="p-2">
                                {soundEnabled ? <Volume2 className="h-6 w-6"/> : <VolumeX className="h-6 w-6"/>}
                            </Button>
                            {(gameState === 'playing' || gameState === 'paused') && (
                                <>
                                    <Button onClick={restartGame}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                                        <RefreshCw className="h-4 w-4"/>
                                    </Button>
                                    <Button onClick={togglePause} variant='secondary'
                                            className="text-sm sm:text-lg rounded-md shadow-lg transform hover:scale-110 hover:bg-grey-100 transition-all duration-300">
                                        {gameState === 'paused' ? <Play className="h-4 w-4"/> :
                                            <Pause className="h-4 w-4"/>}
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardTitle>
                    {(gameState === 'playing' || gameState === 'paused') && (
                        <p className="text-xs sm:text-sm font-bold text-pink-600 mt-1 text-right">{winningScore} ქულამდე</p>
                    )}
                </CardHeader>
                <CardContent className="p-6">
                    {gameState === 'setup' && (
                        <div className="space-y-6">
                            {teams.map((team, index) => (
                                <Input
                                    key={index}
                                    value={team.name}
                                    onChange={(e) => handleTeamNameChange(index, e.target.value)}
                                    placeholder={`გუნდი ${index + 1}`}
                                    className="w-full bg-pink-100 border-2 border-pink-300 rounded-full text-center text-xl"
                                />
                            ))}
                            <div className="space-y-2">
                                <Label className="text-lg text-purple-700">რაუნდის დრო</Label>
                                <RadioGroup defaultValue="60" onValueChange={handleRoundTimeChange}
                                            className="flex flex-row justify-around">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="30" id="r1" className="text-purple-600"/>
                                        <Label htmlFor="r1" className="text-lg">30 წამი</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="60" id="r2" className="text-purple-600"/>
                                        <Label htmlFor="r2" className="text-lg">60 წამი</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg text-purple-700">გამარჯვების ქულა</Label>
                                <RadioGroup defaultValue="30" onValueChange={handleWinningScoreChange}
                                            className="flex flex-row justify-around">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="30" id="score1" className="text-purple-600"/>
                                        <Label htmlFor="score1" className="text-lg">30 ქულა</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="50" id="score2" className="text-purple-600"/>
                                        <Label htmlFor="score2" className="text-lg">50 ქულა</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <Button onClick={startGame}
                                    className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-xl rounded-full py-4 shadow-lg transform hover:scale-105 transition-all duration-300">
                                შექმნა
                            </Button>
                        </div>
                    )}

                    {gameState === 'ready' && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-3xl font-bold text-purple-800 animate-pulse">თამაშობს {teams[currentTeam].name}</h2>
                            <p className="text-2xl font-bold text-pink-600">ქულა: {teams[currentTeam].score} / {winningScore}</p>
                            {/*<p className="text-xl font-bold text-purple-600">რაუნდი: {roundsPlayed[currentTeam] + 1}</p>*/}
                            <Button onClick={startTeamTurn}
                                    className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-xl rounded-full py-4 shadow-lg transform hover:scale-105 transition-all duration-300">
                                დაწყება
                            </Button>
                        </div>
                    )}

                    {(gameState === 'playing' || gameState === 'paused') && (
                        <div className="space-y-6">
                            <div className="text-center flex flex-col justify-center items-center">
                                <h2 className="text-3xl font-bold text-purple-800">{teams[currentTeam].name}</h2>
                                {gameState === 'paused' ? (
                                    <p><CirclePause className='my-6' size={48} style={{color: 'grey'}}/></p>
                                ) : (
                                    <p className="text-5xl font-bold my-6">{word}</p>
                                )}
                                <div className="flex flex-row justify-center space-x-6 text-2xl font-bold">
                                    <p className={`${timeLeft < 10 ? 'text-red-500 animate-pulse scale-150' : 'text-purple-700'}`}>
                                        <Clock className="inline mr-2 h-8 w-8"/>
                                        {timeLeft}
                                    </p>
                                    <p className="text-green-600">ქულა: {teams[currentTeam].roundScore}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center space-x-4">
                                <Button onClick={handleCorrect}
                                        className="w-28 h-20 bg-green-500 hover:bg-green-600 text-white text-lg rounded-xl py-3 px-6 shadow-lg transform hover:scale-110 transition-all duration-300"
                                        disabled={gameState === 'paused'}>
                                    <CheckCircle className="mr-2 h-6 w-6"/>
                                    სწორი
                                </Button>
                                <Button onClick={handleSkip}
                                        className="w-28 h-20 bg-red-500 hover:bg-red-600 text-white text-lg rounded-xl py-3 px-6 shadow-lg transform hover:scale-110 transition-all duration-300"
                                        disabled={gameState === 'paused'}>
                                    <XCircle className="mr-2 h-6 w-6"/>
                                    Skip
                                </Button>
                            </div>
                        </div>
                    )}

                    {gameState === 'turnEnd' && (
                        <div className="space-y-6 text-center">
                            {teams.map((team, index) => (
                                <div key={index}
                                     className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl pb-4 shadow-lg">
                                    <div
                                        className="text-2xl text-green-600 bg-yellow-400 rounded-t-xl font-bold py-2 mb-2">{team.name}</div>
                                    <p className="text-xl font-bold text-purple-700">
                                        რაუნდის ქულა: {team.roundScore} | სულ: {team.score} / {winningScore}
                                    </p>
                                </div>
                            ))}
                            <Button onClick={startNextTurn}
                                    className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-xl rounded-full py-4 shadow-lg transform hover:scale-105 transition-all duration-300">
                                {lastRound ? 'ბოლო რაუნდი' : 'შემდეგი გუნდი'}
                            </Button>
                        </div>
                    )}

                    {gameState === 'gameEnd' && (
                        <div className="space-y-6 text-center">
                            <ReactConfetti
                                width={windowSize.width}
                                height={windowSize.height}
                                recycle={false}
                                numberOfPieces={200}
                            />
                            {teams.map((team, index) => {
                                const isWinner = team === getWinner();
                                return (
                                    <div key={index}
                                         className={`bg-gradient-to-r ${isWinner ? 'from-yellow-300 to-orange-300' : 'from-yellow-200 to-orange-200'} 
                                                    p-6 rounded-2xl shadow-lg transform ${isWinner ? 'scale-110' : 'rotate-2'} transition-all duration-300`}>
                                        <h3 className={`text-2xl font-bold ${isWinner ? 'text-purple-900' : 'text-purple-800'} mb-2`}>
                                            {team.name} {isWinner && '🏆'}
                                        </h3>
                                        <p className={`text-3xl font-bold ${isWinner ? 'text-purple-800' : 'text-purple-700'}`}>
                                            {team.score} ქულა
                                        </p>
                                        {isWinner && (
                                            <p className="text-xl font-bold text-green-600 mt-2 animate-pulse">
                                                გამარჯვებული!
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                            <Button onClick={restartGame}
                                    className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-xl rounded-full py-4 shadow-lg transform hover:scale-105 transition-all duration-300">
                                <RefreshCw className="mr-2 h-6 w-6"/>
                                თავიდან დაწყება
                            </Button>
                        </div>
                    )}


                </CardContent>
                <CardFooter className='flex justify-center'>
                    <div className="text-sm text-gray-700 bg-blue-100 p-4 rounded-xl shadow-inner">
                        <AlertCircle className="inline-block mr-2 h-4 w-4"/>
                        სწორი: +1 ქულა, Skip: -1 ქულა
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AliasGame;