import manager from './store/reducer/manager';
import supplier from './store/reducer/supplier';

const { configureStore } = require("@reduxjs/toolkit");
export default configureStore({
    reducer: {supplier,manager} /** Make entry of all reducers here  */
})
