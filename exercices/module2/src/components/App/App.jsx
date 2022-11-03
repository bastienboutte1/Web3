import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import Display from '../../components/Display/Display';
import Button from '../../components/Button/Button';

const STORAGE_COUNTER_KEY = "counter";

const App = () => {
  const [counter, setCounter] = useLocalStorage(STORAGE_COUNTER_KEY, 0)

  const changeCount = (delta) => {
    const newCounter = counter + delta;
    setCounter(newCounter)
  }


  return (
    <div>
      <Display counter={counter} />
      <Button
        changeCount={changeCount}
        delta={1}
        text='plus'
      />
      <Button
        changeCount={changeCount}
        delta={-counter}
        text='zero'
      />
      <Button
        changeCount={changeCount}
        delta={-1}
        text='minus'
      />
    </div>
  )
}

export default App;