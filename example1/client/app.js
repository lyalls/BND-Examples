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

class HelloWorld extends Component {
    constructor(props) {
         super(props);
     }

     async join() {
        let res;
        res = await BND.configureRepository({
            name: 'BND-Example-Client',
            version: '1.0.0',
        });
        console.log('configureRepository:', res);
        res = await BND.join({ routes:
           [ { provider: { protocol: 'http', host: '127.0.0.1', port: 1111 },
               driver: 'http',
               serviceSettings:
                { protocol: 'http',
                  path: '/$BND$/node',
                  method: 'post',
                  inputParameters: [ { position: 'body', type: 'object' } ],
                  response: { type: 'json' } } } ],
          settings: {},
          repository: 'BND-Example',
          version: '1.0.0' });
        console.log('join:', res);
     }

    async componentDidMount() {
        await this.join();
        let res = await BND.invoke('BND-Example:greetings:1.0.0', 'hello', 21);
        console.log(res);
    }

    render() {
        return (
            <div>
                Hello world
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
