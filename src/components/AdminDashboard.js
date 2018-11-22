import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import './AdminDashboard.css'
const axios = require('axios');
const { API_BASE_URL } = require('../config');

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
            menuItems: [],
            // filterInput: ''
        }
    }
    // TODO: Move axios requests to their own module
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
            this.setState({
              menus
            })
          })
          .catch(err => {
            console.log(err)
          });

          // GET all menu items
          axios.get(`${API_BASE_URL}/menu_items`)
            .then(res => {
                const menuItems = res.data.map(item => {
                    return {
                        name: item.name, 
                        description: item.description,
                        cost: item.cost,
                        menus: item.menus,
                        editable: item.editable,
                        id: item._id
                    }
                })
                this.setState({
                    menuItems
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleInput = e => {
        this.setState({
            filterInput: e.target.value
        })
    }
    updateMenuItemState = (updatedMenuItem, menuItemIndex) => {
        this.setState({
            menuItems: [
                ...this.state.menuItems.slice(0, menuItemIndex),
                updatedMenuItem,
                ...this.state.menuItems.slice(menuItemIndex + 1)
            ]
        })
    }
    toggleMenuItemEditable = itemId => {
        const menus = this.state.menuItems
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].id === itemId) {
                // TODO: is it necessary to be immutable here with the updatedMenuItem (and also in method below) or is it not necessary because we're not updating state yet? 
                const updatedMenuItem = Object.assign({}, menus[i], {
                    editable: !menus[i].editable
                })
                this.updateMenuItemState(updatedMenuItem, i)
            }
        }
    }
    // TODO: Is there a better way to handle this with less code?
    handleMenuAssignment = (menuId, menuItemId) => {
        const menuItems = this.state.menuItems
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].id === menuItemId) {
                if (menuItems[i].menus.includes(menuId)) {
                    let menusLessRemovedMenu = menuItems[i].menus.filter(menu => menu.id !== menuId)
                    let updatedMenuItem = Object.assign({}, menuItems[i], {
                        menus: menusLessRemovedMenu
                    })
                    this.updateMenuItemState(updatedMenuItem, i)
                } else {
                    let menusWithAddedMenu = [...menuItems[i].menus, menuId]
                    let updatedMenuItem = Object.assign({}, menuItems[i], {
                        menus: menusWithAddedMenu
                    })
                    this.updateMenuItemState(updatedMenuItem, i)
                }
            }
        }
    }
    componentDidUpdate() {
        console.log('AdminDash state: ', this.state)
    }
    render() {
        const menus = this.state.menus.map((menu, index) => {
            return (
                <div>
                    <Link to={`/menu/${menu.id}`}>
                        <li key={index}>{menu.name}</li>
                    </Link>
                    <br />
                </div> 
            )
        })

        // let filteredItems = this.state.menuItems.filter(item => {
        //     return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        // })
        
        return (
            <div>

                <h2>Menus</h2>
                <button>Create New Menu</button>
                {/* <p><i>Select a menu to view</i></p> */}
                <ul className="menus">{menus}</ul>
                
                <h2>All Menu Items</h2>
                <button>Create New Menu Item</button>
                <br />
                <label htmlFor="filter">Filter By Name</label>
                <input 
                    type="text" 
                    id="filter" 
                    onChange={this.handleInput}
                    value={this.state.input}
                />
                <ul className="menu-items">
                    <MenuItem 
                        menuItems={this.state.menuItems}
                        menus={this.state.menus} 
                        onClick={this.toggleMenuItemEditable}
                        handleMenuAssignment={this.handleMenuAssignment}
                    />
                </ul>

            </div>
        )
    }
}