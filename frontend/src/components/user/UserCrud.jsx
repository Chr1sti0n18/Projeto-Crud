import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios'

const headerProps = {
    icon: "users",
    title: "Usuários",
    subtitle: "Cadastro de usuários: Incluir, Listar, Alterar, Excluir"
};


const initialState = {
    user: { id: 0, name: '', age: 0, email: '' },
    list: []
};

var DadosClientes = [
    {
        id: 1,
        name: "Carlos Antonio ",
        email: "carlosantoni@gmail.com",
        age: 54
    },
    {
        id: 2,
        name: "Christian Ribeiro Gama Franco",
        email: "chrisribgama3@gmail.com",
        age: 25
    },
];

var db;

var request = indexedDB.open("MeuBanco2", 1); 
function openDb() {
    request.onsuccess = function (event) {
        console.log("Db aberto com sucesso...")
    }
    
    request.onerror = function (event) {
        console.log("Erro ao realizar abertura do Db..." + event.target.error)
    }
}
request.onupgradeneeded = function (event) {
    db = event.target.result

    var store = db.createObjectStore("store", { keyPath: "id", autoIncrement: true})
    for (var i in DadosClientes) {
        store.add({...DadosClientes[i]})
    }
    console.log("Adicionando Dados...")
}

function atualizarBd(dados) {
    request.onupgradeneeded = function (event) {
        db = event.target.result
        db
        .transaction("store")
        .objectStore("store")
        .get("1").onsuccess = function (event) {
        alert("O nome do id 1 é " + request.result.name);
        };
    }
}

function getUser(user, storeName) {
   request.onsuccess = function (event) {
        db = event.target.result
        db.transaction(storeName).objectStore(storeName).get(user).onsuccess = function (event) {
            let resultado = event.srcElement.result
            return resultado
        }
    }
} 


openDb()
let baseUrl = 'http://localhost:3001/users'

export default class UserCrud extends Component {
    
    state = { ...initialState };
    
    componentDidMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    };

    clear() {
        this.setState({ user: initialState.user })
    };

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                for(let i  in list ) {
                    atualizarBd(list[i])
                } 
                this.setState({ user: initialState.user, list })
            })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user });
    };

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Idade</label>
                            <input type="text" className="form-control"
                                name="age"
                                value={this.state.user.age}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a idade..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail..." />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    load(user) {
        this.setState({ user });
    };

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
            //newRequest.db.transaction(["store2"], 'readwrite').objectStore("store2").delete(user.id)
        })
    };
    
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        );
    };

    renderRows() {
        return this.state.list.map(user => {
            return (
            <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.email}</td>
                <td>
                    <button className="btn btn-warning"
                        onClick={() => this.load(user)}>
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button className="btn btn-danger ml-2"
                        onClick={() => this.remove(user)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
            );
        });
    };

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        );
    };
}