import React from 'react'
import './Nav.css'
import NavItem from './NavItem'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            {/* Refatorar em Casa */}
            <NavItem href="/" icon="home" name="Início"/>
            <NavItem href="/users" icon="users" name="Usuários"/>
        </nav>
    </aside>