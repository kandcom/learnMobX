import './index.css';
import React, { Component } from 'react';
import { observable, computed, configure, action, decorate, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import Loader from './Loader'
configure({ enforceActions: 'observed' });

class Store {
    devsList = [
        { name: "Иван", sp: 12 },
        { name: "Макс", sp: 10 },
        { name: "Леонардо-да-винчи", sp: 8 },
    ];
    filter = '';
    datas = null;
	  get totalSum() {
        return this.devsList.reduce((sum, man) => sum += man.sp, 0)
    };
    get topPerformer() {
        const maxSp = Math.max(...this.devsList.map(man => man.sp))
        return this.devsList.find( man => {
            if(maxSp === man.sp) return man.name
        })
    };
    get filterDevelopers(){
        const mathesFilter = new RegExp(this.filter, "i");
        return this.devsList.filter( man => {
            return !this.filter || mathesFilter.test(man.name)
        })
    }
    clearList() {
        this.devsList = [];
    };
    addDeveloper(dev) {
        console.log(dev);
        this.devsList.push(dev)
    };
    updateFilter(text){
        this.filter = text;
    };
    async getData(){
      let res = await (await fetch('http://5e58a65711703300147aebf2.mockapi.io/test')).json()
      //this.setData(res);
      runInAction(() => {
        this.datas = res;
      })
      
    };
    setData(res){
      this.datas = res;
    }
};
decorate(Store, {
    devsList: observable,
    filter: observable,
    datas: observable,
    totalSum: computed,
    topPerformer: computed,
    filterDevelopers: computed,
    clearList: action('Удалить всех работников'),
    addDeveloper: action('Добавить сотрудника'),
    updateFilter: action('Поиск'),
    getData: action('Получить данные с сервера'),
    setData:action('Сохраняю в переменной')
})
const appStore = new Store();

const Row = ({ data: { name, sp } }) => {
  return (
		<tr>
            <td>{name}</td>
            <td>{sp}</td>
  	    </tr>
	);
};

@observer class Table extends Component {
  render() {
    const { store } = this.props;

    return (
      <table>
        <thead>
          <tr>
            <td>Имя:</td>
            <td>Успеваемость:</td>
          </tr>
        </thead>
        <tbody>
          {store.filterDevelopers.map((dev, i) => <Row key={i} data={dev} />)}
        </tbody>
        <tfoot>
          <tr>
            <td>Team SP:</td>
            <td>{store.totalSum}</td>
          </tr>
          <tr>
            <td>Top Performer:</td>
            <td>{store.topPerformer ? store.topPerformer.name : ''}</td>
          </tr>
        </tfoot>
      </table>
		);
  }
}

@observer class Controls extends Component {
  addDeveloper = () => {
    const name = prompt("Имя челика:");
    const sp = parseInt(prompt("Его успеваемость:"), 10);
    this.props.store.addDeveloper({ name, sp });
  }

  clearList = () => { this.props.store.clearList(); }
  filterDevelopers = (e) => {
      this.props.store.updateFilter(e.target.value)
  }
  render() {
    return (
        <div className="controls">
            <button onClick={this.clearList}>Уволить всех типов</button>
            <button onClick={this.addDeveloper}>Добавить новичка</button>
            <input type="text" value={this.props.store.filter} onChange={this.filterDevelopers}/>
    	</div>
		);
  }
}

@observer class App extends Component {
  componentDidMount(){
    appStore.getData();
  }
  render() {
    return (
      <div>
        <h1>Сотрудники года в Макдаке</h1>
        <Controls store={appStore} />
        <Table store={appStore} />
        <hr/>
        <div style={styles.div}>
        {
            appStore.datas ? appStore.datas.map(data => (<div style={styles.item} key={data.id}>
              <h2>{data.title}</h2>
              <p>{data.name}</p>
              <img src={data.avatar}/>
            </div>)) : <p>download...</p>
        }
        </div>
      </div>
    )
  }
}
const styles = {
  div: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap'
  }, 
  item:{
    width: "200px"
  }
}
export default App
//ReactDOM.render(<App/>, document.getElementById('root'));