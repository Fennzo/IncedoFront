const intialState={
    list:[]
}

//This is a reducer
const supplier = (state=intialState ,action)=>{
    if(action.type === 'GET_LIST'){
        return {...state, list: action.payload}
    }

    if(action.type === 'UPDATE_ORDER'){
        const {orderId,status} = action.payload; //destructuring the object
        
        let orderObj = state.list.find(o=>o.id === orderId); 
        //I need to update the status of this orderObj but since its immutable, 
        //I must create a clone of it. 
        let cloneObj = Object.assign({},orderObj);
        cloneObj.status = status;

        //Delete the old entry before you add a new one. 
        let tempList = state.list.filter(o=>o.id !== orderId);

        //add the cloneObj in tempList 
        tempList.push(cloneObj);

        //assign this tempList to state list 
        //assign this tempList to state list
        return {...state, list: tempList}
    }
    return state; 
}

export default supplier;

/** 
 * ...state : spread operator, makes a clone at different location 
 * let temp = state; //this is a wrong way as immutability passes on to temp 
 */