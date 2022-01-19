/*
 * @Author:  Findly <wenbinqiu42@gmail.com>
 * @Date: 2022-01-19 10:26:56
 * @LastEditors: Findly
 * @LastEditTime: 2022-01-19 10:26:56
 * @Description: 
 */
// 判断两次数据是否一样
export const changed = (oldState, newState) => {
	let changed = false;
	for (let key in oldState) {
		if (oldState[key] !== newState[key]) {
			changed = true;
		}
	}
	return changed;
};