/**
 * Created by sunlin on 16/03/2017.
 */

/**
 * React
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as BND from 'bnd';

// import httpProvider from 'bnd-service-provider-http';
import httpDriver from 'bnd-service-driver-http';
// BND.setProviderClass('http', 'httpProvider')
BND.setDriverClass('http', httpDriver)
BND.setDriverClass('http', httpDriver)

class HelloWorld extends Component {
    constructor(props) {
         super(props);
         this.state = {
            textColor: 'black',
         };
     }

    async componentDidMount() {
      const res = await BND.join({ 
          routes:[ 
              { 
                provider: { 
                    protocol: 'http', host: '127.0.0.1', port: 1111 
                },
                driver: 'http',
                serviceSettings: { protocol: 'http',
                    path: '/$BND$/node',
                    method: 'post',
                    inputParameters: [ 
                        { position: 'body', type: 'object' } 
                    ],
                    response: { type: 'json' } 
                } 
              } 
            ],
        settings: {},
        repository: 'example',
        version: '1.0.0' });
      console.log('join:', res);
    }

    async greeting(){
      console.log('state:',this.state);
      try{
        let res = await BND.invoke('example:greetings:1.0.0', this.state.name, this.state.age);
        console.log('response:', res);
        this.setState({
          greetingWords: res,
          textColor: 'blue',
        });
      } catch(e) {
        this.setState({
          greetingWords: e,
          textColor: 'red',
        });
      }
    }

    async nameChanged(e) {
      this.state.name = e.currentTarget.value
      await this.greeting();
    }

    async ageChanged(e) {
      this.state.age = e.currentTarget.value
      await this.greeting();
    }

    render() {
        return (
            <div>
                Name: <input type='text' onChange={this.nameChanged.bind(this)} />
                <br></br>
                Age: <input type='text' onChange={this.ageChanged.bind(this)} />
                <br></br>
                <span style={{color: this.state.textColor}}>
                {
                  this.state.greetingWords
                }
                </span>
            </div> 
        ) 
    } 
}

if (document.getElementById('root')) {
    ReactDOM.render(
        <HelloWorld />
        ,
        document.getElementById('root'),
    );
}
