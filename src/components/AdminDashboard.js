import React from 'react';
import './AdminDashboard.css'
const axios = require('axios');
const { API_BASE_URL } = require('../config');


export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
        }
    }
    componentDidMount() {
        // GET menus
        axios.get(`${API_BASE_URL}/menus`)
          .then(res => {
            const menus = res.data.map(menu => {
                return {
                    name: menu.name, 
                    id: menu._id
                }
            })
            // console.log('menus: ', menus)
            this.setState({
              menus
            });
          })
          .catch(err => {
            console.log(err);
          });
    }
    // componentDidUpdate() {
    //     console.log('state: ', this.state)
    // }
    render() {
        const menuList = this.state.menus.map((menu, index) => {
            return <p>{menu.name}</p>
        })
        return (
            <div>

                <h2>Menus</h2>
                <button>Create New Menu</button>
                <div>{menuList}</div>
                
                
                <h2>Menu Items</h2>
                <button>Create New Menu Item</button>
                <div></div>
            </div>
        )
    }
}