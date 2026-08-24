import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLabs, setTimeLabs] = useState([]);


  // TODO : prev 대신 time 써주는건 안되는지?
  useEffect(() => {
    if (isRunning === true) {
      const id = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(id);
    }
    return;
  }, [isRunning]);

  function handleAddTimeLabs() {
    setTimeLabs([...timeLabs, {
      id: crypto.randomUUID,
      text: time
    }]);
    timeLabs.forEach(x => { console.log(x) });
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>{time}</h1>
          {/* TODO : 처음에 왜 { }는 안되었는지 */}
          {timeLabs.map(timeLab => (
            <ul key={timeLab.id}>{timeLab.text}</ul>
          ))}

        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setIsRunning((true))}
        >
          시작
        </button>
        <button
          type="button"
          className="counter"
          onClick={() => setIsRunning((false))}
        >
          정지
        </button>
        {isRunning === false && time > 0 && (
          <button
            type="button"
            className="counter"
          >
            리셋
          </button>
        )}
        <button
          type="button"
          className="counter"
          //TODO : () => 으로 처음에 함수형 왜 동작 안했는지?
          onClick={handleAddTimeLabs}
        >
          랩
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
