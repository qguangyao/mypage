import React, { useEffect, useState } from 'react';
import styles from './index.css';
import RandomImageVarification from './randomImageVarification'

export default () => {
  const [url, setUrl] = useState(require("./icon/verificationbg.jpeg"));
  useEffect(() => {
    setUrl(require("./icon/verificationbg.jpeg"));
  }, [url]);
  return (
    <div>
      <h1 className={styles.title}>Page varificationCode/index</h1>
      <RandomImageVarification
        imageUrl={url}
        onReload={() => {
          console.log("onReload")
      }}
        onMatch={() => {
            console.log("match")
        }}

      ></RandomImageVarification>
    </div>
  );
}
