/*
 * @Author:  Findly <wenbinqiu42@gmail.com>
 * @Date: 2022-01-18 11:39:23
 * @LastEditors: Findly
 * @LastEditTime: 2022-01-18 11:39:24
 * @Description:
 */
import { connect } from '../redux';
const userSelector = (state) => ({
	user: state.user,
});
const userDispatcher = (dispatch) => {
	return {
		updateUser: (attrs) => dispatch({ type: 'updateState', payload: attrs }),
	};
};
export const connectToUser = connect(userSelector, userDispatcher);
