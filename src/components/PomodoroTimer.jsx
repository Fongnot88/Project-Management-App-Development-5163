import React, { useState, useEffect, useRef } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiSquare, FiSettings, FiMusic, FiVolume2, FiVolumeX, FiSkipForward } = FiIcons;

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionCount, setSessionCount] = useState(0);
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    // Update timer when session changes
    if (currentSession === 'work') {
      setTimeLeft(settings.workTime * 60);
    } else if (currentSession === 'shortBreak') {
      setTimeLeft(settings.shortBreakTime * 60);
    } else if (currentSession === 'longBreak') {
      setTimeLeft(settings.longBreakTime * 60);
    }
  }, [currentSession, settings]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    const notificationAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBjqR2O/JdCQEJnrC7+ONQQ0VXrLn6qpWFAlEnOH0wWEcBTyS2O/JdCQEJnrC7+ONQQ0VXrLn6qpWFAlEnOH0wWEcBTyS2O/JdCQEJnrC7+ONQQ0VXrLn6qpWFAlEnOH0wWEcBTyS2O/JdCQE');
    notificationAudio.play();
    
    if (currentSession === 'work') {
      // After work session, decide if it's time for a short break or long break
      setSessionCount(prev => {
        const newCount = prev + 1;
        if (newCount % settings.longBreakInterval === 0) {
          setCurrentSession('longBreak');
        } else {
          setCurrentSession('shortBreak');
        }
        return newCount;
      });
    } else {
      // After any break, start a new work session
      setCurrentSession('work');
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (currentSession === 'work') {
      setTimeLeft(settings.workTime * 60);
    } else if (currentSession === 'shortBreak') {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
  };

  const handleSkip = () => {
    setIsRunning(false);
    handleSessionComplete();
  };

  const handleMusicSubmit = (e) => {
    e.preventDefault();
    if (musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work': return 'Work Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Session';
    }
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'bg-red-500';
      case 'shortBreak': return 'bg-green-500';
      case 'longBreak': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowSettings(false);
    handleReset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pomodoro Timer</h1>
        <p className="text-gray-600">เพิ่มประสิทธิภาพการทำงานด้วยเทคนิค Pomodoro</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timer Card */}
        <div className="sharp-card p-8 flex flex-col items-center">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold mb-2">{getSessionLabel()}</h2>
            <div className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getSessionColor()}`}>
              Session #{sessionCount + 1}
            </div>
          </div>

          <div className="text-7xl font-bold mb-8 font-mono">{formatTime(timeLeft)}</div>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleStartPause}
              className="sharp-button bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <SafeIcon icon={isRunning ? FiPause : FiPlay} className="w-4 h-4" />
              <span>{isRunning ? 'หยุด' : 'เริ่ม'}</span>
            </button>
            
            <button
              onClick={handleReset}
              className="sharp-button flex items-center space-x-2"
            >
              <SafeIcon icon={FiSquare} className="w-4 h-4" />
              <span>รีเซ็ต</span>
            </button>
            
            <button
              onClick={handleSkip}
              className="sharp-button flex items-center space-x-2"
            >
              <SafeIcon icon={FiSkipForward} className="w-4 h-4" />
              <span>ข้าม</span>
            </button>
          </div>

          <div className="w-full">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <button 
                onClick={() => setCurrentSession('work')}
                className={`px-3 py-1 rounded ${currentSession === 'work' ? 'bg-red-100 text-red-700 font-medium' : ''}`}
              >
                Work
              </button>
              
              <button 
                onClick={() => setCurrentSession('shortBreak')}
                className={`px-3 py-1 rounded ${currentSession === 'shortBreak' ? 'bg-green-100 text-green-700 font-medium' : ''}`}
              >
                Short Break
              </button>
              
              <button 
                onClick={() => setCurrentSession('longBreak')}
                className={`px-3 py-1 rounded ${currentSession === 'longBreak' ? 'bg-blue-100 text-blue-700 font-medium' : ''}`}
              >
                Long Break
              </button>
            </div>
            
            <div className="progress-bar">
              <div 
                className={`progress-fill ${getSessionColor()}`} 
                style={{
                  width: `${currentSession === 'work' 
                    ? (timeLeft / (settings.workTime * 60)) * 100 
                    : currentSession === 'shortBreak' 
                      ? (timeLeft / (settings.shortBreakTime * 60)) * 100 
                      : (timeLeft / (settings.longBreakTime * 60)) * 100}%`
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="mt-6 flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <SafeIcon icon={FiSettings} className="w-4 h-4 mr-1" />
            <span>ตั้งค่า</span>
          </button>
        </div>

        {/* Music Player & Settings */}
        <div className="space-y-8">
          {/* Music Player */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">เพลงประกอบการทำงาน</h3>
            
            <form onSubmit={handleMusicSubmit} className="mb-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="ใส่ URL YouTube (เฉพาะเสียง)"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    className="sharp-input w-full"
                  />
                </div>
                
                <button
                  type="submit"
                  className="sharp-button bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiMusic} className="w-4 h-4" />
                  <span>เล่น</span>
                </button>
              </div>
            </form>

            {isPlaying && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">กำลังเล่น: {musicUrl}</p>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 bg-white rounded-full border border-gray-200"
                    >
                      <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="w-4 h-4" />
                    </button>
                    
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                </div>

                {musicUrl && (
                  <div className="hidden">
                    <audio
                      ref={audioRef}
                      src={musicUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">แนะนำเพลงสำหรับการทำงาน:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>- เพลงบรรเลงคลาสสิค</li>
                <li>- เพลงธรรมชาติ (เสียงฝนตก, ทะเล)</li>
                <li>- Lo-fi Music</li>
              </ul>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="sharp-card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ตั้งค่า</h3>
              
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เวลาทำงาน (นาที)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.workTime}
                    onChange={(e) => setSettings({...settings, workTime: parseInt(e.target.value)})}
                    className="sharp-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เวลาพักสั้น (นาที)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.shortBreakTime}
                    onChange={(e) => setSettings({...settings, shortBreakTime: parseInt(e.target.value)})}
                    className="sharp-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เวลาพักยาว (นาที)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={settings.longBreakTime}
                    onChange={(e) => setSettings({...settings, longBreakTime: parseInt(e.target.value)})}
                    className="sharp-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนรอบก่อนพักยาว
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.longBreakInterval}
                    onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value)})}
                    className="sharp-input w-full"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="sharp-button bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex-1"
                  >
                    บันทึก
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="sharp-button flex-1"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tips */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">เทคนิค Pomodoro</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
              <li>ตั้งเวลาทำงาน 25 นาที (1 Pomodoro)</li>
              <li>ทำงานให้จบช่วงเวลานั้นโดยไม่มีการรบกวน</li>
              <li>พักสั้น 5 นาทีหลังจบ 1 Pomodoro</li>
              <li>หลังจากทำ 4 Pomodoros ให้พักยาว 15-30 นาที</li>
              <li>ทำซ้ำขั้นตอนเดิมเพื่อเพิ่มประสิทธิภาพการทำงาน</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;