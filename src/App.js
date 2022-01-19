/*
 * @Author:  Findly <weninqiu42@gmail.com>
 * @Date: 2021-11-05 10:52:24
 * @LastEditors: Findly
 * @LastEditTime: 2022-01-19 17:30:24
 * @Description:
 */
import React from 'react';
import { Provider, connect, createStore } from './redux';
import './App.css';
import { connectToUser } from './connecters/connectToUser';
// reducer 规范state修改流程
const reducer = (state, { type, payload }) => {
	if (type === 'updateState') {
		return {
			...state,
			user: {
				...state.user,
				...payload,
			},
		};
	}
};
const initState = {
	user: { name: 'findly', age: 18 },
	group: { name: '前端组' },
};
const store = createStore(reducer, initState);
const App = () => {
	return (
		<Provider value={store}>
			<FirstSon />
			<SecondSon />
			<ThirdSon />
		</Provider>
	);
};

const FirstSon = () => {
	console.log('FirstSon执行了' + Math.random());
	return (
		<section>
			FirstSon
			<User />
		</section>
	);
};
const SecondSon = () => {
	console.log('SecondSon执行了' + Math.random());
	return (
		<section>
			SecondSon
			<UserModifier />
		</section>
	);
};
const ThirdSon = connect((state) => ({ group: state.group }))(({ group }) => {
	console.log('ThirdSon执行了' + Math.random());
	return (
		<section>
			ThirdSon <div>Group:{group.name}</div>
		</section>
	);
});

const User = connect(
	null,
	null
)(({ state }) => {
	console.log(`User  执行了` + Math.random());
	return <div>User:{state.user.name}</div>;
});
const ajax = (url) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let data = {
				name: '异步邱文斌',
			};
			resolve(data);
		}, 3000);
	});
};
const fetchUser = (dispatch) => {
	ajax('/user').then((res) => {
		console.log('res======', res);
		dispatch({ type: 'updateState', payload: res });
	});
};
const UserModifier = connect(
	null,
	null
)(({ children, state, dispatch }) => {
	console.log(`UserModifier  执行了`);

	const onClick = () => {
		// 支持异步函数action
		// dispatch(fetchUser);
		// 支持异步promise
		dispatch({ type: 'updateState', payload: ajax('/user').then((res) => res) });
	};
	return (
		<div>
			{children}
			<div>User:{state.user.name}</div>
			<button onClick={onClick}>点击获取异步</button>
		</div>
	);
});

export default App;
