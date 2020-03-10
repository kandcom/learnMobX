import {observable, computed, action, extendObservable, configure} from 'mobx'

configure({enforceActions: 'observed'})//проверяет настройку синтаксиса более серьезно

const nickName = new class UserNickName{
    @observable firstName = 'Dasha';
    @observable age = 20;
    @computed get nickName(){
        console.log('Generated nickname')
        return `${this.firstName}${this.age}`
    }
    @action('plus one') increment = () => {
        this.age++
    }
    @action('minus one') decrement = () => {
        this.age--
    }
}

const nickName2 = new class UserNickName2{
    constructor(){
        extendObservable(this, {
            firstName: 'Victoria',
            age: 20
        })
    }
    @computed get nickName(){
        return `${this.firstName}${this.age}`
    }
    @action('plus one') increment = () => this.age++;
    @action('minus one') decrement = () => this.age--;
}

const nickName3 = observable({
        firstName: 'Karina',
        age: 24,
        get nickName(){
            return `${this.firstName}${this.age}`
        },
        increment(){
            this.age++;
        },
        decrement(){
            this.age--;
        },
        update(name){
            this.firstName = name
        }
    },
    {
        increment: action('Plus one'),
        decrement: action('Minus one'),
        nickName: computed,
        update: action('add name')
    },
    {
        name: 'nickName 3ddd'
    }
)
export default nickName3