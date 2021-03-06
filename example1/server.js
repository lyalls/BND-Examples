const path = require('path');

/*
 * 准备 (可被工程化)
 */

const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
const webpack = require('webpack');
const webpackConfig = require('./client/webpack.config');
const compiler = webpack(webpackConfig);
const webpackDev = devMiddleware(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
});
const webpackHot = hotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
});

const serverMiddlewares = [
    webpackDev,
    webpackHot,
];

const routes = [{
	providerClass: 'http',
	driverClass: 'http',
	providerSettings: {
		port: 3000,
		middlewares: serverMiddlewares,
	}
}]

/*
 * BND 构建业务代码
 */

const BND = require('bnd');
const httpProvider = require('bnd-service-provider-http');
const httpDriver = require('bnd-service-driver-http');

BND.setProviderClass('http', httpProvider);
BND.setDriverClass('http', httpDriver);
BND.configureRepository({
	name: "example",
	version: "1.0.0",
	node: {
		routes: [
			{
				providerClass: 'http',
				driverClass: 'http',
				providerSettings: {
					port: 1111,
				},
				serviceSettings: {
					path: '/$BND$/node',
					inputParameters: [{
						position: 'body',
						type: 'object',
					}]
				}
			}
		]
	}
}).then(async repoInfo => {
	try {
		BND.utils.inspectlog(repoInfo.node.info);
		const serviceStatic = await BND.registerService({
		    name: 'Static',
		    settings: {
		    	path: '/static',
		    	method: 'get',
		    	response: {
		        	type: 'static',
		        	path: path.resolve(__dirname, './client/resources'),
		    	},
			},
			routes: routes
		});


		


		// const serviceGreetings = BND.registerService({
		// 	name: 'greetings',
		// 	handler: (name, age, secret, cookies, ctx) => {
		// 		console.log('secret:', secret);
		// 		cookies.set('secret', 'This is a cookie set by cookie');
		// 		// ctx.cookies.set('secret', 'this is a cookie set by ctx');
		// 		if (!name || !age) {
		// 			return Promise.reject('参数错误，必须输入姓名和年龄，缺一不可')
		// 		}
		// 		let numAge = age;
		// 		if (typeof numAge !== 'number') {
		// 			try {
		// 				numAge = Number(age);
		// 			} catch (err) {
		// 				return Promise.reject('年龄必须为阿拉伯数字');
		// 			}
		// 		}
		// 		if (numAge <= 0) {
		// 			return Promise.reject('年龄必须大于 0');
		// 		} else if (numAge < 18) {
		// 			return Promise.reject(`对不起 ${name}，您尚未成年`);
		// 		} else if (numAge < 30) {
		// 			return Promise.resolve(`欢迎 ${name}！您真年轻！`);
		// 		} else {
		// 			return Promise.reject(`对不起 ${name}，您有点老了`);
		// 		}
		// 	},
		// 	settings: {
		// 		path: '/greetings',
		// 		method: 'put',
		// 		inputParameters: [{
		// 			position: 'body',
		// 			type: 'string',
		// 			name: 'username',
		// 		}, {
		// 			position: 'body',
		// 			type: 'number',
		// 			name: 'age',
		// 		}, {
		// 			position: 'cookies',
		// 			type: 'string',
		// 			name: 'secret',
		// 		}, {
		// 			position: 'cookies',
		// 			type: 'object',
		// 		}, {
		// 			position: 'ctx',
		// 			type: 'object',
		// 		}]
		// 	},
		// 	routes
		// });

		const serviceGreetings = BND.registerService({
			name: 'greetings',
			handler: (name, age, secret, cookies, ctx) => {
				console.log('secret:', secret);
				cookies.set('secret', 'This is a cookie set by cookie');
				if (!name || !age) {
					return Promise.reject('参数错误，必须输入姓名和年龄，缺一不可')
				}
				let numAge = age;
				if (typeof numAge !== 'number') {
					try {
						numAge = Number(age);
					} catch (err) {
						return Promise.reject('年龄必须为阿拉伯数字');
					}
				}
				if (numAge <= 0) {
					return Promise.reject('年龄必须大于 0');
				} else if (numAge < 18) {
					return Promise.reject(`对不起 ${name}，您尚未成年`);
				} else if (numAge < 30) {
					return Promise.resolve(`欢迎 ${name}！您真年轻！`);
				} else {
					return Promise.reject(`对不起 ${name}，您有点老了`);
				}
			},
			settings: {
				path: '/greetings',
				method: 'get',
				inputParameters: [{
					position: 'query',
					type: 'string',
					name: 'username',
				}, {
					position: 'query',
					type: 'number',
					name: 'age',
				}, {
					position: 'cookies',
					type: 'string',
					name: 'secret',
				}, {
					position: 'cookies',
					type: 'object',
				}, {
					position: 'ctx',
					type: 'object',
				} ]
			},
			routes
		});


		const htmlPath = path.resolve(__dirname, './client/index.html');
		const serviceSPA = await BND.registerService({
		    name: 'SPA',
		    settings: {
		    	path: '/*',
		    	method: 'get',
		    	response: {
		        	type: 'html',
		        	path: htmlPath,
		    	},
			},
			routes: routes
		});
	} catch (error) {
		console.log('service error:', error);
	}
}, err => {
	console.log('repository error:', err);
});


