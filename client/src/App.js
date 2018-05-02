import React, { Component } from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.files = React.createRef();
    this.state = {
      files: [],
    }
  }

  selectFile = () => {
    this.files.current.click();
  }

  add = () => {
    const files = [];

    for (let i = 0; i < this.files.current.files.length; i++) {
      const file = this.files.current.files.item(i);
      files.push({ id: i, name: file.name, type: file.type, size: file.size, original: file });
    }

    this.setState({ files });
  }

  remove = (item) => {
    if (this.state.files.includes(item)) {
      const index = this.state.files.indexOf(item);
      delete this.state.files[index];
      this.setState({ files: this.state.files });
    }
  }

  submit = () => {
    let form = new FormData();

    this.state.files.map(f => {
      return form.append('files[' + f.id + ']', f.original);
    });

    axios.post('http://localhost:5000/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(function(){
      console.log('SUCCESS!!');
    })
    .catch(function(){
      console.log('FAILURE!!');
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
    
       
        <div className="drop-target">
          <ul className="uploaded-files is-populated">
            {this.state.files.map(item => (
              <li key={item.id}>
                {item.name} - {item.size} - {item.type}
                <button type="button" style={{ marginLeft: 20 }} onClick={() => this.remove(item)}>
                  <svg viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"/>
                  </svg>                
                </button>
              </li>)
            )}
          </ul>
        
          <p className="drag-and-drop">
            <span>
              <svg height="32" className="octicon octicon-arrow-down" viewBox="0 0 10 16" version="1.1" width="20" aria-hidden="true">
                <path fillRule="evenodd" d="M7 7V3H3v4H0l5 6 5-6z"/>
              </svg>
              
              <span style={{ padding: 5 }}>Attach binaries</span>

              <input ref={this.files} type="file" multiple="multiple" style={{ display: "none" }} onChange={this.add}/>
              <button type="button" onClick={this.selectFile}>Add files</button>
            </span>
          </p>
        </div>

        <p>
          <button type="button" onClick={this.submit}>SAVE</button>
        </p>
      </div>
    );
  }
}

export default App;
