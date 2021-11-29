import React from 'react'
// 模组化css文件，先要在custom.d.ts中声明，然后将css文件的后缀改为.module.css
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <a
        className={styles.appLink}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </div>
  )
}

export default App
