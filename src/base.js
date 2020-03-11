import './index.css';
import React, { Component } from 'react';
import { observable, computed, configure, action, decorate } from 'mobx';
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
      let response = await (await fetch('http://5e58a65711703300147aebf2.mockapi.io/test')).json();
      this.setData(response)
    };
    setData(data){
      this.datas = data;
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
    setData: action('Переменная получила значения')
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
        <h2>Те кто ушел от нас)))</h2>
        <div style={styles.div}>
        {
            appStore.datas ? appStore.datas.map( item => {
              return (
                <div style={styles.block} key={item.id}>
                  <h2>{item.title}</h2>
                  <img src={item.avatar} alt={item.name}/>
                  <p>{item.name}</p>
                </div>
              )
            }) : <Loader/>
        }
        </div>
      </div>
    )
  }
}
const styles = {
  div: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  block: {
    width: '200px',
    height: '300px',
    textAlign: "center"
  }
}
export default App