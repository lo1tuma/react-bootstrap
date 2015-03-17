/* eslint-disable */
import React from 'react';
import classSet from 'react/lib/cx';
import Accordion from '../../lib/Accordion';
import Alert from '../../lib/Alert';
import Badge from '../../lib/Badge';
import Button from '../../lib/Button';
import ButtonGroup from '../../lib/ButtonGroup';
import ButtonToolbar from '../../lib/ButtonToolbar';
import CollapsableMixin from '../../lib/CollapsableMixin';
import Carousel from '../../lib/Carousel';
import CarouselItem from '../../lib/CarouselItem';
import Col from '../../lib/Col';
import DropdownButton from '../../lib/DropdownButton';
import Glyphicon from '../../lib/Glyphicon';
import Grid from '../../lib/Grid';
import Input from '../../lib/Input';
import Jumbotron from '../../lib/Jumbotron';
import Label from '../../lib/Label';
import ListGroup from '../../lib/ListGroup';
import ListGroupItem from '../../lib/ListGroupItem';
import Nav from '../../lib/Nav';
import Navbar from '../../lib/Navbar';
import NavItem from '../../lib/NavItem';
import MenuItem from '../../lib/MenuItem';
import Modal from '../../lib/Modal';
import ModalTrigger from '../../lib/ModalTrigger';
import OverlayTrigger from '../../lib/OverlayTrigger';
import OverlayMixin from '../../lib/OverlayMixin';
import PageHeader from '../../lib/PageHeader';
import PageItem from '../../lib/PageItem';
import Pager from '../../lib/Pager';
import Panel from '../../lib/Panel';
import PanelGroup from '../../lib/PanelGroup';
import Popover from '../../lib/Popover';
import ProgressBar from '../../lib/ProgressBar';
import Row from '../../lib/Row';
import SplitButton from '../../lib/SplitButton';
import TabbedArea from '../../lib/TabbedArea';
import Table from '../../lib/Table';
import TabPane from '../../lib/TabPane';
import Tooltip from '../../lib/Tooltip';
import Well from '../../lib/Well';
/* eslint-enable */

const CodeMirror = global.CodeMirror;
const JSXTransformer = global.JSXTransformer;

const IS_MOBILE = typeof navigator !== 'undefined' && (
  navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  );

const CodeMirrorEditor = React.createClass({
  componentDidMount: function() {
    if (IS_MOBILE) {
      return;
    }

    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), {
      mode: 'javascript',
      lineNumbers: false,
      lineWrapping: true,
      matchBrackets: true,
      tabSize: 2,
      theme: 'solarized-light',
      readOnly: this.props.readOnly
    });
    this.editor.on('change', this.handleChange);
  },

  componentDidUpdate: function() {
    if (this.props.readOnly) {
      this.editor.setValue(this.props.codeText);
    }
  },

  handleChange: function() {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(this.editor.getValue());
    }
  },

  render: function() {
    // wrap in a div to fully contain CodeMirror
    let editor;

    if (IS_MOBILE) {
      let preStyles = {overflow: 'scroll'};
      editor = <pre style={preStyles}>{this.props.codeText}</pre>;
    } else {
      editor = <textarea ref="editor" defaultValue={this.props.codeText} />;
    }

    return (
      <div style={this.props.style} className={this.props.className}>
        {editor}
      </div>
      );
  }
});

const selfCleaningTimeout = {
  componentDidUpdate: function() {
    clearTimeout(this.timeoutID);
  },

  setTimeout: function() {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout.apply(null, arguments);
  }
};

const ReactPlayground = React.createClass({
  mixins: [selfCleaningTimeout],

  MODES: {JSX: 'JSX', JS: 'JS', NONE: null},

  propTypes: {
    codeText: React.PropTypes.string.isRequired,
    transformer: React.PropTypes.func,
    renderCode: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      transformer: function(code) {
        return JSXTransformer.transform(code).code;
      }
    };
  },

  getInitialState: function() {
    return {
      mode: this.MODES.NONE,
      code: this.props.codeText
    };
  },

  handleCodeChange: function(value) {
    this.setState({code: value});
    this.executeCode();
  },

  handleCodeModeSwitch: function(mode) {
    this.setState({mode: mode});
  },

  handleCodeModeToggle: function(e) {
    let mode;

    e.preventDefault();

    switch (this.state.mode) {
      case this.MODES.NONE:
        mode = this.MODES.JSX;
        break;
      case this.MODES.JSX:
      default:
        mode = this.MODES.NONE;
    }

    this.setState({mode: mode});
  },

  compileCode: function() {
    return this.props.transformer(this.state.code);
  },

  render: function() {
    let classes = {
      'bs-example': true
    };
    let toggleClasses = {
      'code-toggle': true
    };
    let editor;

    if (this.props.exampleClassName){
      classes[this.props.exampleClassName] = true;
    }

    if (this.state.mode !== this.MODES.NONE) {
       editor = (
           <CodeMirrorEditor
             key="jsx"
             onChange={this.handleCodeChange}
             className="highlight"
             codeText={this.state.code}/>
        );
       toggleClasses.open = true;
    }
    return (
      <div className="playground">
        <div className={classSet(classes)}>
          <div ref="mount" />
        </div>
        {editor}
        <a className={classSet(toggleClasses)} onClick={this.handleCodeModeToggle} href="#">{this.state.mode === this.MODES.NONE ? 'show code' : 'hide code'}</a>
      </div>
      );
  },

  componentDidMount: function() {
    this.executeCode();
  },

  componentWillUpdate: function(nextProps, nextState) {
    // execute code only when the state's not being updated by switching tab
    // this avoids re-displaying the error, which comes after a certain delay
    if (this.state.code !== nextState.code) {
      this.executeCode();
    }
  },

  componentWillUnmount: function() {
    let mountNode = this.refs.mount.getDOMNode();
    try {
      React.unmountComponentAtNode(mountNode);
    } catch (e) { }
  },

  executeCode: function() {
    let mountNode = this.refs.mount.getDOMNode();

    try {
      React.unmountComponentAtNode(mountNode);
    } catch (e) { }

    try {
      let compiledCode = this.compileCode();
      if (this.props.renderCode) {
        React.render(
          <CodeMirrorEditor codeText={compiledCode} readOnly={true} />,
          mountNode
        );
      } else {
        /* eslint-disable */
        eval(compiledCode);
        /* eslint-enable */
      }
    } catch (err) {
      this.setTimeout(function() {
        React.render(
          <Alert bsStyle="danger">{err.toString()}</Alert>,
          mountNode
        );
      }, 500);
    }
  }
});

export default ReactPlayground;
