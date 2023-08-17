import { useEffect, useState } from 'react';
import '../App.css';

function CustomerEccomerce(){
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [totalAmount,setTotalAmount] = useState(0);

  useEffect(()=>{
    fetch('http://localhost:8282/category/all')
      .then(response=>response.json())
      .then(data=> {
        setCategories(data)
      } )
  },[]);

  const fetchProducts = (cid)=>{
    fetch('http://localhost:8282/product/category/' + cid)
      .then(response=>response.json())
      .then(data=> {
        setProducts(data)
      })
  }

  const addToCart = (p)=>{
    let temp = cartArray;
    temp.push(p);
    setCartArray(temp);
    cartArray.forEach(p=>{
      setTotalAmount(totalAmount + p.price);
    })
  }
  return (
    <div  >
      <div className="row"  >
        <div className="col-sm-1" >
          {
            categories.map((c,index)=>{
              return(
                <div key={index}>
                  <button className="button-link"
                          onClick={()=>fetchProducts(c.id)}>{c.name}</button> <br />
                </div>
              )
            })
          }

        </div>
        <div className="col-md-9">
          <div className="row">
            {
              products.map((p,index)=>{
                return(
                  <div className="col-sm-3" style={{'margin' : '5px'}} key={index}>
                    <div className="card" style={{'width': '18rem'}}>
                      <div className="card-body">
                        <h5 className="card-title">{p.title}</h5>
                        <p className="card-text">{p.tagline}</p>
                        Price: $<p className="card-text">{p.price}</p>
                        <button className="btn btn-info">Show details</button> &nbsp;&nbsp;
                        <button className="btn btn-secondary" onClick={()=>addToCart(p)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className="col-sm-2">
          <div className="card text-end" style={{'width': '15rem'}}>
            <div className="card-body">
              <h5 className="card-title">Your Cart</h5>
              <p className="card-text">
                {
                  cartArray.map((e,index)=>{
                    return(
                      <li>
                        {e.title} &nbsp;&nbsp;&nbsp; ${e.price}
                      </li>
                    )

                  })

                }

                <hr />
                Total Amount: ${totalAmount }

              </p>
              <button className="btn btn-warning">Go somewhere</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CustomerEccomerce;