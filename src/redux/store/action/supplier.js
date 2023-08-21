import axios from 'axios';

export const getOrders = () => async (dispatch)=>{
    try{
        let token = localStorage.getItem('token'); 
        const response 
            = await axios.get('http://localhost:8282/order/supplier/all',{
                headers:{
                    'Authorization': 'Basic ' + token
                }
            });   

           dispatch({
            type: 'GET_LIST',
            payload: response.data
           }) 
     }
     catch(err){
        throw err;
     }
    
}

export const updateStatus = (id,status)=> {
         axios.put('http://localhost:8282/order/status/update', 
        {
            "status": status,
            "orderId":id
        },
        {
            headers:{
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        }
        )
        return {
            type: 'UPDATE_ORDER',
            payload: {
                "status": status,
                "orderId":id
            }
           }

}
/** 
 action = {
            type: 'GET_LIST',
            payload: response.data
           }
 */