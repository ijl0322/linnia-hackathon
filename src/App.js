require('babel-polyfill')
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from './Header'
const LinniaUtil = require('./linniaUtil')

class App extends Component {

  async componentDidMount() {
    const recordJson = { name: 'isabel', creditScore: 700 }
    const dataHashString = 'QmcfX21CPGmaHXwiDjm4PxU9AKzLdiPYDAuRa4DNHuvEhd'
    const ownerPrivateKey = '0xb581d5911f2983182558c7b376e37c65725add8230c82019b74ebc963d8f6b07'
    const receiverPublicKey = '0x67c396d711ad2ba7408f5b1951e0dcec84cb11b6e189f95cab9cff9ef230eb7afce76a42c666b9e2a3499756a8aaa529a375e01e033f80917d9db45f8cbdadef'
    const receiverAddress = '0x1f6FD2dB216b6F4958Ee00a41a6Cc19B54383B62'
    const receiverPrivateKey = '0x44ae90da82985a6f3feb058b5bd0d4e1694b4f4e310db584cee9749bc431d021'
    //LinniaUtil.addRecord(recordJson)
    //LinniaUtil.grantPermission(dataHashString, ownerPrivateKey, receiverPublicKey, receiverAddress)
    const results = LinniaUtil.getRecord(dataHashString, receiverAddress, receiverPrivateKey)
    console.log(results)
  }

  render() {

    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' render={() => <div>at /</div>} />
          <Route exact path='/firstRoute' render={() => <div>at /firstRoute</div>} />
          <Route exact path='/secondRoute' render={() => <div>at /secondRoute</div>} />
          <Route render={() => <div>where r u lol</div>} />
        </Switch>
      </div>
    )
  }
}

export default App