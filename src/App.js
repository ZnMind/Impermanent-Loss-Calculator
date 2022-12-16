import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tokenA, setTokenA] = useState(0);
  const [tokenB, setTokenB] = useState(0);
  const [aAmount, setAAmount] = useState(0);
  const [bAmount, setBAmount] = useState(0);
  const [newAAmount, setNewAAmount] = useState(0);
  const [newBAmount, setNewBAmount] = useState(0);
  const [tokenANew, setTokenANew] = useState(0);
  const [tokenBNew, setTokenBNew] = useState(0);
  const [oldValue, setOldValue] = useState(0);
  const [newValue, setNewValue] = useState(0);
  const [il, setIl] = useState(0);
  const [k, setK] = useState(0);

  // Calculating initial amounts when state changes
  useEffect(() => {
    if (tokenA) {
      setAAmount(500 / tokenA);
    }

    if (tokenB) {
      setBAmount(500 / tokenB);
    }
  }, [tokenA, tokenB]);

  // Calculating constant product when state changes
  useEffect(() => {
    if (tokenA && tokenB) {
      setK(tokenA * aAmount * tokenB * bAmount);
    }
  }, [aAmount, bAmount]);

  // Calculating new token B amount after price change
  useEffect(() => {
    if (tokenA && tokenANew && tokenB && tokenBNew) {
      let deltaK = ((tokenANew / tokenBNew) / (tokenA / tokenB))
      let calc = Math.sqrt(k) * Math.sqrt(deltaK) * (bAmount / 500);
      setNewBAmount(calc);
    }
  }, [tokenANew, tokenBNew]);

  // Calculating new token A amount on new B amount state change
  useEffect(() => {
    if (tokenA && tokenANew && tokenB && tokenBNew) {
      setNewAAmount(newBAmount / (tokenANew / tokenBNew))
    }
  }, [newBAmount]);

  // Calculating new and old values when state changes
  useEffect(() => {
    setOldValue(tokenANew * aAmount + tokenBNew * bAmount)
    setNewValue((newAAmount * tokenANew) + (newBAmount * tokenBNew))
  }, [newAAmount]);

  useEffect(() => {
    setIl(((newValue - oldValue) / oldValue) * 100)
  }, [oldValue, newValue]);

  const handleAInitial = event => {
    setTokenA(event.target.value)
  }

  const handleBInitial = event => {
    setTokenB(event.target.value)
  }

  const handleANew = event => {
    setTokenANew(event.target.value)
  }

  const handleBNew = event => {
    setTokenBNew(event.target.value)
  }

  return (
    <div className="App">
      <div className='App-header'>
        <h3>Impermanent Loss Calculator</h3>
        <p><a href='https://chainbulletin.com/impermanent-loss-explained-with-examples-math' target='_blank' rel='noreferrer'>Impermanent Loss</a> (IL) is based on Uniswap's <a href='https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf' target='_blank' rel='noreferrer'>constant product formula</a><b> (x * y = k).</b></p>
        <p>It is a very popular concept when it comes to automated market makers (AMMs).</p>
        <p>Your position may lessen on price change with respect to either asset with percentage loss usually measured as IL.</p>
        <p>On price change of either asset new amounts are calculated based on <b>(y = L√P)</b> and <b>(x = L / √P)</b></p>
        <p>Where <b>(L<sup>2</sup> = x * y)</b> and initial price <b>P</b> of asset X in terms of Y = <b>y / x</b></p>
      </div>
      <div className="App-middle">
        <div className='left'>
          Initial
          <div>
            Token X: $ <input placeholder='0.00' onChange={handleAInitial}></input>
          </div>
          <div>
            Token Y: $ <input placeholder='0.00' onChange={handleBInitial}></input>
          </div>
        </div>

        <div className='right'>
          New Value
          <div>
            Token X: $ <input placeholder='0.00' onChange={handleANew}></input>
          </div>
          <div>
            Token Y: $ <input placeholder='0.00' onChange={handleBNew}></input>
          </div>
        </div>

      </div>
      <div className='App-footer'>
        <h4>Assuming $1000 in Liquidity Pool</h4>
        <div className='left'>
          <div>
            {
              tokenA
                ? `Token X: ${Math.round(aAmount * 100) / 100}`
                : `Token X: 0`
            }
          </div>
          <div>
            {
              tokenB
                ? `Token Y: ${Math.round(bAmount * 100) / 100}`
                : `Token Y: 0`
            }
          </div>
        </div>

        <div className='right'>
          <div>
            {
              tokenA && tokenANew
                ? `Token X: ${Math.round(newAAmount * 100) / 100}`
                : `Token X: 0`
            }
          </div>
          <div>
            {
              tokenB && tokenBNew
                ? `Token Y: ${Math.round(newBAmount * 100) / 100}`
                : `Token Y: 0`
            }
          </div>
        </div>

        <div className='next'>
          <div className='left'>
            {
              tokenA && tokenB
                ? `Value if held: $${Math.round(oldValue * 100) / 100}`
                : `Value if held: $0`
            }
          </div>
          <div className='right'>
            {
              tokenA && tokenB && newAAmount && newBAmount
                ? `New Value: $${Math.round(newValue * 100) / 100}`
                : `New Value: $0`
            }
          </div>
        </div>
        <div className='next'>
        {
              tokenA && tokenB && newAAmount && newBAmount
              ? `Impermanent Loss: ${Math.round(il * 100) / 100 * - 1}%`
              : `Impermanent Loss: 0%`
        }
        </div>

      </div>
    </div>
  );
}

export default App;