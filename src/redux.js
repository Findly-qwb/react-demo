/*
 * @Author:  Findly <wenbinqiu42@gmail.com>
 * @Date: 2022-01-18 10:05:52
 * @LastEditors: Findly
 * @LastEditTime: 2022-01-19 17:23:42
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { changed } from './utils/utils';
let state = null;
let reducer = undefined;
let listeners = [];

// state变化 遍历listeners 更新每个connect的视图
const setState = (newState) => {
	state = newState;
	listeners.map((fn) => fn(state));
};

const store = {
	getState: () => {
		return state;
	},
	dispatch: (action) => {
		setState(reducer(state, action));
	},
	//收集所有订阅者，并返回取消订阅方法
	subscribe(fn) {
		listeners.push(fn);
		return () => {
			const index = listeners.indexOf(fn);
			listeners.splice(index, 1);
		};
	},
};
// 通过修改dispatch，内部针对不同的action做单独处理，达到实现异步action的目的（中间件的实现原理）
let prevDispatch = store.dispatch;
let dispatch = (action) => {
	// 支持函数action
	if (action instanceof Function) {
		action(dispatch);
		// 支持异步promise函数
	} else if (action.payload instanceof Promise) {
		action.payload.then((resp) => {
			dispatch({ ...action, payload: resp });
		});
	} else {
		prevDispatch(action);
	}
};

store.dispatch = dispatch;
// 创建store
export const createStore = (_reducer, initState) => {
	state = initState;
	reducer = _reducer;
	return store;
};
// connect 链接组件和state ：读state，修改state
export const connect = (selector, mapDispatchToProps) => (Component) => {
	return (props) => {
    // 触发Component组件更新的真正状态
		const [, update] = useState({});
		const data = selector ? selector(state) : { state };
		const dispatchs = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : { dispatch: store.dispatch };
		useEffect(
			() =>
				store.subscribe(() => {
					// 对比当前data跟上次data 精准控制是否需要更新
					const newData = selector ? selector(state) : { state };
					if (changed(data, newData)) {
						update({});
					}
				}),
			[selector]
		);

		return <Component {...props} {...data} {...dispatchs} />;
	};
};
// 利用context 将Store数据作为全局状态
const appContext = React.createContext(null);
export const Provider = ({ store, children }) => {
	return <appContext.Provider value={store}>{children}</appContext.Provider>;
};
