import { useState, useEffect } from 'react';
import './App.css';

type StateType = '安定' | 'やや緊張' | '緊張' | '高揚';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(50);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setScore(prev => {
        const change = Math.floor(Math.random() * 10) - 5; 
        let newScore = prev + change;
        if (newScore > 100) newScore = 100;
        if (newScore < 0) newScore = 0;
        return newScore;
      });
    }, 500); 

    return () => clearInterval(interval);
  }, [isRecording]);

  // ★ここを変更：パステルカラー定義に合わせる
  let currentState: StateType = '安定';
  let stateColor = '#4fd1c5'; // デフォルト：安定（ティールグリーン）

  if (score > 80) {
    currentState = '緊張';
    stateColor = '#fc8181'; // 緊張：ソフトレッド
  } else if (score > 60) {
    currentState = 'やや緊張';
    stateColor = '#f6ad55'; // 注意：ソフトオレンジ
  }

  const toggleRecord = () => {
    const newState = !isRecording;
    setIsRecording(newState);
    addLog(newState ? "セッションを開始しました" : "セッションを終了しました");
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] ${msg}`, ...prev]);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="title">kokoro Monitor</div>
        <div className="controls" style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <span className="status-badge">
             {isRecording ? "● 録音中" : "待機中"}
          </span>
          <button 
            className={`btn ${isRecording ? 'btn-stop' : 'btn-rec'}`}
            onClick={toggleRecord}
          >
            {isRecording ? "終了する" : "計測スタート"}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left: Signal */}
        <div className="card">
          <div className="card-title">音声入力波形</div>
          <div className="signal-box">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="bar" 
                style={{
                  // 録音中はランダム、停止中は低く
                  height: isRecording ? `${Math.random() * 70 + 20}%` : '10%',
                  backgroundColor: isRecording ? '#667eea' : '#cbd5e0'
                }} 
              />
            ))}
          </div>
          <div style={{marginTop: '15px', fontSize: '0.85rem', color: '#718096', display:'flex', justifyContent:'space-between'}}>
             <span>音量レベル: {isRecording ? "-12.4 dB" : "--"}</span>
             <span>基本周波数: {isRecording ? "240 Hz" : "--"}</span>
          </div>
        </div>

        {/* Right: Analysis */}
        <div className="card">
          <div className="card-title">リアルタイム状態分析</div>
          <div className="gauge-container">
            <div className="score-display" style={{color: stateColor}}>
              {isRecording ? score : "--"}
            </div>
            <div 
              className="state-label" 
              style={{
                color: stateColor, 
                backgroundColor: isRecording ? `${stateColor}15` : '#edf2f7' // 色の薄い背景
              }}
            >
              {isRecording ? currentState : "Ready"}
            </div>
          </div>
          <div style={{textAlign:'center', fontSize:'0.8rem', color:'#a0aec0', marginTop:'20px'}}>
            ※ 声の高さと揺らぎから推定しています
          </div>
        </div>
      </div>

      {/* Footer: Logs */}
      <footer className="footer">
        <div className="card-title">イベントログ</div>
        <div className="log-window">
          {logs.length === 0 ? (
            <div style={{color:'#cbd5e0', fontStyle:'italic'}}>ここに記録が表示されます...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="log-item">
                <span className="log-time">{log.split(']')[0]}]</span>
                {log.split(']')[1]}
              </div>
            ))
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;