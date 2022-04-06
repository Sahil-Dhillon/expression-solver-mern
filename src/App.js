import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const evaluate = () => {
  const values = document.querySelector('#dropbox').children
  console.log(values)
  for (let j = 0; j < values.length - 1; j++) {
    if (values[j].getAttribute('data-type') === values[j + 1].getAttribute('data-type')) {
      alert("Invalid Expression")
      return
    }
  }
  let expr = ""
  for (let i = 0; i < values.length; i++) {
    expr += values[i].getAttribute('data-value');
  }
  console.log(expr)
  try {
    console.log(eval(expr))
    alert(eval(expr))
  } catch (error) {
    alert("Invalid Expression")
  }
}

function dragStart(ev) {
  ev.dataTransfer.effectAllowed = 'move';
  ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
  ev.dataTransfer.setDragImage(ev.target, 0, 0);
  return true;
}
function dragEnter(ev) {
  ev.preventDefault();
}
function dragOver(ev) {
  ev.preventDefault();
}

function deleteElement(e) {
  console.log("hehe")
  console.log(e.getAttribute('data-parent'))
}
function dragDrop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("Text");
  var nodeCopy = document.getElementById(data).cloneNode(true);
  nodeCopy.id = `newid${data}`;
  nodeCopy.innerHTML = `${nodeCopy.innerHTML} <span data-parent=${nodeCopy.id} class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" onClick={this.parentNode.remove()}>X</span>`
  ev.target.appendChild(nodeCopy);
  // console.log("hehe")
  ev.stopPropagation();
}
function addElementClick(data) {
  var nodeCopy = document.getElementById(data).cloneNode(true);
  nodeCopy.id = `newid${data}`;
  nodeCopy.innerHTML = `${nodeCopy.innerHTML} <span data-parent=${nodeCopy.id} class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" onClick={this.parentNode.remove()}>X</span>`
  document.querySelector('#dropbox').appendChild(nodeCopy);
}
function addRHS() {
  let rhsValue = prompt("Enter RHS Value");
  if (rhsValue != null) {
    document.getElementById("rhs").setAttribute("data-value", rhsValue);
  }
  console.log(rhsValue)
  addElementClick("rhs")
  evaluate()
}


const Element = (props) => {
  const { Key, Value } = props
  return (
    <button id={`operand${Key}`} draggable='true' className="position-relative btn-secondary p-3 px-4 m-2" data-value={Value} data-type="operand" onDragStart={(ev) => dragStart(ev)}>{Key}</button>
  )
}

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('https://expression-solver.herokuapp.com/getData')
        console.log(result.data)
        setData(result.data)
      } catch (error) {
        console.log("Error in retrieving data")
      }
    }
    fetchData()
  }, [])



  return (
    <div className="App" >
      <div class="card rounded-0 m-2">
        <div class="card-body">
          {data.map((data, index) => {
            return (<Element key={index} {...data} />)
          })}
        </div>
      </div>
      <div class="card rounded-0 m-2">
        <div class="card-body">
          <div className="m-2">
            <button id="plus" draggable='true' className="btn-secondary p-3 px-4 m-2 position-relative" onDragStart={(ev) => dragStart(ev)} data-value="+" data-type="operator" >+</button>
            <button id="subtract" draggable='true' className="position-relative btn-secondary p-3 px-4 m-2" onDragStart={(ev) => dragStart(ev)} data-value="-" data-type="operator">-</button>
            <button id="multiply" draggable='true' className="btn-secondary position-relative p-3 px-4 m-2" onDragStart={(ev) => dragStart(ev)} data-value="*" data-type="operator">*</button>
            <button id="divide" draggable='true' className="btn-secondary p-3 px-4 m-2 position-relative" onDragStart={(ev) => dragStart(ev)} data-value="/" data-type="operator">/</button>
          </div>
          <div className="m-2">

            <button id="l_comparator" className="btn-secondary position-relative p-3 px-4 m-2" data-type="compareator" data-value="<" onClick={() => addElementClick("l_comparator")}>{`<`}

            </button>
            <button id="g_comparator" className="btn-secondary p-3 px-4 m-2 position-relative" data-type="comparator" data-value=">" onClick={() => addElementClick("g_comparator")}>{`>`}</button>
          </div>
          <div className="m-2">
            <button id="rhs" className="btn-secondary p-2 px-5 m-2 position-relative" data-type="operand" onClick={() => addRHS()}>RHS Integer</button>

          </div>

        </div>
      </div>
      <div class="card m-2">
        <div id="dropbox" class="card-body py-4" onDragEnter={(ev) => dragEnter(ev)} onDragOver={(ev) => dragOver(ev)} onDrop={(ev) => dragDrop(ev)}>
        </div>
      </div>

      <button className="btn btn-primary m-2" onClick={evaluate}>Evaluate</button>
    </div>
  );
}

export default App;