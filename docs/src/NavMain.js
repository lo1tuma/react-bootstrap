import React from 'react';
import Router from 'react-router-component';
import Navbar from '../../lib/Navbar';
import Nav from '../../lib/Nav';

const InternalLink = Router.Link;

const NAV_LINKS = {
  'getting-started': {
    link: '/getting-started.html',
    title: 'Getting started'
  },
  'components': {
    link: '/components.html',
    title: 'Components'
  }
};

const NavMain = React.createClass({
  propTypes: {
    activePage: React.PropTypes.string
  },

  render() {
    let brand = <InternalLink href="/" className="navbar-brand">React Bootstrap</InternalLink>;

    return (
      <Navbar componentClass='header' brand={brand} staticTop className="bs-docs-nav" role="banner" toggleNavKey={0}>
        <Nav className="bs-navbar-collapse" role="navigation" eventKey={0} id="top">
          {Object.keys(NAV_LINKS).map(this.renderNavItem)}
        </Nav>
      </Navbar>
    );
  },

  renderNavItem(linkName) {
    let link = NAV_LINKS[linkName];

    return (
        <li className={this.props.activePage === linkName ? 'active' : null} key={linkName}>
          <InternalLink href={link.link}>{link.title}</InternalLink>
        </li>
      );
  }
});

export default NavMain;
